import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteService } from "@/services/servicesApi/servicesApi";
import { Service } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

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
      handleEdit(service); 
    }
  };

  return (
    <div className="flex flex-row w-full h-16 cursor-pointer border-b border-gray-300">
      {/* Cột Thao Tác */}
      <div className="w-[7%] px-4 flex items-center justify-start border-r border-gray-300">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white ml-32">
          <DropdownMenuItem onSelect={handleEditClick}>
              <FaEdit className="w-4 h-4 text-gray-600 text-[10px]" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDelete}>
              <FaTrash className="w-4 h-4 text-gray-600 text-[10px]" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cột Tên Dịch Vụ */}
      <div className="w-[30%] px-4 flex items-center justify-start border-r border-gray-300 font-semibold text-gray-800">
        {service.service_name}
      </div>

      {/* Cột Giá Tiền */}
      <div className="w-[35%] px-4 flex flex-col justify-start border-r border-gray-300 mt-2">
        {/* Giá tiền và đơn vị */}
        <div className="font-semibold text-gray-800">
          {service.service_cost
            ? `${service.service_cost.toLocaleString()} / ${service.unitMeasure || "---"}`
            : "---"}
        </div>
        {/* Loại đơn giá */}
        <div className="text-gray-500 text-sm">
          {service.collect_fees || "---"}
        </div>
      </div>

      {/* Cột Mô Tả */}
      <div className="w-[30%] px-4 flex items-center justify-start border-r border-gray-300 font-semibold text-gray-800">
        {service.note}
      </div>
    </div>
  );
};

export default ServiceRow;
