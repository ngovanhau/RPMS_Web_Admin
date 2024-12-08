import { Room } from "@/types/types";
import React from "react";
import { MdMeetingRoom } from "react-icons/md"; // Import biểu tượng liên quan đến phòng

interface RoomCardProps {
  room: Room;
  onSelect?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="w-full h-20 bg-white rounded-lg flex items-center flex-row cursor-pointer"
    >
      <div className="w-[12%] justify-center flex">
        <MdMeetingRoom className="text-[#001eb4] text-4xl" />{" "}
        {/* Sử dụng biểu tượng Room */}
      </div>

      <div className="w-[30%] h-full flex flex-col justify-center pl-3">
        <span className="text-sm font-semibold text-themeColor">
          {/* Giới hạn tên phòng, nếu quá dài sẽ cắt và thêm dấu ba chấm */}
          {room.room_name
            ? room.room_name.length > 20
              ? `${room.room_name.slice(0, 20)}...`
              : room.room_name
            : "Unknown Room"}
        </span>
        <span className="text-xs text-gray-500">
          Người thuê: {room?.status == 0 ? room?.renter : "1"}
        </span>
      </div>

      <div className="w-[35%] flex flex-col justify-center pl-3">
        <span className="text-sm font-semibold text-themeColor">
          {room.room_price ? `${room.room_price.toLocaleString()} đ` : "N/A"}
        </span>
        <span className="text-xs text-gray-500">Hóa đơn: 0</span>
      </div>

      <div className="w-[23%] flex flex-col justify-center items-end pr-6">
        <span className="text-sm font-semibold text-white">
          {room.status === 0 ? (
            <span className="bg-gray-400 text-white px-3 py-1 text-[10px] rounded-xl">
              Trống
            </span>
          ) : (
            <span className="bg-themeColor text-white px-3 py-1 text-[10px] rounded-xl">
              Đã thuê
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default RoomCard;
