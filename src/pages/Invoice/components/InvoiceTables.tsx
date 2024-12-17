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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Eye } from "lucide-react";

interface InvoiceTableProps {
  bills: Bill[];
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  onApproved: (bill: Bill) => void;
  onView: (bill : Bill) => void
}

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  bills,
  onEdit,
  onApproved,
  onDelete,
  onView
}) => {
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
    <div className="w-full max-w-[80vw] overflow-x-auto">
      <table className="w-full table-auto text-sm text-left">
        {" "}
        {/* Thay từ text-base xuống text-sm */}
        <thead className="text-sm border-2 min-w-[200px] border-gray-300 px-4 h-14 bg-themeColor text-white text-center">
          <tr>
            {[
              "",
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
                <td className="px-4 py-2 border-2 border-gray-300 whitespace-nowrap text-center text-sm">
                  <div className="flex gap-2 justify-center">
                    {bill.status === 0 ? (
                      // Actions khi hóa đơn chưa được duyệt
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Ellipsis />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white">
                            <DropdownMenuItem onClick={() => onApproved(bill)} >
                              <div
                                className="flex flex-row gap-4"
                              >
                                <AiOutlineCheck className="h-4 w-4 text-green-500 hover:text-green-700 cursor-pointer" />
                                <span className="text-gray-700">Duyệt</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(bill)}>
                              <div
                                className="flex flex-row gap-4"
                              >
                                <AiOutlineEdit className="h-4 w-4 text-blue-500 hover:text-blue-700 cursor-pointer" />
                                <span className="text-gray-700">Chỉnh sửa</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(bill)} >
                              <div
                                className="flex flex-row gap-4"
                              >
                                <Eye size={16} color=""/>
                                <span className="text-gray-700">Xem chi tiết</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(bill.id)}>
                              <div
                                className="flex flex-row gap-4"
                              >
                                <AiOutlineDelete className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer" />
                                <span className="text-gray-700">Xóa</span>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      // Actions khi hóa đơn đã được duyệt
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AiOutlineDelete className="h-4 w-4 text-red-500 opacity-50 cursor-not-allowed" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Không thể xóa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
                <td className="border-2 min-w-[200px] border-gray-300 px-4 h-14 text-sm text-left">
                  {bill.bill_name || "-"}
                </td>
                <td className="border-2 min-w-[200px] border-gray-300 px-4 h-14 text-sm text-left">
                  {bill.customer_name || "-"}
                </td>
                <td className="border-2 min-w-[200px] border-gray-300 px-4 h-14 text-sm text-left">
                  {bill.roomname || "-"}
                </td>
                <td className="border-2 border-gray-300 px-4 h-14 text-sm text-left">
                  {formatDate(bill.date)}
                </td>
                <td className="border-2 border-gray-300 px-4 h-14 text-sm text-left">
                  {formatDate(bill.due_date)}
                </td>
                <td className="border-2 border-gray-300 px-4 h-14 text-sm text-left">
                  {formatCurrency(bill.cost_room)}
                </td>
                <td className="border-2 border-gray-300 px-4 h-14 text-sm text-left">
                  {formatCurrency(bill.cost_service)}
                </td>
                <td className="border border-gray-300 px-4  text-red-400 font-bold py-2 whitespace-nowrap text-sm">
                  {formatCurrency(bill.total_amount)}
                </td>
                <td className="border-2 border-gray-300 px-4 h-14 text-sm text-left">
                  {formatCurrency(bill.penalty_amount)}
                </td>
                <td className="border-2 border-gray-300 px-4 h-14 text-sm text-left">
                  {bill.discount !== undefined && bill.discount !== null
                    ? formatPercentage(bill.discount)
                    : "-"}
                </td>

                <td className="border border-gray-300 px-4  py-2 font-bold whitespace-nowrap text-sm">
                  {formatCurrency(calculateFinalAmount(bill))}
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
