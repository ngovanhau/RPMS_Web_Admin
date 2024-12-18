// DashBoardInvoice.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Search, Bell, Plus, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import InvoiceTable from "./components/InvoiceTables";
import { Bill, Room, Building } from "@/types/types";
import EditBillForm from "./components/EditForm";
import CreateBillForm from "./components/CreateForm";
import { useToast } from "@/hooks/use-toast";
import {
  editBill,
  createBill,
  getAllBills,
  getBillByBuildingId,
  deleteBill,
  getBillByRoomId,
} from "@/services/invoiceApi/invoiceApi"; // Import API tạo hóa đơn
import useBillStore from "@/stores/invoiceStore";
import { useBuildingStore } from "@/stores/buildingStore";
import useAuthStore from "@/stores/userStore"; // Import useAuthStore
import {
  getAllBuildings,
  getAllRoom,
  getBuildingByUserId,
  getRoomByBuildingId,
} from "@/services/buildingApi/buildingApi";

const DashBoardInvoice: React.FC = () => {
  const { toast } = useToast();
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const roomList = useBuildingStore((state) => state.roomList);
  // console.log('Đây là roomList ' , roomList)
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const setRooms = useBuildingStore((state) => state.setRooms);
  const bills = useBillStore((state) => state.bills);
  const setBills = useBillStore((state) => state.setBills); // Assuming you have a setBills action in your store

  // State cho select Tòa nhà và Phòng
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Trạng thái modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Hàm mở modal chỉnh sửa hóa đơn
  const handleEdit = (bill: Bill) => {
    setSelectedBill(bill);
    setIsEditModalOpen(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBill(null);
  };

  // Hàm lưu hóa đơn sau chỉnh sửa
  const handleSaveEdit = async (updatedBill: Bill) => {
    try {
      const response = await editBill(updatedBill);

      if (response?.status === 200) {
        toast({
          title: "Thành công",
          description: "Cập nhật hóa đơn thành công.",
          type: "foreground",
        });
        // Refresh bills after edit
        await fetchBills();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật hóa đơn. Vui lòng thử lại!",
          type: "background",
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật hóa đơn. Vui lòng thử lại!",
        type: "background",
      });
    }
  };

  // Hàm mở modal tạo hóa đơn mới
  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  // Hàm đóng modal tạo hóa đơn
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Hàm lưu hóa đơn mới
  const handleSaveCreate = async (newBill: Bill) => {
    try {
      const response = await createBill(newBill);

      if (response?.status === 201) {
        toast({
          title: "Thành công",
          description: "Tạo hóa đơn thành công.",
          type: "foreground",
        });
        // Refresh bills after creation
        await fetchBills();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tạo hóa đơn. Vui lòng thử lại!",
          type: "background",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tạo hóa đơn. Vui lòng thử lại!",
        type: "background",
      });
    }
  };

  // Hàm fetch bills
  const fetchBills = useCallback(async () => {
    try {
      if (selectedRoomId) {
        const response = await getBillByRoomId(selectedRoomId);
        if (response?.data?.data) {
          setBills(response.data.data);
        } else {
          setBills([]);
        }
      } else if (selectedBuildingId) {
        const response = await getBillByBuildingId(selectedBuildingId);
        if (response?.data?.data) {
          setBills(response.data.data);
        } else {
          setBills([]);
        }
      } else {
        // Nếu không chọn phòng hoặc tòa nhà, lấy tất cả hóa đơn
        const response = await getAllBills();
        if (response?.data?.data) {
          setBills(response.data.data);
        } else {
          setBills([]);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy hóa đơn. Vui lòng thử lại!",
        type: "background",
      });
    }
  }, [selectedBuildingId, selectedRoomId, setBills, toast]);

  // Hàm xử lý khi chọn Tòa nhà
  const handleBuildingSelect = useCallback(
    async (buildingId: string) => {
      if (!buildingId) {
        setSelectedBuilding(null);
        setSelectedRoom(null);
        setSelectedBuildingId(null);
        setSelectedRoomId(null);
        await fetchBills(); // Fetch all bills
        return;
      }
      setSelectedBuildingId(buildingId);

      try {
        const selectedBuilding = buildings.find(
          (building) => building.id === buildingId
        );
        if (selectedBuilding) {
          setSelectedBuilding(selectedBuilding);
          setBuilding(selectedBuilding);

          // Fetch rooms for the selected building
         await getRoomByBuildingId(buildingId);


          // Reset trạng thái room
          setSelectedRoom(null);
          setSelectedRoomId(null);

          // Fetch bills cho building được chọn
          await fetchBills();
        }
      } catch (error) {
        console.error("Lỗi khi chọn tòa nhà:", error);
        toast({
          title: "Lỗi",
          description: "Không thể chọn tòa nhà. Vui lòng thử lại!",
          type: "foreground",
        });
      }
    },
    [buildings, setBuilding, fetchBills, toast, setRooms]
  );

  // Hàm xử lý khi chọn Phòng
  const handleRoomSelect = useCallback(
    async (roomId: string) => {
      if (!roomId) {
        setSelectedRoom(null);
        setSelectedRoomId(null);
        // await fetchBills();
        return;
      }
      setSelectedRoomId(roomId);

      try {
        const selectedRoom = roomList.find((room) => room.id === roomId);
        if (selectedRoom) {
          setSelectedRoom(selectedRoom);
          // Fetch bills cho phòng được chọn
          await getBillByRoomId(selectedRoom.id);
        }
      } catch (error) {
        console.error("Lỗi khi chọn phòng:", error);
        toast({
          title: "Lỗi",
          description: "Không thể chọn phòng. Vui lòng thử lại!",
          type: "foreground",
        });
      }
    },
    [roomList, fetchBills, toast]
  );

  // Hàm xóa hóa đơn
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteBill(id);
      if (response.status === 200) {
        toast({
          title: "Thành công",
          description: "Xóa hóa đơn thành công.",
          type: "foreground",
        });
        await fetchBills(); // Refresh bills after deletion
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể xóa hóa đơn. Vui lòng thử lại!",
          type: "background",
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xóa hóa đơn. Vui lòng thử lại!",
        type: "background",
      });
    }
  };

  // Hàm fetch initial data based on user role
  const fetchInitialData = useCallback(async () => {
    try {
      if (userData?.role === "ADMIN") {
        const buildingsData = (await getAllBuildings())?.data.data;
        useBuildingStore.getState().setBuildings(buildingsData);
        await fetchBills();
      } else if (userData?.role === "MANAGEMENT") {
        const buildingsData = (await getBuildingByUserId(userData?.id || ""))
          ?.data.data;
        useBuildingStore.getState().setBuildings(buildingsData);

        if (buildingsData.length > 0) {
          const firstBuildingId = buildingsData[0].id;

          // Fetch và set danh sách phòng
          const rooms = await getRoomByBuildingId(firstBuildingId);
          setRooms(rooms?.data?.data || []);

          // Chọn tòa nhà đầu tiên và load hóa đơn
          setSelectedBuildingId(firstBuildingId);
          setBuilding(buildingsData[0]);

          await getBillByBuildingId(buildingsData[0].id);
        }
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu ban đầu:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu ban đầu. Vui lòng thử lại!",
        type: "background",
      });
    }
  }, [userData, fetchBills, setRooms, toast, setBuilding]);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);
  return (
    <div className="flex flex-col flex-1 w-full bg-gray-100 h-screen overflow-auto">
      {/* Header */}
      <div className="flex flex-row px-6 gap-4 items-center justify-between border-b bg-white w-full h-[5%] shadow-md">
        <div className="flex items-center gap-4 w-full max-w-md">
          <Search className="w-6 h-6 text-themeColor" />
          <input
            className="w-full text-sm border-none focus:outline-none"
            placeholder="Tìm kiếm hóa đơn"
          />
        </div>
        <Bell className="w-6 h-6 text-themeColor cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-6 overflow-auto">
        <Card className="flex flex-col rounded-[8px] p-6 w-full bg-white shadow-lg">
          {/* Filter Section với hai select: Tòa nhà và Phòng */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex gap-4">
              <select
                className="border border-gray-300 px-4 rounded-[8px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleBuildingSelect(e.target.value)}
                value={selectedBuildingId || ""}
              >
                <option value="">Chọn Tòa nhà</option>
                {/* Kiểm tra buildings trước khi gọi map */}
                {buildings &&
                  buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.building_name}
                    </option>
                  ))}
              </select>

              {roomList.length > 0 ? (
                <select
                  className="border border-gray-300 px-4 rounded-[8px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleRoomSelect(e.target.value)}
                  value={selectedRoomId || ""}
                >
                  <option value="">Chọn Phòng</option>
                  {roomList.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  disabled
                  className="border border-gray-300 px-4 rounded-[8px] py-2 bg-gray-100 cursor-not-allowed"
                >
                  <option>Không có phòng nào</option>
                </select>
              )}
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleCreate} // Gọi hàm mở modal tạo hóa đơn
                className="flex items-center gap-2 px-4 py-2 bg-themeColor text-white rounded hover:bg-blue-700 transition text-sm"
              >
                <Plus className="w-5 h-5" />
                Thêm hóa đơn
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm">
                <Filter className="w-5 h-5" />
                Lọc
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm">
                <Download className="w-5 h-5" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Bảng hiển thị hóa đơn */}
          <InvoiceTable
            onDelete={handleDelete}
            bills={bills}
            onEdit={handleEdit}
          />
        </Card>
      </div>

      {/* Form chỉnh sửa hóa đơn */}
      <EditBillForm
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        bill={selectedBill}
        onSave={handleSaveEdit}
      />

      {/* Form tạo hóa đơn mới */}
      <CreateBillForm
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleSaveCreate}
      />
    </div>
  );
};

export default DashBoardInvoice;
