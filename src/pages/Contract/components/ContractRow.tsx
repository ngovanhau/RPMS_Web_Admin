import React, { useEffect, useState, useRef } from "react";
import { Contract } from "@/types/types";
import { getbyidTenant } from "@/services/tenantApi/tenant";
import { FiTrash, FiEdit2, FiMoreHorizontal, FiPrinter } from "react-icons/fi";
import { formatDateTime } from "@/config/config";

type ContractRowProps = {
  contract: Contract;
  onClick?: () => void; // Hàm xử lý khi click vào hàng
  onDelete: (id: string) => void; // Hàm xóa hợp đồng nhận id hợp đồng
  onEdit: ( contract : Contract) => void;  // Hàm sửa hợp đồng
  onPrint: (id: string) => void;  // Hàm in hợp đồng
  index: number; // Thứ tự
};

const ContractRow: React.FC<ContractRowProps> = ({
  contract,
  onClick,
  onDelete,
  onEdit,
  onPrint,
  index,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown visibility
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Reference for dropdown container
  const dropdownButtonRef = useRef<HTMLButtonElement | null>(null); // Reference for dropdown button

  useEffect(() => {
    if (contract?.customerId) {
      fetchUserData(contract.customerId);
    }

    // Close dropdown if user clicks outside
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        dropdownButtonRef.current && 
        !dropdownButtonRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false); // Close the dropdown if clicked outside
      }
    };

    // Add event listener
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contract.customerId]);

  const fetchUserData = async (userId: string) => {
    if (contract !== null) {
      await getbyidTenant(userId);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngừng sự kiện lan truyền khi nhấn vào ba chấm
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Ngừng sự kiện lan truyền khi chọn các mục trong dropdown
  const handleMenuItemClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Ngừng sự kiện lan truyền
    action(); // Thực hiện hành động như sửa, xóa, in
  };

  return (
    <tr
      className="border-b cursor-pointer hover:bg-gray-100"
      onClick={onClick} // Vẫn giữ onClick cho toàn bộ hàng trừ cột ba chấm
    >
      <td className="py-2 px-4 border border-gray-300 h-12 relative">
        {/* Dropdown Button with three dots */}
        <button 
          onClick={toggleDropdown} 
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          ref={dropdownButtonRef}
        >
          <FiMoreHorizontal />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div 
            className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10"
            ref={dropdownRef}
          >
            <ul className="list-none p-2">
              <li 
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-green-500" 
                onClick={(e) => handleMenuItemClick(e, () => onEdit(contract))}
              >
                <FiEdit2 className="mr-2" /> Sửa
              </li>
              <li 
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-red-500" 
                onClick={(e) => handleMenuItemClick(e, () => onDelete(contract.id))}
              >
                <FiTrash className="mr-2" /> Xóa
              </li>
              <li 
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-themeColor" 
                onClick={(e) => handleMenuItemClick(e, () => onPrint(contract.id))}
              >
                <FiPrinter className="mr-2" /> In
              </li>
            </ul>
          </div>
        )}
      </td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.customerName}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.room}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{formatDateTime(contract.start_day)}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{formatDateTime(contract.end_day)}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.room_fee.toLocaleString()} VND</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.deposit.toLocaleString()} VND</td>
    </tr>
  );
};

export default ContractRow;
