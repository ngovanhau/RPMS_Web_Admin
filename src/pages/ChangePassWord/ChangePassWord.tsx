import React, { useState } from "react";
import useAuthStore from "@/stores/userStore";
import { changepassword } from "@/services/userApi/userApi";

const ChangePassWord: React.FC = () => {
    const userData = useAuthStore((state) => state.userData);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    if (!userData) {
        return <div>Không có thông tin người dùng</div>;
    }
    
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage("Vui lòng điền đầy đủ tất cả các trường");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu mới và mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const response = await changepassword(userData.username, oldPassword, newPassword);
            if (response.HttpStatus === 200) {
                setMessage("Đổi mật khẩu thành công");
            }else if(response.HttpStatus === 500){
                setMessage("Mật khâủ cũ không đúng !");
            } 
            else {
                setMessage("Đổi mật khẩu thất bại !");
            }
        } catch (error) {
            setMessage("Có lỗi xảy ra trong quá trình đổi mật khẩu" + error );
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Đổi Mật Khẩu</h1>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Mật Khẩu Cũ</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Mật Khẩu Mới</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Xác Nhận Mật Khẩu Mới</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {message && <div className={`mb-4 font-semibold ${message.includes("thành công") ? "text-green-500" : "text-red-500"}`}>{message}</div>}

            <button
                onClick={handleChangePassword}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Đổi Mật Khẩu
            </button>
        </div>
    );
};

export default ChangePassWord;