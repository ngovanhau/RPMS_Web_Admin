import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const DasboardHome: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken"); 
        navigate("/"); 
    };

    return (
        <div>
            <h2>Trang Dashboard</h2>
            <p>Chào mừng bạn đến với trang Dashboard!</p>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
};

export default DasboardHome;
