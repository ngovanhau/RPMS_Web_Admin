import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import useAuthStore from "@/stores/userStore";

const DashboardHome: React.FC = () => {

    const userData = useAuthStore((state) => state.userData);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("authToken"); 
        navigate("/"); 
    };

    return (
        <div>
            <div>
      <h1>Profile Page</h1>
      {userData ? (
        <div>
          <p>Name: {userData.email}</p>
          <p>Email: {userData.lastName}</p>
          {/* Các thuộc tính khác của user */}
        </div>
      ) : (
        <p>User is not logged in.</p>
      )}
    </div>
            <h2>Trang Dashboard</h2>
            <p>Chào mừng bạn đến với trang Dashboard!</p>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    );
};

export default DashboardHome;
