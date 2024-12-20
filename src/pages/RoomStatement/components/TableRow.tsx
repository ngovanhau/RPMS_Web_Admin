import React from "react";
import { ServiceMeterReadings } from "@/types/types";
import { Edit, FileText, Trash, Eye } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface TableRowProps {
  ServiceMeterReadings: ServiceMeterReadings;
  onEdit: (serviceMeterReadings: ServiceMeterReadings) => void;
  onDelete: (id: string) => void;
  onCreateBill: (serviceMeterReadings: ServiceMeterReadings) => void;
  onViewDetails: (serviceMeterReadings: ServiceMeterReadings) => void; // New prop for "View Details"
}

const TableRow: React.FC<TableRowProps> = ({
  ServiceMeterReadings,
  onEdit,
  onDelete,
  onCreateBill,
  onViewDetails, // Destructure the new prop
}) => {
  return (
    <tr className=" px-4 py-2 whitespace-nowrap text-sm">
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 focus:outline-none">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white">
            <DropdownMenuItem onClick={() => onEdit(ServiceMeterReadings)}>
              <Edit className="mr-2 h-4 w-4 " />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateBill(ServiceMeterReadings)}
            >
              <FileText className="mr-2 h-4 w-4 " />
              Tạo hóa đơn
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(ServiceMeterReadings?.id)}
            >
              <Trash className="mr-2 h-4 w-4 " />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div onClick={() => onViewDetails(ServiceMeterReadings)}>
          <Eye className="mr-2 h-4 w-4 " />
        </div>
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.building_name}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.room_name}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.status}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.recorded_by}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.record_date
          ? new Date(ServiceMeterReadings.record_date).toLocaleDateString(
              "vi-VN",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )
          : "N/A"}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.electricity_old}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.electricity_new}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.electricity_cost.toLocaleString()} đ
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.water_old}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.water_new}
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm">
        {ServiceMeterReadings.water_cost.toLocaleString()} đ
      </td>
      <td className="border-2 border-gray-300 px-4 py-2 whitespace-nowrap text-sm font-semibold">
        {ServiceMeterReadings.total_amount.toLocaleString()} đ
      </td>
    </tr>
  );
};

export default TableRow;
