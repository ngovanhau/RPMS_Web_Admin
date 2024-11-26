import React, { useState } from "react";
import { TransactionGroup } from "@/types/types";

interface TransactionGroupFormProps {
  initialData?: TransactionGroup; // Dữ liệu ban đầu cho chỉnh sửa
  onSubmit: (data: TransactionGroup) => void; // Hàm gọi lại khi submit
  onCancel: () => void; // Hàm gọi lại khi hủy bỏ
}

const TransactionGroupForm: React.FC<TransactionGroupFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TransactionGroup>(
    initialData || {
      id: "",
      type: 0,
      name: "",
      image: "",
      note: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "type" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (formData.name.trim() === "") {
      alert("Tên nhóm không được để trống!");
      return;
    }
    onSubmit({ ...formData, id: formData.id || String(Date.now()) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên nhóm</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nhập tên nhóm"
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Loại</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value={0}>Thu</option>
          <option value={1}>Chi</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Nhập URL hình ảnh"
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Nhập ghi chú"
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default TransactionGroupForm;
