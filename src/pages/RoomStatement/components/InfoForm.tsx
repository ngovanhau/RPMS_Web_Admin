import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ServiceMeterReadings } from '@/types/types';

interface Props {
  reading: ServiceMeterReadings;
}

const ServiceMeterReadingsDisplay: React.FC<Props> = ({ reading }) => {
  // Format date to local string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  // Format number to currency
  const formatCurrency = (number: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="border-none shadow-none">
        <CardHeader >
          <CardTitle className="text-2xl font-bold text-themeColor">Chi tiết chỉ số đồng hồ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 bg-white p-6 rounded-b-lg shadow-none">
          {/* Location Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-themeColor">Thông tin tòa nhà</h3>
              <p className="text-lg">Tên: {reading.building_name || 'N/A'}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-themeColor">Thông tin phòng</h3>
              <p className="text-lg">Tên: {reading.room_name || 'N/A'}</p>
            </div>
          </div>

          <Separator />

          {/* Record Information */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-sm font-medium text-themeColor">Thông tin ghi nhận</h3>
              <p className="text-sm">Ghi nhận bởi: {reading.recorded_by || 'N/A'}</p>
              <p className="text-sm">Ngày ghi nhận: {formatDate(reading.record_date)}</p>
            </div>
          </div>

          <Separator />

          {/* Electricity Readings */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Chỉ số điện</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Chỉ số cũ</p>
                <p className="text-lg">{reading.electricity_old.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Chỉ số mới</p>
                <p className="text-lg">{reading.electricity_new.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Giá mỗi kWh</p>
                <p className="text-lg">{formatCurrency(reading.electricity_price)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Tổng chi phí</p>
                <p className="text-lg font-semibold">{formatCurrency(reading.electricity_cost)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Water Readings */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Chỉ số nước</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Chỉ số cũ</p>
                <p className="text-lg">{reading.water_old.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Chỉ số mới</p>
                <p className="text-lg">{reading.water_new.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Giá mỗi m³</p>
                <p className="text-lg">{formatCurrency(reading.water_price)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-sm text-themeColor">Tổng chi phí</p>
                <p className="text-lg font-semibold">{formatCurrency(reading.water_cost)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Total Amount */}
          <div className="flex justify-end">
            <div className="text-right">
              <h3 className="text-lg font-semibold">Tổng số tiền</h3>
              <p className="text-2xl font-bold text-themeColor">
                {formatCurrency(reading.total_amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceMeterReadingsDisplay;
