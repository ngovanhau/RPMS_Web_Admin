import React, { useEffect, useState } from "react";
import { Deposit } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";
import CreateDeposit from "./components/CreateDeposit";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import {
  getAllBuildings,
  getBuildingByUserId,
  getRoomByBuildingId,
} from "@/services/buildingApi/buildingApi";
import {
  createDeposit,
  deleteDepositById,
  getAllDeposit,
  getDepositByBuildingId,
  updateDeposit,
} from "@/services/depositApi/depositApi";
import useDepositStore from "@/stores/depositStore";
import OptionSelector from "../Deposit/components/OptionSelector";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { IoEye } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import DepositDetail from "./components/DepositDetail" 

const DashBoard: React.FC = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState("Đang chờ phòng");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // State để lưu booking được chọn

  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const deposit = useDepositStore((state) => state.deposits);

  const options = ["Đang chờ phòng", "Quá hạn", "Khách hủy cọc", "Đã tạo hợp đồng"];

  const statusMap: { [key: number]: string } = {
    0: "Đang chờ phòng",
    1: "Quá hạn",
    2: "Khách hủy cọc",
    3: "Đã tạo hợp đồng",
  };

  const filtered = deposit
  .filter((item) => statusMap[item.status] === selectedOption)
  .filter((item) =>
    item.customername.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await getAllDeposit();
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
      getDepositByBuildingId(firstBuildingId);
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
    getDepositByBuildingId(buildingId);
    fetchRooms(buildingId);
  };

  // Hàm xử lý khi nhấn nút Xóa
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (!isConfirmed) return;
  
    try {
      await deleteDepositById(id);
      if (selectedBuildingId) {
        await getDepositByBuildingId(selectedBuildingId);
        setIsDetailModalOpen(false);
      } else {
        await fetchInitialData();
      }
    } catch (error) {
      console.error("Error deleting :", error);
    }
  };

  const refreshDeposits = async () => {
    await fetchInitialData();
  };
  const handleAddDeposit = async (deposit: Deposit) => {
    try {
      if (isEditing && selectedDeposit) {
        // Nếu đang chỉnh sửa
        await updateDeposit({ ...selectedDeposit, ...deposit });
      } else {
        // Nếu thêm mới
        await createDeposit(deposit);
      }
  
      // Làm mới danh sách bookings ngay sau khi thêm mới
      if (selectedBuildingId) {
        await getDepositByBuildingId(selectedBuildingId);
      } else {
        await getAllDeposit();
      }
  
      // Đặt lại trạng thái modal và selectedBooking
      setIsModalOpen(false);
      setSelectedDeposit(null);
      setIsEditing(false);
  
      // Làm mới toàn bộ dữ liệu
      refreshDeposits(); // Gọi lại hàm fetchInitialData
    } catch (error) {
      console.error("Error adding/updating booking:", error);
    }
  };


  const handleStatusChange = async (deposit: Deposit, newStatus: number) => {
    try {
      deposit.status = newStatus;
      await updateDeposit(deposit);
      if (selectedBuildingId) {
        await getDepositByBuildingId(selectedBuildingId);
        fetchInitialData();
      } else {
        await fetchInitialData();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleEditClick = (deposit: Deposit) => {
    setSelectedDeposit(deposit); // Gán dữ liệu của row vào selectedBooking
    setIsEditing(true); // Chuyển sang chế độ chỉnh sửa
    setIsModalOpen(true); // Mở modal
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden relative">
      {/* Nội dung chính */}
      <div className="flex h-[100%] p-4 overflow-hidden">
        
        <div className="flex flex-1 rounded-[8px] flex-col py-4 px-4 w-full bg-white">
          <OptionSelector
            options={options}
            selectedOption={selectedOption}
            // deposits={deposits}
            onOptionChange={setSelectedOption}
            onBuildingChange={handleBuildingSelect} buildings={[]}         
            />
          {/* Add Button */}
          <div className="relative">
            
          <div className="flex justify-end items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-gray-800 ml-0 pl-0 text-left w-full">
                Danh sách đặt cọc
              </h2>
              {/* Thanh tìm kiếm */}
              <input
                type="text"
                placeholder="Tìm kiếm ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded shadow w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Nút Thêm */}
              <div
                className="bg-themeColor flex items-center justify-center gap-2 text-base h-11 text-white py-2 px-4 rounded-[6px] shadow hover:bg-opacity-90 transition duration-300 cursor-pointer"
                style={{ backgroundColor: "#004392" }}
                onClick={() => {
                  setSelectedDeposit(null);
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
                <th className="border border-gray-300 p-2 w-[100px]">Thao tác</th>
                <th className="border border-gray-300 p-2 w-[200px]">Tên Khách hàng</th>
                <th className="border border-gray-300 p-2 w-[150px]">Tên phòng</th>
                <th className="border border-gray-300 p-2 w-[150px]">Số tiền cọc</th>
                <th className="border border-gray-300 p-2 w-[200px]">Phương thức thanh toán</th>
                <th className="border border-gray-300 p-2 w-[220px]">Ngày dự kiến nhận phòng</th>
                <th className="border border-gray-300 p-2 w-[150px]">Trạng thái</th>
              </tr>
            </thead>
                <tbody>
                  {deposit.length > 0 ? (
                    filtered.map((deposit, index) => (
                      <tr key={deposit.id} className="hover:bg-gray-100 transition">
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
                                  onClick={() => handleEditClick(deposit)}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                >
                                  <FaEdit/>
                                  <span className="text-sm">Chỉnh sửa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(deposit.id)} // Gọi hàm xóa booking
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
                                setSelectedDeposit(deposit);
                                console.log("Viewing deposit:", deposit); // Log dữ liệu deposit
                                setIsDetailModalOpen(true); // Hiển thị modal chi tiết
                              }}
                              title="Xem chi tiết"
                            >
                              <IoEye className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </td>

                        {/* Các cột khác */}
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">{deposit.customername}</td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">{deposit.roomname}</td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">{deposit.deposit_amount}</td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2">
                          {Number(deposit.payment_method) === 1 ? "Chuyển khoản" : "Tiền mặt"}
                        </td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2  whitespace-nowrap">
                          {new Date(deposit.move_in_date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          {new Date(deposit.move_in_date).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </td>
                        <td className="font-semibold text-gray-800 border border-gray-300 p-2 text-center">
                          <select
                            value={deposit.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(deposit, Number(e.target.value))}
                            className="p-1 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-themeColor"
                          >
                            <option value={0}>Đang chờ phòng</option>
                            <option value={1}>Quá hạn</option>
                            <option value={2}>Khách hủy cọc</option>
                            <option value={3}>Đã tạo hợp đòng</option>
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
          setSelectedDeposit(null); 
          setIsEditing(false); 
        }}
      >
        <CreateDeposit
          onSubmit={handleAddDeposit}
          onClose={() => setIsModalOpen(false)}
          buildings={buildings}
          initialData={selectedDeposit || undefined}
        />
      </CustomModal>
      <DepositDetail
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        deposit={selectedDeposit}
      />
    </div>
  );
};

export default DashBoard;
