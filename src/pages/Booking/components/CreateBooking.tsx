import React, { useState, useEffect } from "react";
import { Booking, Building, Room } from "@/types/types";
import {
  getRoomsByBuildingIdAndStatus,
  getBuildingByRoomId,
} from "@/services/bookingApi/bookingApi";
import { getRoomById } from "@/services/buildingApi/buildingApi";

interface CreateBookingProps {
  onSubmit: (booking: Booking) => void;
  onClose: () => void;
  buildings: Building[];
  initialData?: Booking;
}

const CreateBooking: React.FC<CreateBookingProps> = ({
  onSubmit,
  onClose,
  buildings,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Booking>>(
    initialData || {
      customername: "",
      phone: "",
      email: "",
      date: "",
      roomid: "",
      status: 0,
      note: "",
    }
  );

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState<string>(""); // Room name
  const [buildingName, setBuildingName] = useState<string>(""); // Building name

  // Gọi API khi modal mở và initialData có roomid
  useEffect(() => {
    const fetchRoomAndBuilding = async () => {
      if (initialData?.roomid) {
        try {
          // Gọi API lấy thông tin phòng
          const roomData = await getRoomById(initialData.roomid);
          if (roomData) {
            setRoomName(roomData.data.data.room_name || "");
            setSelectedBuildingId(roomData.data.building_Id || "");
            handleInputChange("roomid", initialData.roomid);
          }
  
          // Gọi API lấy thông tin tòa nhà
          const buildingResponse = await getBuildingByRoomId(initialData.roomid);
          if (buildingResponse) {
            setBuildingName(buildingResponse.data.building_name || "");
          }
        } catch (error) {
          console.error("Error fetching room/building data:", error);
        }
      }
    };
  
    if (initialData) {
      setFormData({
        ...initialData,
        date: formatDateToDatetimeLocal(initialData.date), // Chuyển ngày về định dạng hợp lệ
      });
      fetchRoomAndBuilding();
    }
  }, [initialData]);
  
  // Gọi API để lấy danh sách phòng khi chọn tòa nhà
  useEffect(() => {
    if (selectedBuildingId) {
      (async () => {
        const fetchedRooms = await getRoomsByBuildingIdAndStatus(
          selectedBuildingId,
          0
        );
        setRooms(fetchedRooms);
      })();
    } else {
      setRooms([]);
    }
  }, [selectedBuildingId]);

  // Xử lý thay đổi form
  const handleInputChange = (field: keyof Booking, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Xử lý submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.customername ||
      !formData.phone ||
      !formData.email ||
      !formData.date ||
      !formData.roomid
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    onSubmit({ ...formData } as Booking);
    onClose();
  };

  const formatDateToDatetimeLocal = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const isoString = date.toISOString(); // Chuẩn ISO 8601: 2024-06-14T12:30:00.000Z
    return isoString.slice(0, 16); // Lấy 'YYYY-MM-DDTHH:MM'
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tòa nhà */}
      <div>
        <label className="block text-sm font-medium mb-1">Tòa nhà</label>
        <select
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuildingId(e.target.value)}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">{buildingName || "Chọn tòa nhà"}</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.building_name}
            </option>
          ))}
        </select>
      </div>

      {/* Phòng */}
      <div>
        <label className="block text-sm font-medium mb-1">Phòng</label>
        <select
          value={formData.roomid}
          onChange={(e) => handleInputChange("roomid", e.target.value)}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">{roomName || "Chọn phòng"}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room_name}
            </option>
          ))}
        </select>
      </div>

      {/* Các trường khác */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
        <input
          type="text"
          value={formData.customername}
          onChange={(e) => handleInputChange("customername", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ngày</label>
        <input
          type="datetime-local"
          value={formData.date || ""}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange("note", e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      {/* Nút lưu */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded hover:bg-blue-700 bg-themeColor"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default CreateBooking;
