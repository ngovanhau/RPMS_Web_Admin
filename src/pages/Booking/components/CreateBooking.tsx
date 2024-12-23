import React, { useState, useEffect } from "react";
import { Booking, Building, cuBooking, Room } from "@/types/types";
import {
  getRoomsByBuildingIdAndStatus,
  getBuildingByRoomId,
} from "@/services/bookingApi/bookingApi";
import { getRoomById } from "@/services/buildingApi/buildingApi";
import { getCustomerByStatus } from "@/services/contractApi/contractApi";
import useTenantStore from "@/stores/tenantStore";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
interface CreateBookingProps {
  onSubmit: (booking: cuBooking) => void;
  onClose: () => void;
  buildings: Building[];
  initialData?: cuBooking;
}

const CreateBooking: React.FC<CreateBookingProps> = ({
  onSubmit,
  onClose,
  buildings,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<cuBooking>>(
    initialData || {
      date: "",
      roomid: "",
      status: 0,
      note: "",
      userId: "",
    }
  );

  const [tempState, setTempState] = useState<{
    phone: string;
    email: string;
  }>({
    phone: "",
    email: "",
  });

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState<string>(""); // Room name
  const [customerName, setCustomerName] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>(""); // Building name
  const listCustomer = useTenantStore.getState().allTenants;

  // Gọi API khi modal mở và initialData có roomid
  useEffect(() => {
    const fetchRoomAndBuilding = async () => {
      await getCustomerByStatus(100);
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
          const buildingResponse = await getBuildingByRoomId(
            initialData.roomid
          );
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
      getCustomerByStatus(100);
    } else {
      getCustomerByStatus(100);
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
  const handleInputChange = (
    field: keyof cuBooking,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Xử lý submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Danh sách các trường cần kiểm tra
    const requiredFields = {
      roomid: "Phòng",
    };

    // Tìm các trường chưa được điền
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !formData[field as keyof cuBooking]
    );

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(
        (field) => requiredFields[field as keyof typeof requiredFields]
      );
      alert(
        `Vui lòng điền đầy đủ thông tin! Các trường thiếu: ${missingFieldNames.join(
          ", "
        )}`
      );
      return;
    }
    // Nếu không thiếu trường nào, tiếp tục xử lý
    onSubmit({ ...formData } as cuBooking);

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
        {/* <input
          type="text"
          value={formData.customername}
          onChange={(e) => handleInputChange("customername", e.target.value)}
          className="w-full p-2 border rounded"
        /> */}
        <select
          value={formData.userId}
          onChange={(e) => {
            const selectedUserId = e.target.value;
            handleInputChange("userId", e.target.value);
            const selectedCustomer = listCustomer.find(
              (customer) => customer.userId == selectedUserId
            );
            if (selectedCustomer) {
              setTempState((prev) => ({
                ...prev,
                phone: selectedCustomer.phone_number,
                email: selectedCustomer.email,
              }));
              setCustomerName(selectedCustomer.customer_name || "");
            }
          }}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">{"Chọn khách hàng"}</option>
          {listCustomer.map((customer) => (
            <option key={customer.id} value={customer.userId}>
              {customer.customer_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <div className="w-full p-2 border rounded bg-">
          {tempState.phone || "Chưa có số điện thoại"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <div className="w-full p-2 border rounded bg-">
          {tempState.email || "Chưa có email"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ngày</label>
        {/* <input
          type="datetime-local"
          value={formData.date || ""}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className="w-full p-2 border rounded"
        /> */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-[8px] text-left flex flex-row justify-between">
              {formData.date
                ? new Date(formData.date).toLocaleDateString("vi-VN")
                : "Chọn ngày"}
              <CalendarDays className="text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-white rounded-md shadow-md">
            <Calendar
              mode="single"
              selected={formData.date ? new Date(formData.date) : undefined}
              onSelect={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  date: date ? date.toISOString() : "",
                }))
              }
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
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
