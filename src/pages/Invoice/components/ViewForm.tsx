import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bill } from "@/types/types";
import { Calculator } from "lucide-react";

interface ViewBillFormProps {
  bill: Bill | null;
}

const ViewBillForm: React.FC<ViewBillFormProps> = ({ bill }) => {
  const [formData, setFormData] = useState<Bill | null>(bill);

  useEffect(() => {
    setFormData(bill);
  }, [bill]);

  const totalAmount = useMemo(() => {
    if (!formData) return 0;
    const subtotal = Number(formData.cost_room) + Number(formData.cost_service);
    const discountAmount = (subtotal * Number(formData.discount)) / 100;
    return subtotal - discountAmount;
  }, [formData?.cost_room, formData?.cost_service, formData?.discount]);

  if (!bill || !formData) return null;

  return (
    <div className="w-full p-6 space-y-8">
      {/* Thông tin cơ bản */}
      <Card className="p-6 space-y-4 shadow-sm rounded-lg border">
        <h3 className="font-semibold text-lg text-gray-800">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bill_name" className="text-gray-600">Tên hóa đơn</Label>
            <Input
              id="bill_name"
              name="bill_name"
              value={formData.bill_name}
              disabled
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="customer_name" className="text-gray-600">Khách hàng</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              disabled
              className="bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="roomname" className="text-gray-600">Phòng</Label>
            <Input
              id="roomname"
              name="roomname"
              value={formData.roomname}
              disabled
              className="bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="due_date" className="text-gray-600">Hạn thanh toán</Label>
            <Input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date?.split("T")[0]}
              disabled
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Chi phí và giảm giá */}
      <Card className="p-6 space-y-4 shadow-sm rounded-lg border">
        <h3 className="font-semibold text-lg text-gray-800">Chi phí và giảm giá</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="cost_room" className="text-gray-600">Tiền phòng (VND)</Label>
            <Input
              type="number"
              id="cost_room"
              name="cost_room"
              value={formData.cost_room}
              disabled
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="cost_service" className="text-gray-600">Tiền dịch vụ (VND)</Label>
            <Input
              type="number"
              id="cost_service"
              name="cost_service"
              value={formData.cost_service}
              disabled
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="discount" className="text-gray-600">Giảm giá (%)</Label>
            <Input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              disabled
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between border border-blue-200">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-themeColor" />
            <span className="font-medium text-gray-700">Tổng tiền sau giảm giá:</span>
          </div>
          <span className="text-lg font-semibold text-themeColor">
            {totalAmount.toLocaleString('vi-VN')} VND
          </span>
        </div>
      </Card>

      {/* Ghi chú */}
      <Card className="p-6 shadow-sm rounded-lg border">
        <Label htmlFor="note" className="text-gray-600">Ghi chú</Label>
        <Textarea
          id="note"
          name="note"
          value={formData.note}
          disabled
          className="w-full min-h-[100px]"
          placeholder="Nhập ghi chú cho hóa đơn..."
        />
      </Card>
    </div>
  );
};

export default ViewBillForm;
