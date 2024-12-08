import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaEdit, FaTrash, FaFileSignature } from "react-icons/fa";
import { Deposit } from "@/types/types";
import { MoreHorizontal } from "lucide-react";

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
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Đăng ký sự kiện click
    document.addEventListener("click", handleClickOutside);

    // Cleanup sự kiện khi component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        className="text-gray-600 hover:text-blue-500 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation(); // Ngăn không cho sự kiện click truyền lên cha
          setMenuOpen(!menuOpen); // Toggle trạng thái menu
        }}
      >
        <MoreHorizontal />
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 bg-white border rounded shadow-lg w-44 z-50"
        >
          <button
            className="flex items-center w-full px-5 py-3"
            onClick={onEdit}
          >
            <FaEdit className="mr-3 text-blue-500" />
            Sửa
          </button>
          <button
            className="flex items-center w-full px-5 py-3 text-red-600"
            onClick={onDelete}
          >
            <FaTrash className="mr-3 text-red-500" />
            Xóa
          </button>
          <button
            className="flex items-center w-full px-5 py-3 text-green-600"
            onClick={onCreateContract}
          >
            <FaFileSignature className="mr-3 text-green-500" />
            Tạo hợp đồng
          </button>
        </div>
      )}
    </div>
  );
};

export default DepositActions;
