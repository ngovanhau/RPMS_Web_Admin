// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, information } from "../../services/userApi/userApi";
import './Login.css';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'; 
import {anhlogin, chiphi, doanhnghiep, quanly, quytrinh, ungdung} from '../../assets/index';

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(username === ""){
            setError("Username không được bỏ trống !");
        }else if(password === ""){
            setError("Password không được bỏ trống !");
        }else{
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
        <div className="login-page">
            <div className="welcome-container">
            <h2 className="welcome-title">Welcome!</h2>
                <div className="right-welcom">
                <img src={ungdung} alt="Welcome" className="welcome-image-quytrinh" />
                <img src={doanhnghiep} alt="Welcome" className="welcome-image-doanhnghiep" />
                <img src={anhlogin} alt="Welcome" className="welcome-image" />
                </div>
                <div className="left-welcom">
                <img src={chiphi} alt="Welcome" className="welcome-image-chiphi" />
                <img src={quanly} alt="Welcome" className="welcome-image-quanly" />
                </div>
                
            </div>
            <div className="login-container">
                <h2 className="login-title">Đăng nhập</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                    />
                </div>
                <div className="input-group password-group">
                    <input
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => setShowPassword(!showPassword)} 
                    >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />} 
                    </span>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button onClick={handleLogin} className="login-button">Đăng nhập</button>
            </div>
        </div>
    );
};

export default Login;
