import React from "react";
import { TransactionGroup } from "@/types/types";

interface TransactionGroupDetailProps {
  data: Partial<TransactionGroup>; // Dữ liệu nhóm giao dịch cần hiển thị
  onClose: () => void; // Hàm gọi lại để đóng modal hoặc giao diện
}

const TransactionGroupDetail: React.FC<TransactionGroupDetailProps> = ({
  data,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tên nhóm
        </label>
        <div className="mt-1 p-2 border rounded w-full bg-gray-100">
          {data.name || "Không rõ"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Loại</label>
        <div className="mt-1 p-2 border rounded w-full bg-gray-100">
          {data.type === 0 ? "Thu" : "Chi"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
        <div className="mt-1 p-2 border rounded w-full bg-gray-100">
          {data.note || "Không có ghi chú"}
        </div>
      </div>


      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default TransactionGroupDetail;
