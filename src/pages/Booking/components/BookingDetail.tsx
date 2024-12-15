import React, { useEffect, useState } from "react";
import { Booking } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";
import { getBuildingByRoomId } from "@/services/bookingApi/bookingApi";

interface BuildingInfo {
  building_name: string;
  address: string;
  city: string;
}

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null);

  useEffect(() => {
    const fetchBuildingInfo = async () => {
      if (booking?.roomid) {
        try {
          const response = await getBuildingByRoomId(booking.roomid);
          if (response?.data) {
            setBuildingInfo({
              building_name: response.data.building_name,
              address: response.data.address,
              city: response.data.city,
            });
          }
        } catch (error) {
          console.error("Error fetching building info:", error);
          setBuildingInfo(null);
        }
      }
    };

    if (isOpen) {
      fetchBuildingInfo();
    }
  }, [isOpen, booking]);

  if (!booking) return null;

  return (
    <CustomModal header={"Chi tiết"} isOpen={isOpen} onClose={onClose}>
      <div className="grid grid-cols-2 gap-x-8 p-6 bg-gray-50 rounded-md shadow-sm">
        {/* Cột bên trái */}
        <div className="space-y-4">
        <h4 className="text-lg font-semibold font-semibold text-gray-10000 mb-4">
            Thông tin khách hàng
          </h4>
          <div className="flex">
            <p className="font-semibold font-semibold text-gray-800 w-40">Tên khách hàng:</p>
            <p className="flex-1 font-semibold font-semibold text-gray-800">
              {booking.customername}
            </p>
          </div>
          <div className="flex">
            <p className="font-semibold font-semibold text-gray-800  w-40">Số điện thoại:</p>
            <p className="flex-1 font-semibold font-semibold text-gray-800">{booking.phone}</p>
          </div>
          <div className="flex">
            <p className="font-semibold font-semibold text-gray-800 w-40">Email:</p>
            <p className="flex-1 font-semibold text-gray-800">{booking.email}</p>
          </div>
          <div className="flex">
            <p className="font-semibold font-semibold text-gray-800 w-40">Phòng:</p>
            <p className="flex-1 font-semibold text-gray-800">{booking.roomname}</p>
          </div>
        </div>

        {/* Cột bên phải */}
        <div className="space-y-4">
          <div className="flex">
            <p className="font-semibold font-semibold text-gray-800 w-40">Trạng thái:</p>
            <p className="flex-1 font-semibold text-gray-800">
              {booking.status === 0
                ? "Hẹn khách"
                : booking.status === 1
                ? "Đặt cọc"
                : booking.status === 2
                ? "Hoàn thành"
                : "Thất bại"}
            </p>
          </div>
          <div className="flex">
            <p className="font-semibold font-semibold text-gray-800 w-40">Ngày:</p>
            <p className="flex-1 font-semibold text-gray-800">
              {new Date(booking.date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              {new Date(booking.date).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
          <div className="flex">
            <p className="font-semibold font-semibold text-gray-800 w-40">Ghi chú:</p>
            <p className="flex-1 font-semibold text-gray-800">
              {booking.note || "Không có ghi chú"}
            </p>
          </div>
        </div>
      </div>

      {/* Thông tin Tòa nhà */}
      {buildingInfo && (
        <div className=" p-4 bg-white rounded-md shadow-md">
          <h4 className="text-lg font-semibold font-semibold text-gray-10000 mb-4">
            Thông tin tòa nhà
          </h4>
          <div className="space-y-2">
            <div className="flex">
              <p className="font-semibold font-semibold text-gray-800 w-40">Tên tòa nhà:</p>
              <p className="flex-1 font-semibold text-gray-800">
                {buildingInfo.building_name}
              </p>
            </div>
            <div className="flex">
              <p className="font-semibold font-semibold text-gray-800 w-40">Địa chỉ:</p>
              <p className="flex-1 font-semibold text-gray-800">{buildingInfo.address}</p>
            </div>
            <div className="flex">
              <p className="font-semibold font-semibold text-gray-800 w-40">Thành phố:</p>
              <p className="flex-1 font-semibold text-gray-800">{buildingInfo.city}</p>
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default BookingDetailModal;
