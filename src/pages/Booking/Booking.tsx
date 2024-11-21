import React, { useEffect, useState } from "react";
import { Booking, Building, Room } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";
import CreateBooking from "./components/CreateBooking";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import { getAllBuildings, getBuildingByUserId, getRoomByBuildingId } from "@/services/buildingApi/buildingApi";

const DashBoardBooking: React.FC = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
      } else if (userData?.role === "MANAGEMENT") {
        await getBuildingByUserId(userData?.id);
        if (buildings.length > 0) {
          setSelectedBuildingId(buildings[0].id);
          fetchRooms(buildings[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  const fetchRooms = async (buildingId: string) => {
    try {
      await getRoomByBuildingId(buildingId);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleBuildingSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const buildingId = event.target.value;
    setSelectedBuildingId(buildingId);
    setSelectedRoomId(null); // Reset room selection
    fetchRooms(buildingId);
  };

  const handleAddBooking = (newBooking: Booking) => {
    setFilteredBookings((prev) => [...prev, newBooking]);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredRooms = rooms.filter((room) => room.building_Id === selectedBuildingId);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden relative">
      {/* Thanh tìm kiếm */}
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b bg-white w-full"></div>

      {/* Nội dung chính */}
      <div className="flex h-[95%] p-4 overflow-hidden">
        <div className="flex flex-1 rounded-[8px] flex-col py-4 px-4 w-full bg-white">
          {/* Tiêu đề và dropdown */}
          <div className="flex items-center justify-between mb-4">
            {/* Tiêu đề */}
            <h2 className="text-xl font-bold text-themeColor">Danh sách đặt chỗ</h2>

            {/* Dropdown filter */}
            <div className="flex gap-4">
              {/* Select Tòa nhà */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Tòa nhà</label>
                <select
                  value={selectedBuildingId || ""}
                  onChange={handleBuildingSelect}
                  className="p-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-themeColor"
                >
                  <option value="">Chọn tòa nhà</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.building_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Phòng */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Phòng</label>
                <select
                  value={selectedRoomId || ""}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="p-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-themeColor"
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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto max-h-[70vh] border border-gray-200 rounded-md">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-themeColor text-white z-10">
                <tr>
                  <th className="border border-gray-300 p-2">STT</th>
                  <th className="border border-gray-300 p-2">Tên khách hàng</th>
                  <th className="border border-gray-300 p-2">Số điện thoại</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Phòng</th>
                  <th className="border border-gray-300 p-2">Ngày</th>
                  <th className="border border-gray-300 p-2">Ghi chú</th>
                  <th className="border border-gray-300 p-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{booking.customername}</td>
                      <td className="border border-gray-300 p-2">{booking.phone}</td>
                      <td className="border border-gray-300 p-2">{booking.email}</td>
                      <td className="border border-gray-300 p-2">
                        {rooms.find((room) => room.id === booking.roomid)?.room_name || ""}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {new Date(booking.date).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 p-2">{booking.note}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {booking.status === 0 ? "Chờ xử lý" : "Đã xác nhận"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="border border-gray-300 p-2 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Nút thêm mới */}
      <div
        className="fixed bottom-[10%] right-[6%] h-14 w-14 rounded-full flex justify-center items-center bg-themeColor shadow-lg hover:bg-opacity-90 transition duration-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="text-white text-3xl">+</span>
      </div>

      {/* Modal thêm đặt chỗ */}
      <CustomModal
        header="Tạo đặt chỗ mới"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CreateBooking
          onSubmit={handleAddBooking}
          onClose={() => setIsModalOpen(false)}
          buildings={buildings}
          rooms={rooms}
        />
      </CustomModal>
    </div>
  );
};

export default DashBoardBooking;
