import React, { useEffect, useMemo, useState } from "react";
import { Booking, Building, Room } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";
import CreateBooking from "./components/CreateBooking";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import BookingDetailModal from "./components/BookingDetail";
import {
  getAllBuildings,
  getBuildingByUserId,
  getRoomByBuildingId,
} from "@/services/buildingApi/buildingApi";
import {
  createBooking,
  deleteBookingById,
  getAllBooking,
  getBookingByBuildingId,
  updateBookingById,
} from "@/services/bookingApi/bookingApi";
import useBookingStore from "@/stores/bookingStore";

const DashBoardBooking: React.FC = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State để lưu booking được chọn
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const bookings = useBookingStore((state) => state.bookings);

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await getAllBooking();
      } else if (userData?.role === "MANAGEMENT") {
        await getBuildingByUserId(userData?.id);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  useEffect(() => {
    if (
      userData?.role === "MANAGEMENT" &&
      buildings.length > 0 &&
      !selectedBuildingId
    ) {
      const firstBuildingId = buildings[0]?.id;
      setSelectedBuildingId(firstBuildingId);
      getBookingByBuildingId(firstBuildingId);
      fetchRooms(firstBuildingId);
    }
  }, [buildings, userData]);

  const fetchRooms = async (buildingId: string) => {
    try {
      if (!rooms.some((room) => room.building_Id === buildingId)) {
        await getRoomByBuildingId(buildingId);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleBuildingSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const buildingId = event.target.value;
    setSelectedBuildingId(buildingId);
    setSelectedRoomId(null);
    getBookingByBuildingId(buildingId);
    fetchRooms(buildingId);
  };
  // Hàm xử lý khi nhấn vào một hàng
  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  // Hàm xử lý khi nhấn nút Sửa
  const handleEdit = async (booking: Booking) => {
    await updateBookingById(booking)
    if (selectedBuildingId) {
      await getBookingByBuildingId(selectedBuildingId);
    }
    setIsDetailModalOpen(false)
  };

  // Hàm xử lý khi nhấn nút Xóa
  const handleDelete = async (id: string) => {
    await deleteBookingById(id)
    if (selectedBuildingId) {
      await getBookingByBuildingId(selectedBuildingId);
      setIsDetailModalOpen(false)
    }
  };

  const handleAddBooking = async (booking: Booking) => {
    await createBooking(booking);
    if (selectedBuildingId) {
      await getBookingByBuildingId(selectedBuildingId);
    }
  };

  const handleStatusChange = async (booking: Booking, newStatus: number) => {
    try {
      booking.status = newStatus;
      await updateBookingById(booking);
      if (selectedBuildingId) {
        await getBookingByBuildingId(selectedBuildingId);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => room.building_Id === selectedBuildingId);
  }, [rooms, selectedBuildingId]);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden relative">
      {/* Thanh tìm kiếm */}
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b bg-white w-full"></div>
      {/* Nội dung chính */}
      <div className="flex h-[95%] p-4 overflow-hidden">
        <div className="flex flex-1 rounded-[8px] flex-col py-4 px-4 w-full bg-white">
          {/* Tiêu đề và dropdown */}
          <div className="flex items-center  justify-between mb-4">
            {/* Tiêu đề */}
            <h2 className="text-xl font-bold text-themeColor">
              Danh sách đặt chỗ
            </h2>

            {/* Dropdown filter */}
            <div className="flex gap-4 ">
              {/* Select Tòa nhà */}
              <div className="flex flex-row">
                <label className="text-sm w-28 flex justify-center items-center text-gray-700">
                  Tòa nhà
                </label>
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
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-100 transition"
                    >
                      <td
                        className="border border-gray-300 p-2 text-center"
                        onClick={() => handleRowClick(booking)}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="border border-gray-300 p-2"
                        onClick={() => handleRowClick(booking)}
                      >
                        {booking.customername}
                      </td>
                      <td
                        className="border border-gray-300 p-2"
                        onClick={() => handleRowClick(booking)}
                      >
                        {booking.phone}
                      </td>
                      <td
                        className="border border-gray-300 p-2"
                        onClick={() => handleRowClick(booking)}
                      >
                        {booking.email}
                      </td>
                      <td
                        className="border border-gray-300 p-2"
                        onClick={() => handleRowClick(booking)}
                      >
                        {rooms.find((room) => room.id === booking.roomid)
                          ?.room_name || ""}
                      </td>
                      <td
                        className="border border-gray-300 p-2 text-center whitespace-nowrap"
                        onClick={() => handleRowClick(booking)}
                      >
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
                      </td>
                      <td className="border border-gray-300 p-2">
                        {booking.note}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <select
                          value={booking.status}
                          onClick={(e) => e.stopPropagation()} // Prevent the row click event
                          onChange={(e) =>
                            handleStatusChange(booking, Number(e.target.value))
                          }
                          className="p-1 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-themeColor"
                        >
                          <option value={0}>Hẹn khách</option>
                          <option value={1}>Đặt cọc</option>
                          <option value={2}>Hoàn thành</option>
                          <option value={3}>Thất bại</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="border border-gray-300 p-2 text-center text-gray-500"
                    >
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
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
        rooms={rooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
    </div>
  );
};

export default DashBoardBooking;
