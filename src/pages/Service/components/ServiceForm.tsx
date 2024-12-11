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
  const [isFixedPrice, setIsFixedPrice] = useState(false);

  useEffect(() => {
    if (initialService) {
      setService(initialService);
      setIsFixedPrice(initialService.collect_fees === "Đơn giá cố định theo đồng hồ");
    }
  }, [initialService]);

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

  const handleCollectFeesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setIsFixedPrice(value === "Đơn giá cố định theo đồng hồ");
    setService((prevService) => ({
      ...prevService,
      collect_fees: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isEdit) {
        await updateService(service);
      } else {
        await createService(service);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create or update service:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-6 bg-white"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Tên dịch vụ */}
        <div>
          <label
            htmlFor="service_name"
            className="block text-gray-700 font-semibold mb-1  "
          >
            Tên dịch vụ *
          </label>
          <input
            type="text"
            id="service_name"
            value={service.service_name}
            onChange={handleChange}
            placeholder="Nhập tên dịch vụ"
            className="w-full p-2 border focus:outline-none focus:ring focus:ring-black-50 rounded-[8px]"
            required
          />
        </div>

        {/* Loại đơn giá */}
        <div>
          <label
            htmlFor="collect_fees"
            className="block text-gray-700 font-semibold mb-1"
          >
            Loại đơn giá *
          </label>
          <select
            id="collect_fees"
            value={service.collect_fees || ""}
            onChange={handleCollectFeesChange}
            className="w-full p-2 border rounded-[8px] focus:outline-none focus:ring focus:ring-blue-50 border"
            required
          >
            <option value="">Chọn loại đơn giá</option>
            <option value="Đơn giá cố định theo đồng hồ">Đơn giá cố định theo đồng hồ</option>
            <option value="Đơn giá cố định theo tháng">Đơn giá cố định theo tháng</option>
          </select>
        </div>

        {/* Đơn giá */}
        <div>
          <label
            htmlFor="service_cost"
            className="block text-gray-700 font-semibold mb-1 "
          >
            Đơn giá *
          </label>
          <input
            type="text"
            id="service_cost"
            value={service.service_cost.toLocaleString("en-US")}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              const numericValue = parseFloat(rawValue) || 0;
              setService((prev) => ({
                ...prev,
                service_cost: numericValue,
              }));
            }}
            placeholder="Nhập đơn giá"
            className="w-full p-2 border focus:outline-none focus:ring focus:ring-black-50 border rounded-[8px]"
          />
        </div>

        {/* Đơn vị tính */}
        {isFixedPrice && (
          <div>
            <label
              htmlFor="unitMeasure"
              className="block text-gray-700 font-semibold mb-1"
            >
              Đơn vị tính *
            </label>
            <input
              type="text"
              id="unitMeasure"
              value={service.unitMeasure}
              onChange={handleChange}
              placeholder="Kwh, m3,..."
              className="w-full p-2 border focus:outline-none focus:ring focus:ring-black-50 border rounded-[8px]"
              required
            />
          </div>
        )}
      </div>

      {/* Mô tả */}
      <div>
        <label
          htmlFor="note"
          className="block text-gray-700 font-semibold mb-1"
        >
          Mô tả
        </label>
        <textarea
          id="note"
          value={service.note}
          onChange={handleChange}
          placeholder="Nhập mô tả"
          className="w-full p-2 border focus:outline-none focus:ring focus:ring-black-50  rounded-[8px]"
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          style={{ backgroundColor: "#004392" }}
          className={`${
            isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white py-2 px-6 rounded-[8px] mt-4 shadow transition`}
        >
          {isEdit ? "Chỉnh sửa" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
