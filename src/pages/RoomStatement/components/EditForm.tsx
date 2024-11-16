import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServiceMeterReadings } from '@/types/types';

interface EditMeterReadingFormProps {
  meterReading: ServiceMeterReadings; // Dữ liệu ban đầu để chỉnh sửa
  onSubmit: (updatedMeterReading: ServiceMeterReadings) => void;
  onCancel: () => void;
}

const EditMeterReadingForm: React.FC<EditMeterReadingFormProps> = ({ meterReading, onSubmit, onCancel }) => {
  const [editedMeterReading, setEditedMeterReading] = useState<ServiceMeterReadings>({ ...meterReading });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedMeterReading((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedMeterReading);
  };

  return (
    <Card className="w-full mx-auto border-0 shadow-none bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-themeColor font-bold text-center">Chỉnh Sửa Chỉ Số Đồng Hồ</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="electricity" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="electricity" className="text-themeColor data-[state=active]:bg-themeColor data-[state=active]:text-white hover:bg-blue-200">Công Tơ Điện</TabsTrigger>
            <TabsTrigger value="water" className="text-themeColor data-[state=active]:bg-themeColor data-[state=active]:text-white hover:bg-blue-200">Công Tơ Nước</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {/* Công Tơ Điện */}
            <TabsContent value="electricity">
              <div className="space-y-4 p-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="electricity_old" className="text-gray-700">Chỉ Số Cũ</Label>
                    <Input
                      id="electricity_old"
                      name="electricity_old"
                      type="number"
                      value={editedMeterReading.electricity_old}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="electricity_new" className="text-gray-700">Chỉ Số Mới</Label>
                    <Input
                      id="electricity_new"
                      name="electricity_new"
                      type="number"
                      value={editedMeterReading.electricity_new}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="electricity_price" className="text-gray-700">Giá Tiền</Label>
                    <Input
                      id="electricity_price"
                      name="electricity_price"
                      type="number"
                      value={editedMeterReading.electricity_price}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="rounded-lg border p-3 bg-gray-100">
                  <h4 className="font-medium text-gray-800">Tóm Tắt</h4>
                  <p className="text-sm text-gray-600">
                    Đơn Vị Tiêu Thụ: {editedMeterReading.electricity_new - editedMeterReading.electricity_old}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tổng Chi Phí: {new Intl.NumberFormat("vi-VN").format((editedMeterReading.electricity_new - editedMeterReading.electricity_old) * editedMeterReading.electricity_price)} VNĐ
                  </p>
                </div>
              </div>
            </TabsContent>
            {/* Công Tơ Nước */}
            <TabsContent value="water">
              <div className="space-y-4 p-2">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="water_old" className="text-gray-700">Chỉ Số Cũ</Label>
                    <Input
                      id="water_old"
                      name="water_old"
                      type="number"
                      value={editedMeterReading.water_old}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="water_new" className="text-gray-700">Chỉ Số Mới</Label>
                    <Input
                      id="water_new"
                      name="water_new"
                      type="number"
                      value={editedMeterReading.water_new}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="water_price" className="text-gray-700">Giá Tiền</Label>
                    <Input
                      id="water_price"
                      name="water_price"
                      type="number"
                      value={editedMeterReading.water_price}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="rounded-lg border p-3 bg-gray-100">
                  <h4 className="font-medium text-gray-800">Tóm Tắt</h4>
                  <p className="text-sm text-gray-600">
                    Đơn Vị Tiêu Thụ: {editedMeterReading.water_new - editedMeterReading.water_old}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tổng Chi Phí: {new Intl.NumberFormat("vi-VN").format((editedMeterReading.water_new - editedMeterReading.water_old) * editedMeterReading.water_price)} VNĐ
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
          {/* Các trường bổ sung */}
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="record_date" className="text-gray-700">Ngày Ghi</Label>
                <Input
                  type="date"
                  id="record_date"
                  name="record_date"
                  value={new Date(editedMeterReading.record_date).toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-gray-700">Trạng Thái</Label>
                <Input
                  id="status"
                  name="status"
                  type="number"
                  value={editedMeterReading.status}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button onClick={onCancel} variant="outline" className="w-24">Hủy</Button>
              <Button onClick={handleSubmit} className="w-24 bg-themeColor hover:bg-blue-700 text-white">Lưu</Button>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EditMeterReadingForm;
