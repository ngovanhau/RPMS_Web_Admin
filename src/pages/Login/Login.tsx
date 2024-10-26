import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, information } from "../../services/userApi/userApi";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import useAuthStore from "@/stores/userStore";

const Login: React.FC = () => {
    const { setUserData } = useAuthStore();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (username === "") {
            setError("Username không được bỏ trống!");
        } else if (password === "") {
            setError("Password không được bỏ trống!");
        } else {
            try {
                const response = await login(username, password);
                if (response && response.data) {
                    localStorage.setItem("authToken", response.data);
                    handleInformation();
                } else {
                    setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
                }
            } catch (error) {
                setError("Có lỗi xảy ra khi đăng nhập.");
            }
        }
    };

    const handleInformation = async () => {
        try {
            const response = await information(username);
            setUserData(response);
            if (response.role === "ADMIN") {
                navigate("/Dashboard");
            } else {
                localStorage.removeItem("authToken");
                setError("Tài khoản của bạn không được đăng nhập vào trang ADMIN.");
            }
        } catch (error) {
            setError("Có lỗi xảy ra khi lấy thông tin người dùng.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg border border-green-100">
                <h2 className="text-3xl font-semibold text-green-500 text-center mb-6">Đăng nhập</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-50 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
                    />
                </div>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-50 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
                    />
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </span>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full p-3 bg-green-400 text-white rounded-md hover:bg-green-500 transition duration-200 font-medium"
                >
                    Đăng nhập
                </button>
            </div>
        </div>
    );
};

export default Login;
