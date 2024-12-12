import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, information } from "../../services/userApi/userApi";
import { Eye, EyeOff, UserCircle, Lock, ArrowRight } from "lucide-react";
import useAuthStore from "@/stores/userStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserTokens } from "@/services/notificationApi/notificationApi"; 
import { getDeviceToken } from "@/services/notificationApi/notificationApi";
import { UserTokens } from "@/types/types";

const Login = () => {
  const { setUserData } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === "") {
      setError("Username không được bỏ trống!");
    } else if (password === "") {
      setError("Password không được bỏ trống!");
    } else {
      setIsLoading(true);
      try {
        // Gọi API login để lấy token
        const loginResponse = await login(username, password);
        if (loginResponse && loginResponse.data) {
          const authToken = loginResponse.data; // Lấy token từ login response
          localStorage.setItem("authToken", authToken); // Lưu token vào localStorage
          
          // Gọi API information để lấy thông tin người dùng
          const userInfoResponse = await information(username); 
          console.log(userInfoResponse)
          if (userInfoResponse) {
            
            const userId = userInfoResponse.id; // Lấy userId từ thông tin user
  
            // Lấy device token từ Firebase
            const deviceToken = await getDeviceToken();
            if (deviceToken) {
              // Tạo dữ liệu UserTokens
              const userTokenData: UserTokens = {
                userId: userId,
                device: "web", // Thiết bị hiện tại
                token: deviceToken, // Token từ Firebase
              };
  
              // Lưu thông tin user token vào cơ sở dữ liệu
              await useUserTokens(userTokenData); // Chỉ cần gọi API lưu token
            }
  
            // Lưu thông tin user vào store và điều hướng
            setUserData(userInfoResponse);
            if (userInfoResponse.role === "ADMIN" || userInfoResponse.role === "MANAGEMENT") {
              navigate("/Dashboard");
            } else {
              setError("Tài khoản của bạn không được đăng nhập vào trang ADMIN.");
            }
          } else {
            setError("Không thể lấy thông tin người dùng.");
          }
        } else {
          setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      } catch (error) {
        console.error("Error during login process:", error); // Log lỗi để kiểm tra
        setError("Có lỗi xảy ra khi đăng nhập.");
      } finally {
        setIsLoading(false);
      }
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
        
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Đăng Nhập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-400 transition-all duration-200 bg-white/50"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-400 transition-all duration-200 bg-white/50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-white">
                    Đăng nhập
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <a
                  href="/reset-password"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 RPMS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
