import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Home, DollarSign, User } from "lucide-react";
import { Contract } from "@/types/types";
import { formatNumber, formatDateTime } from "@/config/config";

const ContractItem: React.FC<{ contract: Contract }> = ({ contract }) => {
  return (
    <div className=" w-full p-2">
      <Card className="h-full border-2 border-themeColor hover:border-blue-200 transition-all duration-200">
        <CardContent className="p-2">
          {/* Phần đầu */}
          <div className="border-b border-gray-100 bg-gray-50 p-3 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-semibold text-gray-800">
                {contract.contract_name}
              </h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Đang hoạt động
              </Badge>
            </div>
            <div className="flex items-center mt-1 text-gray-600">
              <Home className="w-3.5 h-3.5 mr-1" />
              <span className="font-medium text-sm">{contract.room}</span>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="p-3 grid gap-3">
            {/* Phần thông tin khách thuê & ngày */}
            <div className="grid grid-cols-2 gap-3">
              {/* Thông tin khách thuê */}
              <div className="space-y-1">
                <div className="flex items-center text-gray-600 mb-1">
                  <User className="w-3.5 h-3.5 mr-1" />
                  <span className="text-sm font-medium">Khách thuê</span>
                </div>
                <p className="text-gray-800 font-medium pl-5 text-sm">
                  {contract.customerName}
                </p>
              </div>

              {/* Ngày hợp đồng */}
              <div className="space-y-1">
                <div className="flex items-center text-gray-600 mb-1">
                  <CalendarDays className="w-3.5 h-3.5 mr-1" />
                  <span className="text-sm font-medium">Thời gian hợp đồng</span>
                </div>
                <div className="text-sm pl-5">
                  <p className="text-gray-800">
                    Từ: <span className="font-medium">{formatDateTime(contract.start_day)}</span>
                  </p>
                  <p className="text-gray-800">
                    Đến: <span className="font-medium">{formatDateTime(contract.end_day)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Phần tài chính */}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex items-center text-gray-600 mb-2">
                <DollarSign className="w-3.5 h-3.5 mr-1" />
                <span className="text-sm font-medium">Chi tiết tài chính</span>
              </div>
              <div className="grid grid-cols-3 gap-3 pl-5">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-600">Phí thuê hàng tháng</p>
                  <p className="text-gray-800 font-semibold">{formatNumber(contract.room_fee)}đ</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-600">Tiền đặt cọc</p>
                  <p className="text-gray-800 font-semibold">${formatNumber(contract.deposit)}đ</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-600">Thời gian hợp đồng</p>
                  <p className="text-gray-800 font-semibold">{contract.payment_term} tháng</p>
                </div>
              </div>
            </div>

            {/* Phần dịch vụ */}
            {/* {contract.service && (
              <div className="border-t border-gray-100 pt-3">
                <h3 className="text-xs font-medium text-gray-600 mb-1">Dịch vụ bao gồm</h3>
                <div className="flex flex-wrap gap-2">
                  {contract.service.split(', ').map((service, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 text-sm">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractItem;
