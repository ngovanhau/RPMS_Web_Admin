import React from "react";
import { FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AccountRowProps = {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  onEdit?: () => void; // Edit handler
  onClick?: () => void; // Edit handler
  onDelete?: () => void; // Delete handler
};

export const AccountRow: React.FC<AccountRowProps> = ({
  username,
  firstName,
  lastName,
  role,
  email,
  phone,
  onEdit,
  onDelete,
  onClick
}) => {
  return (
    <div onClick={onClick} className="flex flex-row w-full h-16 cursor-pointer items-center border-b border-gray-200 hover:bg-blue-50 transition duration-200 ease-in-out">
      {/* Three-dots menu */}
      <div className="w-[4%] flex items-center justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-themeColor hover:text-themeColor focus:outline-none">
              <FaEllipsisV className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg rounded-lg p-2 border border-gray-200">
            <DropdownMenuItem
              onClick={onDelete}
              className="p-2 text-red-500 hover:bg-red-50 flex items-center gap-2 rounded-md transition-colors duration-150"
            >
              <FaTrash className="w-4 h-4" />
              <span>Xóa</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onEdit}
              className="p-2 text-themeColor hover:bg-blue-50 flex items-center gap-2 rounded-md transition-colors duration-150"
            >
              <FaEdit className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-[25%] flex items-center justify-start">
        <span className="text-gray-800 text-sm">{username}</span>
      </div>
      <div className="w-[12%] flex items-center justify-start">
        <span className="text-gray-800 text-sm">{firstName}</span>
      </div>
      <div className="w-[12%] flex items-center justify-start">
        <span className="text-gray-800 text-sm">{lastName}</span>
      </div>
      <div className="w-[10%] flex items-center justify-start">
        <span className="text-gray-800 text-sm">{role}</span>
      </div>
      <div className="w-[23%] flex items-center justify-start">
        <span className="text-gray-800 text-sm truncate">{email}</span>
      </div>
      <div className="w-[14%] flex items-center justify-start">
        <span className="text-gray-800 text-sm">{phone}</span>
      </div>
    </div>
  );
};

export default AccountRow;
