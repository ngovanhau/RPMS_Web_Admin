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
import { MoreHorizontal } from "lucide-react";


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
    <div className="flex flex-row w-full h-16 cursor-pointer">
      <div className="w-[4%] border border-gray-300 px-4 flex items-center justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <MoreHorizontal/>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white ml-32">
            <DropdownMenuItem onSelect={handleDelete}>Xóa</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleEditClick}>Chỉnh sửa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-[25%] border border-gray-300 px-4 flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {service.service_name}
        </span>
      </div>
      <div className="w-[15%] border border-gray-300 px-4 flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {service.unitMeasure}
        </span>
      </div>
      <div className="w-[15%] border border-gray-300 px-4 flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {service.service_cost}
        </span>
      </div>
      <div className="w-[15%] border border-gray-300 px-4 flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {service.updatedAt ? formatDate(service.updatedAt) : "N/A"}
        </span>
      </div>
      <div className="w-[26%] border border-gray-300 px-4 flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {service.note}
        </span>
      </div>
    </div>
  );
};

export default ServiceRow;
