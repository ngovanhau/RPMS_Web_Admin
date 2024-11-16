import React from "react";
import { ServiceMeterReadings } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface TableRowProps {
  ServiceMeterReadings: ServiceMeterReadings;
  onEdit: (serviceMeterReadings : ServiceMeterReadings) => void;
  onDelete: (id: string) => void;
}

const TableRow: React.FC<TableRowProps> = ({ ServiceMeterReadings, onEdit, onDelete }) => {
  return (
    <tr className="border-b h-12 hover:bg-gray-100">
      <td className="p-2 text-[#001eb4]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 focus:outline-none">
              <MoreHorizontal className="w-5 h-5 text-[#001eb4]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onEdit(ServiceMeterReadings)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(ServiceMeterReadings?.id)}>
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
