// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import DashboardHome from "./pages/Home/Home"; // Đảm bảo tên đúng
import DashboardLayout from "./layouts/Dasboard/DashboardLayout";

const App: React.FC = () => {
    return (
        <Router>  
            <div className="flex flex-col h-full bg-red-500">
                <Routes>
                    <Route path="/" element={<Login />} /> 
                    <Route path="/Home" element={<DashboardHome />} /> {/* Sửa tên thành DashboardHome */}
                    <Route path="/Dashboard" element={<DashboardLayout />}>
                        <Route path="home" element={<DashboardHome />} /> {/* Sửa tên thành DashboardHome */}
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
