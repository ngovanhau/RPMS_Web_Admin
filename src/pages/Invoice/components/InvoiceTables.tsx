import React from "react";
import { Bill } from "@/types/types";

interface InvoiceTableProps {
  bills: Bill[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ bills }) => {
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
      0: { label: "Chờ xử lý", className: "bg-yellow-400" },
      1: { label: "Đã xử lý", className: "bg-blue-600" },
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
      2: { label: "Thanh toán một phần", className: "bg-yellow-400" },
    };
    return (
      statusMap[status_payment as keyof typeof statusMap] || {
        label: "Unknown",
        className: "bg-gray-500",
      }
    );
  };

  return (
    // Container có chiều rộng cố định và cho phép scroll
    <div className="w-full max-w-[82vw] overflow-x-auto">
      <table className="w-max table-auto text-sm text-left">
        <thead className="text-sm bg-blue-100 text-blue-700">
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
              "Thanh toán",
              "Ghi chú",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-2 whitespace-nowrap text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr
              key={bill.id}
              className="border-b hover:bg-blue-50 text-blue-900"
            >
              <td className="px-4 py-2 font-medium whitespace-nowrap text-center">
                {bill.id}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center">
                <div className="flex gap-2 justify-center">
                  <button className="text-green-500 hover:underline">
                    Duyệt
                  </button>
                  <button className="text-blue-500 hover:underline">
                    Sửa
                  </button>
                  <button className="text-red-500 hover:underline">
                    Xóa
                  </button>
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {bill.bill_name || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {bill.customer_name || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {bill.roomname || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatDate(bill.date)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatDate(bill.due_date)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatCurrency(bill.cost_room)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatCurrency(bill.cost_service)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatCurrency(bill.total_amount)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatCurrency(bill.penalty_amount)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatCurrency(bill.discount)}
              </td>
              <td className="px-4 py-2 font-bold whitespace-nowrap">
                {formatCurrency(bill.final_amount)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                    getStatusBadge(bill.status).className
                  }`}
                >
                  {getStatusBadge(bill.status).label}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                    getPaymentStatusBadge(bill.status_payment).className
                  }`}
                >
                  {getPaymentStatusBadge(bill.status_payment).label}
                </span>
              </td>
              <td className="px-4 py-2 min-w-[200px]">
                {bill.note || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;