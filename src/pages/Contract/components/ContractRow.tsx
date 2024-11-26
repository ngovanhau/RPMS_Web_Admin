import React, { useEffect } from "react";
import { Contract } from "@/types/types";
import { getbyidTenant } from "@/services/tenantApi/tenant";
import { FiTrash, FiEdit2 } from "react-icons/fi";

type ContractRowProps = {
  contract: Contract;
  onClick?: () => void; // Hàm xử lý khi click vào hàng
  onDelete: (id: string) => void; // Hàm xóa hợp đồng nhận id hợp đồng
  index: number; // Thứ tự
};

const ContractRow: React.FC<ContractRowProps> = ({
  contract,
  onClick,
  onDelete,
  index,
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

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  return (
    <tr
      className="border-b cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <td className="py-2 px-4 border border-gray-300 h-12">{index}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.customerName}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.room}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{formatDate(contract.start_day)}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{formatDate(contract.end_day)}</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.room_fee.toLocaleString()} VND</td>
      <td className="py-2 px-4 border border-gray-300 h-12">{contract.deposit.toLocaleString()} VND</td>
    </tr>
  );
};

export default ContractRow;
