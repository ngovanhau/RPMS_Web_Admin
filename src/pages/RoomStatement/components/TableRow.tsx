import React from "react";
import { ServiceMeterReadings } from "@/types/types";
import { Edit, FileText, Trash } from "lucide-react";

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
}

const TableRow: React.FC<TableRowProps> = ({
  ServiceMeterReadings,
  onEdit,
  onDelete,
  onCreateBill,
}) => {
  return (
    <tr className="border-b h-12 hover:bg-gray-100">
      <td className="p-2 text-[#001eb4]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 focus:outline-none">
              <MoreHorizontal className="w-5 h-5 text-[#001eb4]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white">
            <DropdownMenuItem onClick={() => onEdit(ServiceMeterReadings)}>
              <Edit className="mr-2 h-4 w-4 text-blue-500" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateBill(ServiceMeterReadings)} // Gọi hàm tạo hóa đơn
            >
              <FileText className="mr-2 h-4 w-4 text-green-500" />
              Tạo hóa đơn
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(ServiceMeterReadings?.id)}
            >
              <Trash className="mr-2 h-4 w-4 text-red-500" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      <td className="p-3 text-[#001eb4]">
        {ServiceMeterReadings.building_name}
      </td>
      <td className="p-3 text-[#001eb4]">{ServiceMeterReadings.room_name}</td>
      <td className="p-3 text-[#001eb4]">{ServiceMeterReadings.status}</td>
      <td className="p-3 text-[#001eb4]">{ServiceMeterReadings.recorded_by}</td>
      <td className="p-3 text-[#001eb4]">
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
      <td className="p-3 text-[#001eb4]">
        {ServiceMeterReadings.electricity_old}
      </td>
      <td className="p-3 text-[#001eb4]">
        {ServiceMeterReadings.electricity_new}
      </td>
      <td className="p-3 text-[#001eb4]">
        {ServiceMeterReadings.electricity_cost}
      </td>
      <td className="p-3 text-[#001eb4]">{ServiceMeterReadings.water_old}</td>
      <td className="p-3 text-[#001eb4]">{ServiceMeterReadings.water_new}</td>
      <td className="p-3 text-[#001eb4]">{ServiceMeterReadings.water_cost}</td>
      <td className="p-3 text-[#001eb4] font-semibold">
        {ServiceMeterReadings.total_amount} đ
      </td>
    </tr>
  );
};

export default TableRow;
