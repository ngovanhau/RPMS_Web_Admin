// DashBoardService.tsx

import HeaderServiceRow from "./components/HeaderServiceRow";
import ServiceForm from "./components/ServiceForm";
import CustomModal from "@/components/Modal/Modal";
import ServiceRow from "@/components/ServicesRow/ServicesRow";
import api from "@/services/axios";
import { createService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import useAuthStore from "@/stores/userStore";
import { Service } from "@/types/types";
import React, { useEffect, useState } from "react";

const DashBoardService: React.FC = () => {
  const { userData } = useAuthStore();
  const { services, setServices } = useServiceStore();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchAllService = async () => {
    try {
      const response = await api.get("/service/serviceall");
      setServices(response.data.data);
      return response;
    } catch (error) {
      console.log("Có lỗi xảy ra khi lấy dữ liệu dịch vụ.");
    }
  };

  const handleDeleteSuccess = () => {
    fetchAllService(); // Cập nhật danh sách dịch vụ sau khi xóa thành công
  };

  const handleSuccess = () => {
    fetchAllService();
    setModalIsOpen(false);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsEdit(true);
    setModalIsOpen(true);
  };

  useEffect(() => {
    fetchAllService();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-gray-100  w-full overflow-y-hidden">
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b-b bg-white w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          className="w-full border-none focus:outline-none"
          placeholder="Tìm kiếm bằng tên dịch vụ"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
      </div>

      <div className="flex h-[95%] p-6 overflow-hidden">
        <div className="flex flex-1 flex-col py-4 px-4 w-full bg-white">
          <div className="flex flex-row justify-between items-center pb-4 border-b">
            <div className="flex flex-row items-center gap-6">
              <div className="py-1 px-2 rounded-[6px] flex justify-center items-center bg-green-500">
                <span className="text-base text-white font-bold">0</span>
              </div>
              <span className="text-base">0 Đã chọn</span>
            </div>
            <div>
              <div
                className="bg-green-400 flex flex-row justify-center items-center gap-2 text-base h-12 text-white py-2 w-44 rounded-[6px] shadow hover:bg-green-500 transition duration-300"
                title="Thêm dịch vụ"
                onClick={() => {
                  setIsEdit(false);
                  setSelectedService(null);
                  setModalIsOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span>Thêm</span>
              </div>
            </div>
          </div>

          {/* Header của bảng dịch vụ */}
          <HeaderServiceRow />
          {/* Hiển thị danh sách dịch vụ */}

          <div className="flex-1 w-full flex-col overflow-y-auto">
            {services.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                onDeleteSuccess={handleDeleteSuccess}
                handleEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        header={isEdit ? "Chỉnh sửa" : "Thêm mới"}
      >
        <ServiceForm
          onSuccess={handleSuccess}
          onClose={() => setModalIsOpen(false)}
          isEdit={isEdit}
          initialService={selectedService}
        />
      </CustomModal>
    </div>
  );
};

export default DashBoardService;
