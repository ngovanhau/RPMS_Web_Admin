import React, { useState, useEffect } from "react";
import { Deposit } from "@/types/types";
import { Room, Tenant } from "@/types/types";

interface DepositEditFormProps {
  deposit: Deposit;
  onSubmit: (data: Deposit) => void;
  onClose: () => void;
  roomList: Room[];
  customerList: Tenant[];
}

const DepositEditForm: React.FC<DepositEditFormProps> = ({
  deposit,
  onSubmit,
  onClose,
  roomList,
  customerList,
}) => {
  const [formData, setFormData] = useState<Partial<Deposit>>({
    ...deposit,
  });

  useEffect(() => {
    setFormData(deposit);
  }, [deposit]);

  const statusMap: { [key: number]: string } = {
    0: "Đang chờ phòng",
    1: "Quá hạn",
    2: "Khách hủy cọc",
    3: "Đã tạo hợp đồng",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "roomid") {
      const selectedRoom = roomList.find((room) => room.id === value);
      setFormData((prev) => ({
        ...prev,
        roomid: value,
        roomname: selectedRoom ? selectedRoom.room_name : "",
      }));
    } else if (name === "customerid") {
      const selectedCustomer = customerList.find((customer) => customer.id === value);
      setFormData((prev) => ({
        ...prev,
        customerid: value,
        customername: selectedCustomer ? selectedCustomer.customer_name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "deposit_amount" ? Number(value.replace(/^0+/, "")) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Deposit);
    onClose();
  };

  const renderSelectOptions = (options: { id: string; name: string }[]) =>
    options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    ));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Số tiền cọc</label>
        <input
          type="number"
          name="deposit_amount"
          value={formData.deposit_amount || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phòng</label>
        <select
          name="roomid"
          value={formData.roomid}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Chọn phòng</option>
          {renderSelectOptions(
            roomList.map((room) => ({
              id: room.id,
              name: room.room_name || "",
            }))
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ngày dự kiến nhận phòng</label>
        <input
          type="date"
          name="move_in_date"
          value={formData.move_in_date?.toISOString().split("T")[0]}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Chọn phương thức</option>
          <option value="0">Chuyển khoản</option>
          <option value="1">Tiền mặt</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
        <select
          name="customerid"
          value={formData.customerid}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Chọn khách hàng</option>
          {renderSelectOptions(
            customerList.map((customer) => ({
              id: customer.id || "",
              name: customer.customer_name,
            }))
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          {Object.entries(statusMap).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Cập nhật Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
};

export default DepositEditForm;
