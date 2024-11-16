import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

const Header: React.FC = () => (
  <div className="h-[5%] w-full flex items-center justify-between px-6 gap-4 border-b bg-white shadow-sm">
    <div className="flex items-center gap-2 w-full">
      <FaSearch className="text-gray-500" />
      <input
        type="text"
        className="w-full border-none focus:outline-none text-sm rounded px-2 py-1"
        placeholder="Tìm kiếm cọc giữ chỗ"
      />
      <FaBell className="text-gray-500" />
    </div>
  </div>
);

export default Header;
