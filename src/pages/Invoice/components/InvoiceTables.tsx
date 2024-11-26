// InvoiceTable.tsx
import React from "react";
import { Bill } from "@/types/types";
import { AiOutlineCheck, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useBillStore from "@/stores/invoiceStore";

interface InvoiceTableProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void; 
  onDelete: (id: string) => void;
}


const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
};




const InvoiceTable: React.FC<InvoiceTableProps> = ({ bills, onEdit , onDelete}) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
    
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { label: "Chờ xét duyệt", className: "bg-yellow-400" },
      1: { label: "Đã xét duyệt", className: "bg-blue-600" },
      2: { label: "Đã hủy", className: "bg-red-500" },
    };
    return (
      statusMap[status as keyof typeof statusMap] || {
        label: "Unknown",
        className: "bg-gray-500",
      }
    );
  };

  const getPaymentStatusBadge = (status_payment: number) => {
    const statusMap = {
      0: { label: "Chưa thanh toán", className: "bg-red-500" },
      1: { label: "Đã thanh toán", className: "bg-green-500" },
    };
    return (
      statusMap[status_payment as keyof typeof statusMap] || {
        label: "Unknown",
        className: "bg-gray-500",
      }
    );
  };

  const calculateFinalAmount = (bill: Bill) => {
    const discountAmount = (bill.total_amount * bill.discount) / 100;
    return bill.total_amount - discountAmount + bill.penalty_amount;
  };

  return (
    // Container có chiều rộng cố định và cho phép scroll
    <div className="w-full max-w-[82vw] overflow-x-auto">
      <table className="w-full table-auto text-sm text-left"> {/* Thay từ text-base xuống text-sm */}
        <thead className="text-sm bg-themeColor text-white h-12">
          <tr>
            {[
              "Mã hóa đơn",
              "Hành động",
              "Tên hóa đơn",
              "Khách hàng",
              "Phòng",
              "Ngày tạo",
              "Hạn thanh toán",
              "Tiền phòng",
              "Tiền dịch vụ",
              "Tổng tiền",
              "Tiền phạt",
              "Giảm giá",
              "Thành tiền",
              "Trạng thái",
              "Đã thanh toán",
              "Tiền nợ",
              "Ghi chú",
            ].map((header, index) => (
              <th
                key={index}
                className="border border-gray-300 px-4  py-2 whitespace-nowrap text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => {
            const isPaid = bill.status_payment === 1;
            return (
              <tr
                key={bill.id}
                className="border-b hover:bg-blue-50 text-blue-900 h-12"
              >
                <td className="px-4 py-2 font-medium whitespace-nowrap text-center text-sm">
                  {bill.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center text-sm">
                  <div className="flex gap-2 justify-center">
                    {bill.status === 0 ? (
                      // Actions khi hóa đơn chưa được duyệt
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AiOutlineCheck
                                className="h-4 w-4 text-green-500 hover:text-green-700 cursor-pointer" 
                                // onClick={() => handleApprove(bill.id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Duyệt</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AiOutlineEdit
                                className="h-4 w-4 text-blue-500 hover:text-blue-700 cursor-pointer" 
                                onClick={() => onEdit(bill)} // Gọi hàm chỉnh sửa
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Sửa</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AiOutlineDelete
                                className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer" 
                                onClick={() => onDelete(bill.id)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xóa</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    ) : (
                      // Actions khi hóa đơn đã được duyệt
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AiOutlineDelete className="h-4 w-4 text-red-500 opacity-50 cursor-not-allowed" /> {/* Kích thước icon: h-4 w-4 */}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Xóa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {bill.bill_name || "-"}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {bill.customer_name || "-"}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {bill.roomname || "-"}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {formatDate(bill.date)}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {formatDate(bill.due_date)}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {formatCurrency(bill.cost_room)}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {formatCurrency(bill.cost_service)}
                </td>
                <td className="border border-gray-300 px-4  text-red-400 font-bold py-2 whitespace-nowrap text-sm">
                  {formatCurrency(bill.total_amount)}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {formatCurrency(bill.penalty_amount)}
                </td>
                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  {bill.discount !== undefined && bill.discount !== null
                    ? formatPercentage(bill.discount)
                    : "-"}
                </td>

                <td className="border border-gray-300 px-4  py-2 font-bold whitespace-nowrap text-sm">
                  {formatCurrency(calculateFinalAmount(bill))}
                </td>

                <td className="border border-gray-300 px-4  py-2 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                      getStatusBadge(bill.status).className
                    }`}
                  >
                    {getStatusBadge(bill.status).label}
                  </span>
                </td>

                {/* Cột "Đã thanh toán" */}
                <td
                  className={`border border-gray-300 px-4  py-2 font-bold whitespace-nowrap text-center ${
                    isPaid ? "text-red-500" : "text-sm"
                  }`}
                >
                  {isPaid
                    ? formatCurrency(bill.total_amount)
                    : formatCurrency(0)}
                </td>

                {/* Cột "Tiền nợ" */}
                <td
                  className={`border border-gray-300 px-4  py-2 font-bold whitespace-nowrap text-center ${
                    !isPaid ? "text-red-500" : "text-sm"
                  }`}
                >
                  {!isPaid
                    ? formatCurrency(bill.total_amount)
                    : formatCurrency(0)}
                </td>

                <td className="border border-gray-300 px-4  py-2 min-w-[200px] text-sm">
                  {bill.note || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
