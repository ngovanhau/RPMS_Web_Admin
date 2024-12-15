import React, { useEffect, useState } from "react";
import { Booking } from "@/types/types";
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
import OptionSelector from "../Deposit/components/OptionSelector";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { IoEye } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";

const DashBoardBooking: React.FC = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState("Hẹn khách");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // State để lưu booking được chọn
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const bookings = useBookingStore((state) => state.bookings);

  const options = ["Hẹn khách", "Đặt cọc", "Hoàn thành", "Thất bại"];

  const statusMap: { [key: number]: string } = {
    0: "Hẹn khách",
    1: "Đặt cọc",
    2: "Hoàn thành",
    3: "Thất bại",
  };

  const filteredBookings = bookings
  .filter((item) => statusMap[item.status] === selectedOption)
  .filter((item) =>
    item.customername.toLowerCase().includes(searchTerm.toLowerCase())
  );


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

  // Hàm xử lý khi nhấn nút Xóa
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (!isConfirmed) return;
  
    try {
      await deleteBookingById(id);
      if (selectedBuildingId) {
        await getBookingByBuildingId(selectedBuildingId);
        setIsDetailModalOpen(false);
      } else {
        await fetchInitialData();
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const refreshBookings = async () => {
    await fetchInitialData();
  };
  const handleAddBooking = async (booking: Booking) => {
    try {
      if (isEditing && selectedBooking) {
        // Nếu đang chỉnh sửa
        await updateBookingById({ ...selectedBooking, ...booking });
      } else {
        // Nếu thêm mới
        await createBooking(booking);
      }
  
      // Làm mới danh sách bookings ngay sau khi thêm mới
      if (selectedBuildingId) {
        await getBookingByBuildingId(selectedBuildingId);
      } else {
        await getAllBooking();
      }
  
      // Đặt lại trạng thái modal và selectedBooking
      setIsModalOpen(false);
      setSelectedBooking(null);
      setIsEditing(false);
  
      // Làm mới toàn bộ dữ liệu
      refreshBookings(); // Gọi lại hàm fetchInitialData
    } catch (error) {
      console.error("Error adding/updating booking:", error);
    }
  };


  const handleStatusChange = async (booking: Booking, newStatus: number) => {
    try {
      booking.status = newStatus;
      await updateBookingById(booking);
      if (selectedBuildingId) {
        await getBookingByBuildingId(selectedBuildingId);
        fetchInitialData();
      } else {
        await fetchInitialData();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleEditClick = (booking: Booking) => {
    setSelectedBooking(booking); // Gán dữ liệu của row vào selectedBooking
    setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    setIsModalOpen(true); // Mở modal
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden relative">
      {/* Nội dung chính */}
      <div className="flex h-[95%] p-4 overflow-hidden">
        
        <div className="flex flex-1 rounded-[8px] flex-col py-4 px-4 w-full bg-white">
          <OptionSelector
            options={options}
            selectedOption={selectedOption}
            buildings={buildings}
            onOptionChange={setSelectedOption}
            onBuildingChange={handleBuildingSelect}
          />
          
          {/* Add Button */}
          <div className="relative">
            
          <div className="flex justify-end items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-gray-800 ml-0 pl-0 text-left w-full">
                Danh sách khách hẹn xem
              </h2>
              {/* Thanh tìm kiếm */}
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded shadow w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Nút Thêm */}
              <div
                className="bg-themeColor flex items-center justify-center gap-2 text-base h-11 text-white py-2 px-4 rounded-[6px] shadow hover:bg-opacity-90 transition duration-300 cursor-pointer"
                style={{ backgroundColor: "#004392" }}
                onClick={() => {
                  setSelectedBooking(null);
                  setIsEditing(false);
                  setIsModalOpen(true);
                }}
              >
                <PlusCircle className="w-6 h-6 text-white cursor-pointer" />
                Thêm
              </div>
            </div>
            
            {/* Bảng */}
            <div className="overflow-y-auto max-h-[70vh] border border-gray-200 rounded-md mt-4">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-themeColor text-white z-10 h-25">
                  <tr>
                    <th className="border border-gray-300 p-2">Thao tác</th>
                    <th className="border border-gray-300 p-2">Tên khách hàng</th>
                    <th className="border border-gray-300 p-2">Số điện thoại</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Phòng</th>
                    <th className="border border-gray-300 p-2">Ngày</th>
                    <th className="border border-gray-300 p-2">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    filteredBookings.map((booking, index) => (
                      <tr key={booking.id} className="hover:bg-gray-100 transition">
                        {/* Cột thao tác */}
                        <td className="border border-gray-300 p-2 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {/* Dấu ba chấm */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-200 rounded-md">
                                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="bg-white shadow-lg rounded-md p-2"
                                align="center"
                                sideOffset={5}
                              >
                                
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(booking)}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                >
                                  <FaEdit/>
                                  <span className="text-sm">Chỉnh sửa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(booking.id)} // Gọi hàm xóa booking
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                >
                                  <FaTrash/>
                                  <span className="text-sm">Xóa</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Icon con mắt */}
                            <button
                              className="p-2 hover:bg-gray-200 rounded-md"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsDetailModalOpen(true); // Hiển thị modal chi tiết
                              }}
                              title="Xem chi tiết"
                            >
                              <IoEye className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </td>

                        {/* Các cột khác */}
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">{booking.customername}</td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">{booking.phone}</td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">{booking.email}</td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">{booking.roomname}</td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2 text-center whitespace-nowrap">
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
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2 text-center">
                          <select
                            value={booking.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(booking, Number(e.target.value))}
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
      </div>
      {/* Modal thêm đặt chỗ */}
      <CustomModal
        header={isEditing ? "Chỉnh sửa" : "Thêm mới"} 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null); // Reset selectedBooking
          setIsEditing(false); // Quay lại chế độ thêm mới
        }}
      >
        <CreateBooking
          onSubmit={handleAddBooking}
          onClose={() => setIsModalOpen(false)}
          buildings={buildings}
          initialData={selectedBooking || undefined}
        />
      </CustomModal>
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default DashBoardBooking;
