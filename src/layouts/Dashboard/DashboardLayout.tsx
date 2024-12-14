// src/layouts/Dashboard/DashboardLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "../Header/Header";

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex h-full max-w-screen max-h-screen overflow-hidden flex-col">
            {/* Header */}
            

            {/* Chia layout thành Sidebar và Nội dung chính */}
            <div className="flex flex-1">
                {/* Sidebar chiếm 13% chiều rộng */}
                <div className="w-[13%]">
                    <Sidebar />
                </div>

                {/* Nội dung chính chiếm 87% chiều rộng */}
                <div className="flex flex-col flex-1 w-full p-4">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
