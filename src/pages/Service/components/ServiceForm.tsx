// ServiceForm.tsx

import { createService, updateService } from "@/services/servicesApi/servicesApi";
import { Service } from "@/types/types";
import React, { useState, useEffect } from "react";

interface ServiceFormProps {
  onSuccess: () => void;
  onClose: () => void;
  isEdit?: boolean; // Để biết là chế độ chỉnh sửa hay thêm mới
  initialService?: Service | null; // Service được truyền vào nếu chỉnh sửa
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSuccess,
  onClose,
  isEdit = false,
  initialService,
}) => {
  // State duy nhất lưu trữ tất cả thông tin của dịch vụ
  const [service, setService] = useState<Service>(
    initialService || {
      service_name: "",
      collect_fees: "",
      unitMeasure: "",
      service_cost: 0,
      note: "",
      image: "string", // Placeholder cho ảnh dịch vụ
    }
  );
  const [monthlyCharge, setMonthlyCharge] = useState(false);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  // Hàm xử lý thay đổi giá trị
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [id]: value,
    }));
  };

  // Hàm xử lý khi người dùng gửi form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (isEdit) {
        // Logic để cập nhật dịch vụ
        await updateService(service);
        
      } else {
        await createService(service);
      }
      onSuccess(); // Gọi callback sau khi tạo hoặc cập nhật thành công
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to create or update service:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 bg-white">
      <div className="mb-4">
        <label
          htmlFor="service_name"
          className="block text-gray-700 font-semibold mb-1"
        >
          Tên dịch vụ *
        </label>
        <input
          type="text"
          id="service_name"
          value={service.service_name}
          onChange={handleChange}
          placeholder="Điện, nước, thang máy, bảo vệ"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="collect_fees"
          className="block text-gray-700 font-semibold mb-1"
        >
          Thu phí dựa trên *
        </label>
        <select
          id="collect_fees"
          value={service.collect_fees}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        >
          <option value="">Lũy tiến theo chỉ số, phòng, người, số lần</option>
          <option value="chỉ số">Đo chỉ số</option>
          <option value="phòng">Phòng</option>
          <option value="người">Người</option>
          <option value="số lần">Số lần</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="unitMeasure"
          className="block text-gray-700 font-semibold mb-1"
        >
          Đơn vị đo *
        </label>
        <input
          type="text"
          id="unitMeasure"
          value={service.unitMeasure}
          onChange={handleChange}
          placeholder="Kwh, m3,..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="service_cost"
          className="block text-gray-700 font-semibold mb-1"
        >
          Phí dịch vụ *
        </label>
        <input
          type="number"
          id="service_cost"
          value={service.service_cost}
          onChange={(e) =>
            setService((prev) => ({
              ...prev,
              service_cost: parseFloat(e.target.value),
            }))
          }
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="monthlyCharge"
            checked={monthlyCharge}
            onChange={(e) => setMonthlyCharge(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="monthlyCharge" className="text-gray-700">
            Thu theo tháng
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="note"
          className="block text-gray-700 font-semibold mb-1"
        >
          Ghi chú
        </label>
        <textarea
          id="note"
          value={service.note}
          onChange={handleChange}
          placeholder="Nhập ghi chú"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`${
            isEdit ? "bg-yellow-500" : "bg-themeColor"
          } text-white py-2 px-6 rounded-md shadow hover:${
            isEdit ? "bg-yellow-600" : "bg-themeColor"
          } transition`}
        >
          {isEdit ? "Chỉnh sửa" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
