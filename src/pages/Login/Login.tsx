import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, information } from "../../services/userApi/userApi";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'; 
import { anhlogin, chiphi, doanhnghiep, quanly, quytrinh, ungdung } from '../../assets/index';

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (username === "") {
            setError("Username không được bỏ trống !");
        } else if (password === "") {
            setError("Password không được bỏ trống !");
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
            if (response.data.role === "ADMIN") {
                setError("Đăng nhập thành công.");
                navigate("/Home");
            } else {
                localStorage.removeItem("authToken");
                setError("Tài khoản của bạn không được đăng nhập vào trang ADMIN.");
            }
        } catch (error) {
            setError("Có lỗi xảy ra khi lấy thông tin người dùng.");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 overflow-hidden">
            <div className="bg-white rounded-lg shadow-md p-5 w-[20%] text-center bg-blue-500">
                <h2 className="text-blue-800 mb-5 text-xl">Đăng nhập</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-200 w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-200 w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <span 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500" 
                        onClick={() => setShowPassword(!showPassword)} 
                    >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />} 
                    </span>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button onClick={handleLogin} className="w-full p-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition duration-300">
                    Đăng nhập
                </button>
            </div>
            <div className="flex flex-col items-center  mr-12 w-[40%]">
                <h2 className="text-2xl text-blue-800 mb-5">Welcome!</h2>
                <div className="flex flex-row justify-center mb-2">
                    <img src={ungdung} alt="Welcome" className="w-52 h-auto rounded-lg m-1" />
                    <img src={doanhnghiep} alt="Welcome" className="w-52 h-auto rounded-lg m-1" />
                    <img src={anhlogin} alt="Welcome" className="w-52 h-auto rounded-lg m-1" />
                </div>
                <div className="flex flex-row justify-center mb-2">
                    <img src={chiphi} alt="Welcome" className="w-52 h-auto rounded-lg m-1" />
                    <img src={quanly} alt="Welcome" className="w-52 h-auto rounded-lg m-1" />
                </div>
            </div>
            
        </div>
    );
};

export default Login;
