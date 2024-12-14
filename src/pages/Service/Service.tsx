import React, { useEffect, useState } from "react";
import { PlusCircle, Search, ClipboardList, Bell } from "lucide-react"; // Import các icon từ Lucide-react
import HeaderServiceRow from "./components/HeaderServiceRow";
import ServiceForm from "./components/ServiceForm";
import CustomModal from "@/components/Modal/Modal";
import ServiceRow from "./components/ServicesRow/ServicesRow";
import api from "@/services/axios";
import useServiceStore from "@/stores/servicesStore";
import useAuthStore from "@/stores/userStore";
import { Service } from "@/types/types";

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

      <div className="flex h-[95%] p-6 overflow-hidden">
        <div className="flex flex-1 flex-col py-4 px-4 w-full bg-white">
          {/* Header */}
          <div className="flex flex-row justify-between items-center pb-4 border-b">
            <div className="flex flex-row items-center gap-6">
              <div className="py-1 px-2 rounded-[6px] flex justify-center items-center"
              style={{ backgroundColor: "#004392" }}>
                <span className="text-base text-white font-bold">
                  {services.length}
                </span>
              </div>
            </div>
            {/* Add Button */}
            <div>
              <div
                className="bg-themeColor flex flex-row justify-center items-center gap-2 text-base h-11 text-white py-2 w-36 rounded-[6px] shadow hover:bg-themeColor transition duration-300"
                style={{ backgroundColor: "#004392" }}
                title="Thêm dịch vụ"
                onClick={() => {
                  setIsEdit(false);
                  setSelectedService(null);
                  setModalIsOpen(true);
                }}
              >
                <PlusCircle className="w-6 h-6 text-white cursor-pointer" />
                Thêm
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
