// Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li><Link to="/Home">Trang Chủ</Link></li>
        <li><Link to="/about">Giới Thiệu</Link></li>
        <li><Link to="/services">Dịch Vụ</Link></li>
        <li><Link to="/contact">Liên Hệ</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
