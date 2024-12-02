import React from "react";
import { Room } from "@/types/types";

interface RoomCardProps {
  room: Room;
  onSelect?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  return (
    <div onClick={onSelect} className="w-full h-16 items-center flex flex-row cursor-pointer">
      <div className="w-[10%] justify-center flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#001eb4"
          className="size-7"
        >
          <path
            fillRule="evenodd"
            d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="w-[30%] h-full justify-center flex flex-col">
        <span className="text-sm font-semibold text-themeColor">
          {room.room_name || "Unknown Room"}
        </span>
        <span className="text-[12px]">Người thuê: {room.renter ?? "N/A"}</span>
      </div>
      <div className="w-[40%] justify-center flex flex-col h-full">
        <span className="text-sm font-semibold text-themeColor">
          {room.room_price ? `${room.room_price.toLocaleString()} đ` : "N/A"}
        </span>
        <span className="text-[12px]">Hóa đơn: 1</span>
      </div>
      <div className="w-[20%] justify-center items-end pr-6 flex flex-col h-full">
        <span className="text-sm font-semibold text-white">
          {room.status === 0 ? (
            <span className="bg-gray-400 text-white px-2 py-1 text-[10px] rounded-xl">
              Trống
            </span>
          ) : (
            <span className="bg-themeColor text-white px-2 py-1 text-[10px] rounded-xl">
              Đã thuê
            </span>
          )}
        </span>
        <span className="text-[12px]">Vấn đề: 0</span>
      </div>
    </div>
  );
};

export default RoomCard;
