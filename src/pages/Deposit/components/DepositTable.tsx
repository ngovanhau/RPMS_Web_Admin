import React from "react";
import DepositActions from "./DepositActions";
import { Deposit } from "@/types/types";

interface DepositTableProps {
  deposits: Deposit[];
  statusMap: { [key: number]: string };
  onStatusChange: (id: string, status: number) => void;
}

const DepositTable: React.FC<DepositTableProps> = ({
  deposits,
  statusMap,
  onStatusChange,
}) => (
  <div className="overflow-x-auto p-4 bg-white">
    <table className="w-full text-sm rounded-lg">
      <thead className="bg-themeColor text-white">
        <tr className="h-14">
          <th className="px-4 py-2 text-left">Hành động</th>
          <th className="px-4 py-2 text-left">Tên Phòng</th>
          <th className="px-4 py-2 text-left">Số tiền cọc</th>
          <th className="px-4 py-2 text-left">Khách hàng</th>
          <th className="px-4 py-2 text-left">Phương thức thanh toán</th>
          <th className="px-4 py-2 text-left">Ngày dự kiến nhận phòng</th>
          <th className="px-4 py-2 text-left">Ghi chú</th>
          <th className="px-4 py-2 text-left">Trạng thái</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {deposits.map((item, index) => (
          <tr
            key={item.id}
            className={`${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-blue-100 h-14`}
          >
            <td className="px-4 py-2">
              <DepositActions deposit={item} />
            </td>
            <td className="px-4 py-2">{item.roomname}</td>
            <td className="px-4 py-2">{item.deposit_amount.toLocaleString()}</td>
            <td className="px-4 py-2">{item.customername}</td>
            <td className="px-4 py-2">{item.payment_method}</td>
            <td className="px-4 py-2">
              {new Date(item.move_in_date).toLocaleDateString()}
            </td>
            <td className="px-4 py-2">{item.note}</td>
            <td className="px-4 py-2">
              <select
                value={item.status}
                onChange={(e) => onStatusChange(item.id, parseInt(e.target.value))}
                className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {Object.entries(statusMap).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DepositTable;
