import React, { useEffect, useState, useRef } from "react";
import { Contract } from "@/types/types";
import { getbyidTenant } from "@/services/tenantApi/tenant";
import {
  FiTrash,
  FiEdit2,
  FiMoreHorizontal,
  FiPrinter,
  FiRefreshCcw,
  FiCheckCircle,
} from "react-icons/fi";
import { formatDateTime } from "@/config/config";
import { IoEye } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ContractRowProps = {
  contract: Contract;
  onClick?: () => void; // Hàm xử lý khi click vào hàng
  onDelete: (id: string) => void; // Hàm xóa hợp đồng nhận id hợp đồng
  onEdit: (contract: Contract) => void; // Hàm sửa hợp đồng
  onPrint: (id: string) => void; // Hàm in hợp đồng
  onExtendContract: (contract: Contract) => void;
  onLiquidationContract: (contract: Contract) => void;
  index: number; // Thứ tự
};

const ContractRow: React.FC<ContractRowProps> = ({
  contract,
  onClick,
  onDelete,
  onEdit,
  onPrint,
  onExtendContract,
  onLiquidationContract,
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

  // Ngừng sự kiện lan truyền khi chọn các mục trong dropdown
  const handleMenuItemClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Ngừng sự kiện lan truyền
    action(); // Thực hiện hành động như sửa, xóa, in
  };

  return (
    <tr className="cursor-pointer border-2 border-gray-300 shadow-none hover:bg-gray-100">
      <td className="py-2 px-4 border-2 border-gray-300 h-12">
        <div className="flex items-center justify-center space-x-4">
          {" "}
          {/* Căn giữa các phần tử và tạo khoảng cách */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
              <FiMoreHorizontal className="text-gray-600 hover:text-gray-900" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              {contract.status !== 10 && (
                <DropdownMenuItem
                  onClick={(e) =>
                    handleMenuItemClick(e, () => onEdit(contract))
                  }
                >
                  <FiEdit2 className="mr-2" /> Sửa
                </DropdownMenuItem>
              )}
              {contract.status !== 10 && (
                <DropdownMenuItem
                  onClick={(e) =>
                    handleMenuItemClick(e, () => onExtendContract(contract))
                  }
                >
                  <FiRefreshCcw className="mr-2" /> Gia hạn
                </DropdownMenuItem>
              )}

              {contract.status !== 10 && (
                <DropdownMenuItem
                  onClick={(e) =>
                    handleMenuItemClick(e, () =>
                      onLiquidationContract(contract)
                    )
                  }
                >
                  <FiCheckCircle className="mr-2" /> Thanh lý
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) =>
                  handleMenuItemClick(e, () => onDelete(contract.id))
                }
              >
                <FiTrash className="mr-2" /> Xóa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) =>
                  handleMenuItemClick(e, () => onPrint(contract.id))
                }
              >
                <FiPrinter className="mr-2" /> In
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <IoEye onClick={onClick} className="w-5 h-5 text-themeColor" />
        </div>
      </td>

      <td className="py-2 px-4 border-2 border-gray-300 h-12">
        {contract.customerName}
      </td>
      <td className="py-2 px-4 border-2 border-gray-300 h-12">
        {contract.room}
      </td>
      <td className="py-2 px-4 border-2 border-gray-300 h-12">
        {formatDateTime(contract.start_day)}
      </td>
      <td className="py-2 px-4 border-2 border-gray-300 h-12">
        {formatDateTime(contract.end_day)}
      </td>
      <td className="py-2 px-4 border-2 border-gray-300 h-12">
        {contract.room_fee.toLocaleString()} VND
      </td>
      <td className="py-2 px-4 border-2 border-gray-300 h-12">
        {(() => {
          if (contract.status === 0) {
            // Nếu hợp đồng còn hiệu lực (status === 0)
            const endDate = new Date(contract.end_day);
            const currentDate = new Date();
            const diffTime = endDate.getTime() - currentDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Tính số ngày còn lại

            return (
              <div className="flex flex-row gap-2">
                <span className="inline-flex items-center text-xs px-4 py-1 rounded-full bg-green-100 text-green-700">
                  Còn hạn
                </span>
                <span className="inline-flex items-center text-xs px-4 py-1 rounded-full bg-green-100 text-green-700">
                  Còn {diffDays} ngày
                </span>
              </div>
            );
          } else if (contract.status === 14) {
            // Nếu hợp đồng đã hết hạn (status === 14)
            return (
              <div className="flex flex-row">
                <span className="inline-flex items-center text-xs px-4 py-1 rounded-full bg-gray-200 text-gray-700">
                  Hết hạn
                </span>
              </div>
            );
          } else if (contract.status === 10) {
            // Nếu hợp đồng đã thanh lý (status === 10)
            return (
              <div className="flex flex-row">
                <span className="inline-flex items-center text-xs px-4 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  Thanh lý
                </span>
              </div>
            );
          } else {
            // Trường hợp mặc định nếu không phải các status trên
            return (
              <div className="flex flex-row">
                <span className="inline-flex items-center text-xs px-4 py-1 rounded-full bg-gray-300 text-gray-700">
                  Trạng thái không xác định
                </span>
              </div>
            );
          }
        })()}
      </td>
    </tr>
  );
};

export default ContractRow;
