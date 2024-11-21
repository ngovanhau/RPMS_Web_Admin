import React, { useState } from "react";
import { Booking, Building, Room } from "@/types/types";

interface CreateBookingProps {
  onSubmit: (booking: Booking) => void;
  onClose: () => void;
  buildings: Building[]; // Danh sách Building đơn giản
  rooms: Room[]; // Danh sách Room đơn giản
}

const CreateBooking: React.FC<CreateBookingProps> = ({
  onSubmit,
  onClose,
  buildings,
  rooms,
}) => {
  const [formData, setFormData] = useState<Partial<Booking>>({
    customername: "",
    phone: "",
    email: "",
    date: "",
    roomid: "",
    status: 0,
    note: "",
  });
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");

  const handleInputChange = (field: keyof Booking, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customername || !formData.phone || !formData.email || !formData.date || !formData.roomid) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    onSubmit({
      id: `booking${Date.now()}`, // Auto-generate unique ID
      ...formData,
    } as Booking);
    onClose();
  };

  // Lọc danh sách phòng theo tòa nhà được chọn
  const filteredRooms = rooms.filter((room) => room.building_Id === selectedBuildingId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tòa nhà
        </label>
        <select
          value={selectedBuildingId}
          onChange={(e) => {
            setSelectedBuildingId(e.target.value);
            handleInputChange("roomid", ""); // Reset room khi đổi building
          }}
          className="w-full p-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-themeColor"
        >
          <option value="">Chọn tòa nhà</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.building_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phòng
        </label>
        <select
          value={formData.roomid}
          onChange={(e) => handleInputChange("roomid", e.target.value)}
          className="w-full p-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-themeColor"
          disabled={!selectedBuildingId}
        >
          <option value="">Chọn phòng</option>
          {filteredRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room_name || `Phòng ${room.id}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên khách hàng
        </label>
        <input
          type="text"
          value={formData.customername}
          onChange={(e) => handleInputChange("customername", e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-themeColor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-themeColor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-themeColor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày
        </label>
        <input
          type="datetime-local"
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-themeColor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange("note", e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-themeColor"
          rows={3}
        />
      </div>

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
          className="px-4 py-2 bg-themeColor text-white rounded hover:bg-opacity-90"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default CreateBooking;
