import React from "react";
import { formatDate } from "@/config/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteService } from "@/services/servicesApi/servicesApi";
import { Service } from "@/types/types";

interface ServiceRowProps {
  service: Service;
  onDeleteSuccess?: () => void;
  handleEdit?: (service: Service) => void;
}

const ServiceRow: React.FC<ServiceRowProps> = ({
  service,
  onDeleteSuccess,
  handleEdit,
}) => {
  const handleDelete = async () => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này không?")) {
      if (service.id) {
        await deleteService(service.id);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }
    }
  };

  const handleEditClick = () => {
    if (handleEdit) {
      handleEdit(service); // Truyền dịch vụ hiện tại khi người dùng nhấn chỉnh sửa
    }
  };

  

  return (
    <div className="flex flex-row w-full h-16 cursor-pointer">
      <div className="w-[4%] flex items-center justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white ml-32">
            <DropdownMenuItem onSelect={handleDelete}>Xóa</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleEditClick}>Hiệu chỉnh</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-[25%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-xl text-left">
          {service.service_name}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-xl text-left">
          {service.unitMeasure}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-xl text-left">
          {service.service_cost}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-xl text-left">
          {service.updatedAt ? formatDate(service.updatedAt) : "N/A"}
        </span>
      </div>
      <div className="w-[24%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-xl text-left">
          {service.note}
        </span>
      </div>
    </div>
  );
};

export default ServiceRow;
