import { Bell } from "lucide-react";
import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

const Header: React.FC = () => (
  <div className="h-[5%] w-full flex items-center justify-end px-10 gap-4 border-b bg-white shadow-sm">
    <Bell className="w-6 h-6 text-themeColor cursor-pointer" />
  </div>
);

export default Header;
