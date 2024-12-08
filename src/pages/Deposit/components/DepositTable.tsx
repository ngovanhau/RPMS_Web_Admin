import React, { useState } from "react";
import DepositActions from "./DepositActions";
import DepositEditForm from "./EditDepositForm";
import { Deposit, Room, Tenant } from "@/types/types";
import { deleteDepositById } from "@/services/depositApi/depositApi";

interface DepositTableProps {
  deposits: Deposit[];
  statusMap: { [key: number]: string };
  onStatusChange: (id: string, status: number) => void;
  roomList: Room[]; // Danh sách phòng
  customerList: Tenant[]; // Danh sách khách hàng
}

const DepositTable: React.FC<DepositTableProps> = ({
  deposits,
  statusMap,
  onStatusChange,
  roomList,
  customerList,
}) => {
  const [editingDeposit, setEditingDeposit] = useState<Deposit | null>(null);

  const handleEdit = (deposit: Deposit) => {
    setEditingDeposit(deposit); 
  };

  const handleCloseModal = () => {
    setEditingDeposit(null); // Đóng modal
  };

  const handleSubmitEdit = (updatedDeposit: Deposit) => {
    console.log("Updated deposit:", updatedDeposit);
    // Thực hiện logic cập nhật dữ liệu ở đây, ví dụ: gọi API
    setEditingDeposit(null); // Đóng modal sau khi chỉnh sửa
  };
  
  const handleDelete = async ( depositId : string ) => {
    await deleteDepositById(depositId)
  }

  return (
    <div className="overflow-y-auto h-[80vh] ">
      <table className="w-full text-sm rounded-lg">
        <thead className="bg-themeColor text-white sticky top-0">
          <tr className="h-14">
            <th className="px-4 py-2 text-left"></th>
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
              <td className="px-4 py-2 relative">
                <DepositActions
                  deposit={item}
                  onEdit={() => handleEdit(item)} // Truyền dữ liệu khoản cọc vào hàm handleEdit
                  onDelete={() => handleDelete(item.id)}
                  onCreateContract={() => console.log("Tạo hợp đồng", item.id)}
                />
              </td>
              <td className="px-4 py-2">{item.roomname}</td>
              <td className="px-4 py-2">
                {item.deposit_amount.toLocaleString()}
              </td>
              <td className="px-4 py-2">{item.customername}</td>
              <td className="px-4 py-2">{item.payment_method}</td>
              <td className="px-4 py-2">
                {new Date(item.move_in_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{item.note}</td>
              <td className="px-4 py-2">
                <select
                  value={item.status}
                  onChange={(e) =>
                    onStatusChange(item.id, parseInt(e.target.value))
                  }
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

      {/* Hiển thị Modal sửa */}
      {editingDeposit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa khoản cọc</h2>
            <DepositEditForm
              deposit={editingDeposit}
              onSubmit={handleSubmitEdit}
              onClose={handleCloseModal}
              roomList={roomList} // Truyền danh sách phòng
              customerList={customerList} // Truyền danh sách khách hàng
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositTable;
