import React from "react";
import { Room } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, Users, Square, Ban, Info, AlertCircle } from "lucide-react";

interface RoomDetailsProps {
  room: Room;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room }) => {
  const formatPrice = (price: number | undefined) => {
    if (!price) return "Chưa cập nhật";
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  const NoDataMessage = () => (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <span>Chưa có dữ liệu</span>
    </div>
  );

  return (
    <div className="h-[900px] w-full md:w-[59%] flex-col overflow-scroll p-4 bg-white rounded-lg">
      {/* Services Section - Redesigned */}
      <Card className="border-2 border-themeColor">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Thông tin cơ bản</span>
              </div>
              <div className="space-y-1 ml-7">
                <p className="text-sm">Tên phòng: {room?.room_name || "Chưa đặt tên"}</p>
                <p className="text-sm">Diện tích: {room?.acreage ? `${room.acreage} m²` : "Chưa cập nhật"}</p>
                <p className="text-sm">Tầng: {room?.floor || "Chưa cập nhật"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Sức chứa & Phòng</span>
              </div>
              <div className="space-y-1 ml-7">
                <p className="text-sm">Số người tối đa: {room?.limited_occupancy ? `${room.limited_occupancy} người` : "Chưa cập nhật"}</p>
                <p className="text-sm">Phòng ngủ: {room?.number_of_bedrooms || "Chưa cập nhật"}</p>
                <p className="text-sm">Phòng khách: {room?.number_of_living_rooms || "Chưa cập nhật"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Chi phí</span>
              </div>
              <div className="space-y-1 ml-7">
                <p className="text-sm">Giá phòng: {formatPrice(room?.room_price)}</p>
                <p className="text-sm">Tiền cọc: {formatPrice(room?.deposit)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Nội thất</span>
              </div>
              <div className="space-y-1 ml-7">
                {room?.interior ? (
                  <p className="text-sm whitespace-pre-wrap">{room.interior}</p>
                ) : (
                  <NoDataMessage />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="border-2 mt-6  border-themeColor">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-global">
            Dịch vụ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {room?.roomservice && room.roomservice.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {room.roomservice.map((service, index) => (
                <Card key={index} className="bg-card hover:bg-blue-50 transition-colors ">
                  <CardContent className="flex items-center space-x-4 p-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={ "https://as1.ftcdn.net/jpg/01/40/62/16/500_F_140621690_lCjpTdvOoqdovvUlh89F5FM1gODHMIdx.jpg"}
                        alt={service.serviceName || "Dịch vụ"}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{service.serviceName || "Chưa đặt tên"}</p>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Chưa có dịch vụ nào được cung cấp
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Room Information Section */}


      {/* Building Utilities */}
      <Card className="mt-6 border-2 border-themeColor">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-global">
            Tiện ích tòa nhà
          </CardTitle>
        </CardHeader>
        <CardContent>
          {room?.utilities ? (
            <div className="flex flex-wrap gap-2">
              {room.utilities.split(',').map((utility, index) => (
                <Badge key={index} variant="secondary">
                  {utility.trim()}
                </Badge>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription className="border-none border-0">
                Chưa có thông tin về tiện ích
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Description & Notes */}
      <Card className="mt-6 border-2 border-themeColor">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Mô tả</span>
              </div>
              {room?.describe ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{room.describe}</p>
              ) : (
                <NoDataMessage />
              )}
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Lưu ý</span>
              </div>
              {room?.note ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{room.note}</p>
              ) : (
                <NoDataMessage />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="h-[200px]"></div>
    </div>
  );
};

export default RoomDetails;