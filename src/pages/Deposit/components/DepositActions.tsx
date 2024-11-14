import React, { useState } from "react";
import { FaEllipsisV, FaEdit, FaTrash, FaFileSignature } from "react-icons/fa";
import { Deposit } from "@/types/types";

interface DepositActionsProps {
  deposit: Deposit;
  onEdit?: () => void;
  onDelete?: () => void;
  onCreateContract?: () => void;
}

const DepositActions: React.FC<DepositActionsProps> = ({
  deposit,
  onEdit,
  onDelete,
  onCreateContract,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="text-gray-600 hover:text-blue-500 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaEllipsisV />
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-44">
          <button className="flex items-center w-full px-5 py-3" onClick={onEdit}>
            <FaEdit className="mr-3 text-blue-500" />
            Sửa
          </button>
          <button className="flex items-center w-full px-5 py-3 text-red-600" onClick={onDelete}>
            <FaTrash className="mr-3 text-red-500" />
            Xóa
          </button>
          <button className="flex items-center w-full px-5 py-3 text-green-600" onClick={onCreateContract}>
            <FaFileSignature className="mr-3 text-green-500" />
            Tạo hợp đồng
          </button>
        </div>
      )}
    </div>
  );
};

export default DepositActions;
