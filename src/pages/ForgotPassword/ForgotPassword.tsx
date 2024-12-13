import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotpassword, verifyotp, updatepassword } from "@/services/userApi/userApi";
import { Card, Button, message } from "antd";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Track the current step (1: Email, 2: OTP, 3: New Password)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill("")); // OTP array for 6 digits
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await forgotpassword(email);
      if (response.httpStatus === 200) {
        setStep(2); // Move to OTP step after email is sent
        message.success("OTP đã được gửi đến email của bạn.");
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      message.error("Lỗi khi gửi OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // Only keep the last digit
    setOtp(updatedOtp);

    // Auto-focus the next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
        setLoading(true);
        const otpString = otp.join(""); // Combine OTP digits into a single string
        const response = await verifyotp(email, otpString);
        if (response.httpStatus === 200) {
            setStep(3); // Move to New Password step only if OTP is correct
            message.success("OTP xác thực thành công.");
        } else {
            message.error("OTP không đúng, vui lòng thử lại."); // Show error and stay on Step 2
        }
    } catch (error) {
        message.error("Mã xác thực không đúng, vui lòng kiểm tra lại email.");
    } finally {
        setLoading(false); // Ensure loading is reset
    }
};


  const handleUpdatePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        message.error("Mật khẩu mới không khớp!");
        return;
      }
      setLoading(true);
      const otpString = otp.join("");
      const response = await updatepassword(email, otpString, newPassword); // Pass OTP in the API call
      if (response.httpStatus === 200) {
        message.success("Mật khẩu đã được thay đổi thành công.");
        navigate("/"); // Redirect to login after successful password update
      } else {
        message.error("Có lỗi xảy ra khi cập nhật mật khẩu.");
      }
    } catch (error) {
      message.error("Lỗi khi thay đổi mật khẩu, có thể do OTP hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">ADMIN RPMS</h1>
          <p className="text-gray-500">Hệ thống quản lý nhà cho thuê</p>
        </div>

        {step === 1 && (
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-center text-blue-600">Quên mật khẩu</h2>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full border focus:border-blue-500 rounded-md px-4"
              />
              <Button
                type="primary"
                block
                onClick={handleForgotPassword}
                loading={loading}
                className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Gửi OTP
              </Button>
              <Button
                type="default"
                block
                href="/" 
                className="mt-4 h-12 text-base font-semibold text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Quay lại
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-center text-blue-600">Xác thực OTP</h2>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    maxLength={1}
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && otp[index] === "" && index > 0) {
                        const prevInput = document.getElementById(`otp-input-${index - 1}`);
                        if (prevInput) (prevInput as HTMLInputElement).focus();
                      }
                    }}
                  />
                ))}
              </div>
              <Button
                type="primary"
                block
                onClick={handleVerifyOtp}
                loading={loading}
                className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Xác thực OTP
              </Button>
              <Button
                type="default"
                block
                onClick={() => setStep(1)} // Go back to Email step
                className="mt-4 h-12 text-base font-semibold text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Quay lại
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <div className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-center text-blue-600">Đặt lại mật khẩu</h2>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full border focus:border-blue-500 rounded-md px-4"
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full border focus:border-blue-500 rounded-md px-4"
              />
              <Button
                type="primary"
                block
                onClick={handleUpdatePassword}
                loading={loading}
                className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Cập nhật mật khẩu
              </Button>
              <Button
                type="default"
                block
                onClick={() => setStep(2)} // Go back to OTP step
                className="mt-4 h-12 text-base font-semibold text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Quay lại
              </Button>
            </div>
          </Card>
        )}

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 RPMS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
