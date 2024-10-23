import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken"); 
        navigate("/"); 
    };

    return (
        <div>
            <Sidebar />
            <h2>Trang Dashboard</h2>
            <p>Chào mừng bạn đến với trang Dashboard!</p>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
};

export default Home;
