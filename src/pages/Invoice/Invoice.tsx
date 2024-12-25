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
  updatePaymentWeb,
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
import { createNotification } from "@/services/notificationApi/notificationApi";
import CustomModal from "@/components/Modal/Modal";
import ViewBillForm from "./components/ViewForm";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { updateStatusServicemeter } from "@/services/roomStatementApi/roomStatementApi";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { getBillByBuildingIdAndStatus, getBillByRoomIdAndStatus } from "@/services/transactionApi/transactionApi";
import { fi } from "date-fns/locale";
import { resolve } from "path";

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [payMoneyModal, setPayMoneyModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<string>("Tiền mặt");
  const [filterStatus, setFilterStatus] = useState<number | null>(null)

  // Hàm mở modal chỉnh sửa hóa đơn
  const handleEdit = (bill: Bill) => {
    setSelectedBill(bill);
    setIsEditModalOpen(true);
  };

  const handlePayMoneyModal = async (bill: Bill) => {
    setPayMoneyModal(true);
    setSelectedBill(bill);
  };

  const handleView = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewModalOpen(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBill(null);
  };

  const onClose = () => {
    setPayMoneyModal(false);
    setSelectedBill(null);
  };

  const handlePayMoney = async () => {
    if (selectedBill) {
      const response = await updatePaymentWeb(selectedBill.id, paymentMode);
      if (response.isSuccess) {
        setPaymentMode("Tiền mặt");
        setSelectedBill(null);
        setPayMoneyModal(false);
        fetchInitialData();
      }
    }
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

  const handleChange = (event: SelectChangeEvent) => {
    setPaymentMode(event.target.value as string);
  };

  // Hàm lưu hóa đơn mới
  const handleSaveCreate = async (newBill: Bill, serviceMeterid: string) => {
    try {
      const response = await createBill(newBill);

      if (response?.status === 201) {
        if (serviceMeterid) {
          await updateStatusServicemeter(serviceMeterid, 1);
        }

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
  const fetchBills = async () => {
    try {
      let response;
      if (selectedBuildingId && selectedRoomId && filterStatus) {
        response = await getBillByRoomIdAndStatus(selectedRoomId, filterStatus);
      } else if (selectedBuildingId && selectedRoomId) {
        response = await getBillByRoomId(selectedRoomId);
      } else if (selectedBuildingId) {
        response = await getBillByBuildingId(selectedBuildingId);
      } else {
        response = await getAllBills();
      }
  
      if (response?.data?.data) {
        setBills(response.data.data);
      } else {
        setBills([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy hóa đơn. Vui lòng thử lại!",
        type: "background",
      });
    }
  };
  

  // Hàm xử lý khi chọn Tòa nhà
  const handleBuildingSelect = async (buildingId: string) => {
    if (!buildingId) {
      // Reset tất cả
      setSelectedBuilding(null);
      setSelectedRoom(null);
      setSelectedBuildingId(null); 
      setSelectedRoomId(null);
      setFilterStatus(null);
      return;
    }
  
    setSelectedBuildingId(buildingId);
    setSelectedRoom(null);
    setSelectedRoomId(null);
    setFilterStatus(null);
    
    // Fetch rooms mới
    await getRoomByBuildingId(buildingId);
  }

  // Hàm xử lý khi chọn Phòng
  const handleRoomSelect = async (roomId: string) => {
    await new Promise(resolve => {
      setSelectedRoomId(roomId);
      setFilterStatus(null);
      resolve(null);
    });
    
    const response = await getBillByRoomId(roomId);
    if (response?.data?.data) {
      setBills(response.data.data);
    } else {
      setBills([]);
    }
  };
  

  const handleChangeFilterStatus = async (status: number) => {
    await new Promise(resolve => {
      setFilterStatus(status);
      resolve(null)
    })
    if(selectedRoomId){
      const response = await getBillByRoomIdAndStatus(selectedRoomId, status)
      if (response?.data) {
        setBills(response.data);
      } else {
        setBills([]);
      }
    } else if (selectedBuildingId) {
      const response = await getBillByBuildingIdAndStatus(selectedBuildingId, status)
      if (response?.data) {
        setBills(response.data);
      } else {
        setBills([]);
      }
    } else {
      return
    }

  };

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

  const handleApprove = async (bill: Bill) => {
    try {
      const updatedBill = { ...bill, status: 1 };
      const response = await editBill(updatedBill);
      if (response?.data.isSuccess) {
        toast({
          title: "Thành công",
          description: "Duyệt hóa đơn thành công.",
          type: "foreground",
        });
        await createNotification(
          response?.data.data.customer_id,
          response?.data.data.bill_name,
          "Vui lòng kiểm tra hóa đơn hoặc liên hệ quản lý tòa nhà!",
          false
        );
        await fetchBills();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể duyệt hóa đơn. Vui lòng thử lại!",
          type: "background",
        });
      }
    } catch (error) {
      console.error("Lỗi khi duyệt hóa đơn", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi duyệt hóa đơn. Vui lòng thử lại!",
        type: "background",
      });
    }
  };

  // Hàm fetch initial data based on user role
  const fetchInitialData = useCallback(async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await fetchBills();
      } else if (userData?.role === "MANAGEMENT") {
        await getBuildingByUserId(userData?.id || "");
        if (buildings.length > 0) {
          const firstBuildingId = buildings[0].id;
          // Fetch và set danh sách phòng
          await getRoomByBuildingId(firstBuildingId);
          // Chọn tòa nhà đầu tiên và cập nhật trạng thái
          setSelectedBuildingId(firstBuildingId);
          setBuilding(buildings[0]);
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
  }, [userData]);

  useEffect(() => {
    if (selectedBuildingId) {
      getBillByBuildingId(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);
  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      {/* Main Content */}
      <div className="flex h-[100%] p-6 overflow-hidden">
        <div className="flex flex-1 flex-col py-4 px-4 rounded-[8px] w-full bg-white">
          {/* Filter Section với hai select: Tòa nhà và Phòng */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex gap-4">
              <select
                className="border border-gray-300 px-4 rounded-[8px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
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

              {roomList && roomList.length > 0 ? (
                <select
                  className="border border-gray-300 px-4 rounded-[8px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
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
                  className="border border-gray-300 px-4 rounded-[8px] py-2 bg-gray-100 cursor-not-allowed w-64"
                >
                  <option>Không có phòng nào</option>
                </select>
              )}
              <select
                onChange={(e) =>
                  handleChangeFilterStatus(Number(e.target.value))
                } 
                className="border border-gray-300 px-4 rounded-[8px] py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              >
                <option>Trạng thái</option>
                <option value="0">Chưa thanh toán</option>
                <option value="1">Đã thanh toán</option>
              </select>
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-wrap items-center pr-6">
              <button
                onClick={handleCreate} // Gọi hàm mở modal tạo hóa đơn
                className="flex items-center gap-2 px-4 py-2 bg-themeColor text-white rounded hover:bg-blue-700 transition text-sm"
              >
                <Plus className="w-5 h-5" />
                Thêm hóa đơn
              </button>
            </div>
          </div>

          {/* Bảng hiển thị hóa đơn */}
          <InvoiceTable
            onPayMoney={handlePayMoneyModal}
            onApproved={handleApprove}
            onDelete={handleDelete}
            bills={bills}
            onEdit={handleEdit}
            onView={handleView}
          />
        </div>
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

      {/* Form xem thông tin */}
      <CustomModal
        isOpen={isViewModalOpen}
        header="Thông tin hóa đơn"
        onClose={() => setIsViewModalOpen(false)}
        children={<ViewBillForm bill={selectedBill} />}
      />

      {/* Thanh toán tiền */}
      <CustomModal
        header="Thanh toán"
        isOpen={payMoneyModal}
        onClose={() => setPayMoneyModal(false)}
        className="max-w-[50%] pb-6"
        children={
          <div className="w-full h-full flex flex-col gap-6">
            <table className="w-full rounded-[8px] mt-2">
              <thead className="bg-themeColor text-white">
                <tr className="w-full">
                  <th className="text-md py-2 border-2 border-gray-300 font-semibold">
                    Khách hàng
                  </th>
                  <th className="text-md py-2 border-2 border-gray-300 font-semibold">
                    Số tiền
                  </th>
                  <th className="text-md py-2 border-2 border-gray-300 font-semibold">
                    Còn nợ
                  </th>
                </tr>
              </thead>
              <tbody>
                <th className="text-md py-2 border-2 border-gray-300 font-normal">
                  {selectedBill?.customer_name}
                </th>
                <th className="text-md py-2 border-2 border-gray-300 font-normal">
                  {selectedBill?.final_amount.toLocaleString()} đ
                </th>
                <th className="text-md py-2 border-2 border-gray-300 font-normal">
                  {selectedBill?.final_amount.toLocaleString()} đ
                </th>
              </tbody>
            </table>

            <span className="text-gray-700">
              Bạn cần thu của cư dân số tiền là :
              <span className="text-red-500 font-semibold">
                {" "}
                {selectedBill?.final_amount.toLocaleString()} đ
              </span>
            </span>

            <div className="w-full flex flex-row justify-between space-x-4">
              <div className="w-[48%]">
                <TextField
                  label={
                    <span>
                      Số tiền thu <span className="text-red-400">(*)</span>
                    </span>
                  }
                  fullWidth
                  value={
                    selectedBill?.total_amount
                      ? (selectedBill?.total_amount).toLocaleString()
                      : ""
                  }
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div className="w-[48%]">
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="payment-mode-label">Phương thức</InputLabel>
                  <Select
                    labelId="payment-mode-label"
                    value={paymentMode}
                    onChange={handleChange}
                    label="Phương thức"
                  >
                    <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                    <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div>
              <TextField
                label={<span>Ghi chú</span>}
                fullWidth
                multiline
                maxRows={5}
                minRows={4}
                variant="outlined"
              />
            </div>
            <div className="w-full flex-row justify-end gap-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handlePayMoney}
                  className="px-4 py-2 text-white rounded hover:bg-blue-700 bg-themeColor"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default DashBoardInvoice;
