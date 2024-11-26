import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomModal from "@/components/Modal/Modal";
import { Bill } from "@/types/types";
import { Calculator } from "lucide-react";

interface EditBillFormProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onSave: (updatedBill: Bill) => void;
}

const EditBillForm: React.FC<EditBillFormProps> = ({
  isOpen,
  onClose,
  bill,
  onSave,
}) => {
  const [formData, setFormData] = useState<Bill | null>(bill);

  useEffect(() => {
    setFormData(bill);
  }, [bill]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev ? { ...prev, [name]: value } : prev
    );
  };

  const totalAmount = useMemo(() => {
    if (!formData) return 0;
    const subtotal = Number(formData.cost_room) + Number(formData.cost_service);
    const discountAmount = (subtotal * Number(formData.discount)) / 100;
    return subtotal - discountAmount;
  }, [formData?.cost_room, formData?.cost_service, formData?.discount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen || !bill || !formData) return null;

  return (
    <CustomModal
      header="Chỉnh sửa hóa đơn"
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-2xl"
      overlayClassName="bg-black/60"
      headerClassName="text-xl font-semibold text-center"
      contentClassName="p-6 space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={handleChange}
                className="w-full"
                required
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
                onChange={handleChange}
                className="w-full"
                required
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
                onChange={handleChange}
                className="w-full"
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="cost_service" className="text-gray-600">Tiền dịch vụ (VND)</Label>
              <Input
                type="number"
                id="cost_service"
                name="cost_service"
                value={formData.cost_service}
                onChange={handleChange}
                className="w-full"
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="discount" className="text-gray-600">Giảm giá (%)</Label>
              <Input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full"
                min="0"
                max="100"
                required
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
            onChange={handleChange}
            className="w-full min-h-[100px]"
            placeholder="Nhập ghi chú cho hóa đơn..."
          />
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default EditBillForm;
