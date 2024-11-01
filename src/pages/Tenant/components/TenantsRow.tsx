import React from "react";
import { formatDate } from "@/config/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTenant } from "@/services/tenantApi/tenant";
import { Tenant } from "@/types/types";

interface TenantsRowProps {
  tenant: Tenant;
  onDeleteSuccess?: () => void;
  handleEdit?: (tenant: Tenant) => void;
}

const TenantRow: React.FC<TenantsRowProps> = ({
    tenant,
  onDeleteSuccess,
  handleEdit,
}) => {
  const handleDelete = async () => {
    if (confirm("Bạn có chắc muốn xóa khách hàng này không?")) {
      if (tenant.id) {
        await deleteTenant(tenant.id);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }
    }
  };

  const handleEditClick = () => {
    if (handleEdit) {
      handleEdit(tenant); 
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
            <DropdownMenuItem onSelect={handleEditClick}>Chỉnh sửa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-[25%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {tenant.customer_name}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {tenant.roomName}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {tenant.phone_number}
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {tenant.cccd}
        </span>
      </div>
      <div className="w-[24%] flex items-center justify-start">
        <span className="text-gray-600 font-semibold text-[15px] text-left">
          {tenant.date_of_issue}
        </span>
      </div>
    </div>
  );
};

export default TenantRow;
