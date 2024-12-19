import React, { useEffect, useState } from "react";
import { Transaction } from "@/types/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";

interface EditTransactionFormProps {
  transaction: Transaction;
  onSubmit: (updatedTransaction: Transaction) => void;
  onCancel: () => void;
}

const EditTransactionForm: React.FC<EditTransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Transaction>(transaction);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (key: keyof Transaction, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      date: date ? date.toISOString() : "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 overflow-hidden">
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Tòa nhà</span>
          <Select
            value={formData.buildingid}
            onValueChange={(value) => handleSelectChange("buildingid", value)}
          >
            <SelectTrigger className="w-full border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Tòa nhà" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={transaction.buildingid}>
                {transaction.buildingname}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Phòng</span>
          <Select
            value={formData.roomid}
            onValueChange={(value) => handleSelectChange("roomid", value)}
          >
            <SelectTrigger className="w-full border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Phòng" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={transaction.roomid}>
                {transaction.roomname}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Tên khách hàng</span>
          <Input
            value={formData.customername}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customername: e.target.value }))
            }
            className="border-gray-300 rounded-[8px]"
            placeholder="Tên khách hàng"
          />
        </div>
      </div>

      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Tên giao dịch</span>
          <Input
            name="namereason"
            value={formData.namereason}
            onChange={handleInputChange}
            className="border-gray-300 rounded-[8px]"
            placeholder="Tên giao dịch"
          />
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span>Nhóm giao dịch</span>
          <Select
            value={formData.transactiongroupid}
            onValueChange={(value) =>
              handleSelectChange("transactiongroupid", value)
            }
          >
            <SelectTrigger className="border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Nhóm giao dịch" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value={transaction.transactiongroupid}>
                {transaction.transactiongroupname}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span>Phương thức thanh toán</span>
          <Select
            value={formData.paymentmethod}
            onValueChange={(value) =>
              handleSelectChange("paymentmethod", value)
            }
          >
            <SelectTrigger className="border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
              <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span>Ngày thanh toán</span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-[8px] text-left flex flex-row justify-between">
                {formData.date
                  ? new Date(formData.date).toLocaleDateString("vi-VN")
                  : "Chọn ngày"}
                <CalendarDays className="text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white rounded-md shadow-md">
              <Calendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span>Số tiền</span>
          <div className="relative">
            <input
              name="amount"
              placeholder="Số tiền"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-[8px] p-2 pr-10"
            />
            <span className="absolute inset-y-0 right-2 flex items-center text-gray-500">
              VNĐ
            </span>
          </div>
        </div>
        <div className="flex flex-col w-[30%] gap-2"></div>
      </div>

      <div className="flex flex-col w-full gap-2">
        <span>Ghi chú</span>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          placeholder="Nhập ghi chú"
          className="border border-gray-300 rounded-[8px] p-2"
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-themeColor text-white rounded hover:bg-themeColor-dark"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default EditTransactionForm;
