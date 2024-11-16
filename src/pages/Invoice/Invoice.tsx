import React from "react";
import { Search, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import InvoiceTable from "./components/InvoiceTables";
import { Bill } from "@/types/types";

const DashBoardInvoice: React.FC = () => {
  const bills: Bill[] = [
    {
      id: "1",
      bill_name: "Bill January",
      status: 1,
      status_payment: 1,
      building_id: "b1",
      customer_name: "John Doe",
      customer_id: "c1",
      date: "2024-01-15T00:00:00Z",
      roomid: "r1",
      roomname: "Room 101",
      payment_date: "2024-01-20T00:00:00Z",
      due_date: "2024-01-30T00:00:00Z",
      cost_room: 1000000,
      cost_service: 200000,
      total_amount: 1200000,
      penalty_amount: 0,
      discount: 50000,
      final_amount: 1150000,
      note: "Regular monthly bill",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    // Thêm hóa đơn khác nếu cần
  ];

  return (
    <div className="flex flex-col flex-1 bg-blue-50 w-full h-screen overflow-auto">
      {/* Header */}
      <div className="flex flex-row px-6 gap-4 items-center justify-between border-b bg-white w-full h-16">
        <div className="flex items-center gap-4 w-full max-w-md">
          <Search className="w-5 h-5 text-blue-600" />
          <input
            className="w-full text-sm border-none focus:outline-none"
            placeholder="Tìm kiếm hóa đơn"
          />
        </div>
        <Bell className="w-5 h-5 text-blue-600" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-6 overflow-auto">
        <Card className="flex flex-col rounded-lg p-4 w-full bg-white shadow-lg">
          <h1 className="text-lg font-bold text-blue-600 mb-4">
            Danh sách hóa đơn
          </h1>
          <InvoiceTable bills={bills} />
        </Card>
      </div>
    </div>
  );
};

export default DashBoardInvoice;
