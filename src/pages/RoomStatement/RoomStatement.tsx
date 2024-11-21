import React, { useEffect, useState, useCallback } from "react";
import { Bill, Building, Room, ServiceMeterReadings } from "@/types/types";
import TableRow from "./components/TableRow";
import { useBuildingStore } from "@/stores/buildingStore";
import useAuthStore from "@/stores/userStore";
import { useToast } from "@/hooks/use-toast";
import {
  getAllBuildings,
  getAllRoom,
  getBuildingByUserId,
  getRoomByBuildingId,
  getRoomById,
} from "@/services/buildingApi/buildingApi";
import {
  createServicemeter,
  deleteServicemeter,
  editServicemeter,
  getALlServicemeterreadings,
  getServicemeterByBuildingId,
  getServicemeterByRoomId,
} from "@/services/roomStatementApi/roomStatementApi";
import useServiceMeterReadingsStore from "@/stores/roomStatementStore";
import { HiSearch, HiBell, HiPlus } from "react-icons/hi";
import CustomModal from "@/components/Modal/Modal";
import MeterReadingForm from "./components/CreateForm";
import EditMeterReadingForm from "./components/EditForm";
import { createBill } from "@/services/invoiceApi/invoiceApi";

const DashBoardRoomStatement: React.FC = () => {
  const { toast } = useToast(); // Sử dụng hook useToast
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const roomList = useBuildingStore((state) => state.roomList);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const setRooms = useBuildingStore((state) => state.setRooms);
  const serviceMeterReading = useServiceMeterReadingsStore(
    (state) => state.reading
  );
  const servicemeterList = useServiceMeterReadingsStore(
    (state) => state.readings
  );

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState<boolean>(false);
  const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
  const [selectedMeterReading, setSelectedMeterReading] =
    useState<ServiceMeterReadings | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      if (userData?.role === "ADMIN") {
        const buildingsData = (await getAllBuildings())?.data.data;
        useBuildingStore.getState().setBuildings(buildingsData);
        getALlServicemeterreadings();
      } else if (userData?.role === "MANAGEMENT") {
        const buildingsData = (await getBuildingByUserId(userData?.id || ""))
          ?.data.data;
        useBuildingStore.getState().setBuildings(buildingsData);
        if (buildingsData.length > 0) {
          await handleBuildingSelect(buildingsData[0].id);
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
  }, [userData, toast]);

  const handleCancel = () => {
    setCreateFormOpen(false);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const response = await deleteServicemeter(serviceId);

      if (!response.status) {
        // Nếu response không thành công, hiển thị thông báo lỗi và kết thúc.
        toast({
          title: "Lỗi",
          description: "Thao tác không thành công. Vui lòng thử lại!",
          type: "foreground",
        });
        return;
      }

      // Nếu xóa thành công, tiếp tục xử lý cập nhật.
      if (selectedBuilding) {
        await getServicemeterByBuildingId(selectedBuilding.id);

        if (selectedRoom) {
          await getServicemeterByRoomId(selectedRoom.id);
        }
      }

      // Thông báo thành công sau khi hoàn tất.
      toast({
        title: "Thành công",
        description: "Xóa thành công",
        type: "foreground",
      });
    } catch (error) {
      // Xử lý nếu có lỗi từ bất kỳ thao tác bất đồng bộ nào.
      console.error("Error while deleting service meter: ", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa. Vui lòng thử lại!",
        type: "foreground",
      });
    }
  };

  const handleEdit = (serviceMeterReading: ServiceMeterReadings) => {
    setSelectedMeterReading(serviceMeterReading); // Đặt dữ liệu chỉ số cần chỉnh sửa
    setEditFormOpen(true); // Mở modal chỉnh sửa
  };

  const handleBuildingSelect = useCallback(
    async (buildingId: string) => {
      if (!buildingId) return;
      setSelectedBuildingId(buildingId);
      useServiceMeterReadingsStore.getState().clearReadings();

      try {
        const selectedBuilding = buildings.find(
          (building) => building.id === buildingId
        );
        if (selectedBuilding) {
          setSelectedBuilding(selectedBuilding);
          await getServicemeterByBuildingId(selectedBuilding.id);
          setBuilding(selectedBuilding);
          await getRoomByBuildingId(buildingId);
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
    [buildings, setBuilding, toast]
  );

  const handleRoomSelect = useCallback(
    async (roomId: string) => {
      if (!roomId) return;
      setSelectedRoomId(roomId);

      try {
        const selectedRoom = roomList.find((room) => room.id === roomId);
        if (selectedRoom) {
          setSelectedRoom(selectedRoom);
          await getServicemeterByRoomId(selectedRoom?.id);
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
    [roomList, toast]
  );

  const handleSubMitCreateForm = useCallback(
    async (serviceMeterReading: ServiceMeterReadings) => {
      try {
        await createServicemeter(serviceMeterReading);
        if (selectedRoom) {
          await getServicemeterByRoomId(selectedRoom?.id);
        }
        setCreateFormOpen(false);
        // Thông báo thành công khi ghi chỉ số
        toast({
          title: "Thành công",
          description: "Ghi chỉ số thành công!",
          type: "foreground",
        });
      } catch (error) {
        console.error("Lỗi khi ghi chỉ số:", error);
        toast({
          title: "Lỗi",
          description: "Không thể ghi chỉ số. Vui lòng thử lại!",
          type: "foreground",
        });
      }
    },
    [selectedRoom, toast]
  );

  const handleCreateBill = async (serviceMeterReading: ServiceMeterReadings) => {
    try {
      console.log("Tạo hóa đơn cho:", serviceMeterReading);
  
      // Lấy thông tin phòng từ API
      const response = await getRoomById(serviceMeterReading.room_id);
  
      // Kiểm tra response và dữ liệu trả về
      if (!response || !response.data || !response.data.data) {
        throw new Error("Không thể lấy thông tin phòng");
      }
  
      const roomData: Room = response.data.data;
  
      // Ngày hiện tại
      const currentDate = new Date().toISOString();
  
      // Tạo đối tượng hóa đơn từ dữ liệu ServiceMeterReadings và Room
      const newBill: Bill = {
        id: serviceMeterReading.id, // Sử dụng ID từ ServiceMeterReadings
        bill_name: `Hóa đơn ${serviceMeterReading.room_name || "không rõ"}`, // Đặt tên hóa đơn
        status: 1, // Ví dụ: trạng thái mới tạo
        status_payment: 0, // Ví dụ: chưa thanh toán
        building_id: serviceMeterReading.building_id || "", // ID tòa nhà
        customer_name: roomData.nameCustomer || "Không rõ", // Lấy từ Room
        customer_id: roomData.customerId || "", // Lấy từ Room
        date: currentDate, // Ngày tạo hóa đơn
        roomid: serviceMeterReading.room_id || "", // ID phòng
        roomname: serviceMeterReading.room_name || "", // Tên phòng
        payment_date: currentDate, // Ngày thanh toán
        due_date: currentDate, // Ngày đến hạn
        cost_room: roomData.room_price || 0, // Giá phòng từ Room
        cost_service:
          serviceMeterReading.electricity_cost + serviceMeterReading.water_cost, // Tổng chi phí dịch vụ
        total_amount: serviceMeterReading.total_amount, // Tổng số tiền
        penalty_amount: 0, // Phạt (nếu có)
        discount: 0, // Giảm giá (nếu có)
        final_amount: serviceMeterReading.total_amount, // Tổng cuối cùng
        note: `Hóa đơn tạo từ ${serviceMeterReading.recorded_by || "hệ thống"}`, // Ghi chú
        createdAt: currentDate, // Ngày tạo
        updatedAt: currentDate, // Ngày cập nhật
      };
      await createBill(newBill)
  
      // Thông báo thành công
      toast({
        title: "Thành công",
        description: "Hóa đơn đã được tạo thành công!",
        type: "foreground",
      });
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo hóa đơn. Vui lòng thử lại!",
        type: "foreground",
      });
    }
  };
  

  const handleEditSubmit = async (
    updatedMeterReading: ServiceMeterReadings
  ) => {
    try {
      const response = await editServicemeter(updatedMeterReading);
      if (!response?.status) {
        toast({
          title: "Lỗi",
          description: "Thao tác không thành công. Vui lòng thử lại!",
          type: "foreground",
        });
        return;
      }

      // Nếu xóa thành công, tiếp tục xử lý cập nhật.
      if (selectedBuilding) {
        await getServicemeterByBuildingId(selectedBuilding.id);

        if (selectedRoom) {
          await getServicemeterByRoomId(selectedRoom.id);
        }
      }

      // Thông báo thành công sau khi hoàn tất.
      toast({
        title: "Thành công",
        description: "Sửa thành công",
        type: "foreground",
      });

      // Đóng modal sau khi cập nhật
      setEditFormOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật chỉ số:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật chỉ số. Vui lòng thử lại!",
        type: "foreground",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b bg-white w-full">
        <HiSearch className="text-[#001eb4] size-6" />
        <input
          className="w-full border-none focus:outline-none"
          placeholder="Tìm kiếm bằng tên tòa nhà"
        />
        <HiBell className="text-[#001eb4] size-6" />
      </div>

      <div className="flex h-[95%] p-6 overflow-hidden">
        <div className="flex flex-1 flex-col py-4 px-4 rounded-[8px] w-full bg-white">
          {/* Filter Section */}
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

              {roomList.length > 0 && (
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
              )}
            </div>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full border-collapse">
              <thead className="bg-[#001eb4] text-white">
                <tr>
                  <th className="p-1 text-left rounded-tl-lg"></th>
                  <th className="p-3 text-left rounded-tl-lg">Tên tòa nhà</th>
                  <th className="p-3 text-left">Tên phòng</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Người ghi chỉ số</th>
                  <th className="p-3 text-left">Ngày ghi chỉ số</th>
                  <th className="p-3 text-left">Điện cũ</th>
                  <th className="p-3 text-left">Điện mới</th>
                  <th className="p-3 text-left">Chi phí điện</th>
                  <th className="p-3 text-left">Nước cũ</th>
                  <th className="p-3 text-left">Nước mới</th>
                  <th className="p-3 text-left">Chi phí nước</th>
                  <th className="p-3 text-left rounded-tr-lg">Tổng số tiền</th>
                </tr>
              </thead>
              {selectedRoomId !== null ? (
                serviceMeterReading ? (
                  <tbody>
                    <TableRow
                      key={serviceMeterReading.id}
                      ServiceMeterReadings={serviceMeterReading}
                      onDelete={() => handleDelete(serviceMeterReading.id)}
                      onEdit={() => handleEdit(serviceMeterReading)}
                      onCreateBill={(data) => handleCreateBill(data)} // Truyền đúng kiểu hàm
                    />
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={12} className="text-center">
                        <div className="flex items-center justify-center h-[300px] w-full text-gray-400 text-lg">
                          Không có dữ liệu
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )
              ) : servicemeterList.length > 0 ? (
                <tbody>
                  {servicemeterList.map((serviceMeterReading) => (
                    <TableRow
                      key={serviceMeterReading.id}
                      ServiceMeterReadings={serviceMeterReading}
                      onDelete={() => handleDelete(serviceMeterReading.id)}
                      onEdit={() => handleEdit(serviceMeterReading)}
                      onCreateBill={(data) => handleCreateBill(data)} // Truyền đúng kiểu hàm
                    />
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={12} className="text-center">
                      <div className="flex items-center justify-center h-[300px] w-full text-gray-400 text-lg">
                        Không có dữ liệu
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Nút hình tròn cố định ở góc phải dưới */}
      <button
        onClick={() => setCreateFormOpen(true)}
        className="fixed bottom-[10%] right-[5%] bg-[#001eb4] text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        <HiPlus size={24} />
      </button>

      <CustomModal
        onClose={handleCancel}
        header="Ghi chỉ số"
        isOpen={createFormOpen}
        children={
          <MeterReadingForm
            onCancel={handleCancel}
            onSubmit={handleSubMitCreateForm}
            building={selectedBuilding}
            room={selectedRoom}
          />
        }
      />

      {/* Modal chỉnh sửa */}
      <CustomModal
        onClose={() => setEditFormOpen(false)}
        header="Chỉnh sửa chỉ số đồng hồ"
        isOpen={editFormOpen}
        children={
          selectedMeterReading && (
            <EditMeterReadingForm
              meterReading={selectedMeterReading}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditFormOpen(false)}
            />
          )
        }
      />
    </div>
  );
};

export default DashBoardRoomStatement;
