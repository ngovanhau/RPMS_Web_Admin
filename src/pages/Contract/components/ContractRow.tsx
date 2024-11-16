import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contract } from "@/types/types";
import { FiMoreVertical } from "react-icons/fi";
import { FiTrash, FiEdit2 } from "react-icons/fi";
import { getbyidTenant } from "@/services/tenantApi/tenant";

type ContractRowProps = {
  contract: Contract;
  onClick?: () => void; // Hàm xử lý khi click vào hàng
  onDelete: (id: string) => void; // Hàm xóa hợp đồng nhận id hợp đồng
};

export const ContractRow: React.FC<ContractRowProps> = ({
  contract,
  onClick,
  onDelete,
}) => {

  useEffect(() => {
    if (contract?.customerId) {
      fetchUserData(contract.customerId);
    }
  }, [contract.customerId]); 
  

  const fetchUserData = async (userId: string) => {
    if (contract !== null) {
      await getbyidTenant(userId);
    }
  };


  // Hàm xử lý xóa hợp đồng
  const handleDelete = () => {
    onDelete(contract.id); // Gọi hàm xóa với id của hợp đồng
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  return (
    <div
      className="flex flex-row w-full h-16 cursor-pointer border-b"
      onClick={onClick}
    >
      <div className="w-[5%] flex items-center justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <FiMoreVertical className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white ml-32">
            <DropdownMenuItem onClick={handleDelete}>
              <FiTrash className="mr-2" /> Xóa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FiEdit2 className="mr-2" /> Hiệu chỉnh
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-[20%] flex items-center justify-start">
        <span className="text-gray-700 text-base text-left">
          {contract.customerName}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-700 text-base text-left">
          {contract.room}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-700 text-base text-left">
          {formatDate(contract.start_day)}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-700 text-base text-left">
          {formatDate(contract.end_day)}
        </span>
      </div>

      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-700 text-base text-left">
          {contract.room_fee.toLocaleString()} VND
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-700 text-base text-left">
          {contract.deposit.toLocaleString()} VND
        </span>
      </div>
    </div>
  );
};

export default ContractRow;
