import React, { useEffect, useState } from "react";
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
  initialData?: Booking; // nếu có => đang ở chế độ sửa
}

const CreateBooking: React.FC<CreateBookingProps> = ({
  onSubmit,
  onClose,
  buildings,
  initialData,
}) => {
  // Kiểm tra đang ở chế độ Sửa (Edit) hay Tạo mới (Create)
  const isEditMode = Boolean(initialData && initialData.id);

  // State formData
  const [formData, setFormData] = useState<Partial<cuBooking>>({
    id: "",
    roomid: "",
    userId: "",
    date: "",
    status: 0,
    note: "",
  });

  // Thông tin tòa nhà, phòng (để load danh sách phòng)
  const [buildingId, setBuildingId] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);

  // Thông tin khách hàng (để hiển thị read-only khi Edit)
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Danh sách khách hàng được lưu trong store
  const listCustomer = useTenantStore.getState().allTenants;

  // ------------------------------------------------------------
  // Load dữ liệu khi mở form
  // ------------------------------------------------------------
  useEffect(() => {
    const loadCustomers = async () => {
      // Gọi API để lấy danh sách khách hàng có status 100
      await getCustomerByStatus(100);
    };

    const loadRoomAndBuilding = async (roomId: string) => {
      try {
        const roomRes = await getRoomById(roomId);
        const buildingRes = await getBuildingByRoomId(roomId);

        // Lấy buildingId => để tiếp tục load danh sách phòng
        if (buildingRes?.data) {
          setBuildingId(buildingRes.data.id);
          setBuildingName(buildingRes.data.building_name || "");
        }
        // Gán roomid (để hiển thị trong <select>)
        if (roomRes?.data?.data) {
          handleInputChange("roomid", roomRes.data.data.id);
        }
      } catch (error) {
        console.error("Error fetching room/building:", error);
      }
    };

    if (isEditMode && initialData) {
      // Chế độ Sửa
      setFormData({
        id: initialData.id,
        roomid: initialData.roomid,
        userId: initialData.userId,
        date: formatDateToDatetimeLocal(initialData.date),
        status: initialData.status,
        note: initialData.note, // <-- Lấy ghi chú từ initialData để sửa
      });
      setCustomerName(initialData.customername);
      setPhone(initialData.phone);
      setEmail(initialData.email);

      loadCustomers();
      loadRoomAndBuilding(initialData.roomid);
    } else {
      // Chế độ Tạo
      loadCustomers();
      setFormData({
        id: "",
        roomid: "",
        userId: "",
        date: "",
        status: 0,
        note: "",
      });
    }
  }, [initialData, isEditMode]);

  // ------------------------------------------------------------
  // Khi biết buildingId => load danh sách phòng
  // ------------------------------------------------------------
  useEffect(() => {
    if (buildingId) {
      (async () => {
        try {
          const fetchedRooms = await getRoomsByBuildingIdAndStatus(buildingId, 0);

          // Nếu đang ở chế độ Edit & phòng cũ (initialData.roomid) không nằm trong fetchedRooms
          // => Thêm thủ công để <select> vẫn hiển thị được phòng cũ
          if (isEditMode && initialData?.roomid) {
            const hasRoom = fetchedRooms.some(
              (r: Room) => r.id === initialData.roomid
            );
            if (!hasRoom) {
              const oldRoomRes = await getRoomById(initialData.roomid);
              if (oldRoomRes?.data?.data) {
                fetchedRooms.push(oldRoomRes.data.data);
              }
            }
          }

          setRooms(fetchedRooms);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      })();
    } else {
      setRooms([]);
    }
  }, [buildingId, isEditMode, initialData]);

  // ------------------------------------------------------------
  // Hàm xử lý chọn tòa nhà (khi tạo mới)
  // ------------------------------------------------------------
  const handleSelectBuildingCreate = (id: string) => {
    setBuildingId(id);
  };

  // ------------------------------------------------------------
  // Hàm handleInputChange
  // ------------------------------------------------------------
  const handleInputChange = (field: keyof cuBooking, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ------------------------------------------------------------
  // Submit form
  // ------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && initialData) {
      // Chế độ Sửa => có thể sửa room, date, note
      const updatedBooking: cuBooking = {
        id: initialData.id,
        roomid: formData.roomid || initialData.roomid,
        userId: initialData.userId,
        date: formData.date || initialData.date,
        status: initialData.status,
        note: formData.note || initialData.note, // <-- cập nhật note (nếu người dùng sửa)
      };
      onSubmit(updatedBooking);
    } else {
      // Chế độ Tạo => tạo mới booking
      if (!formData.roomid || !formData.userId) {
        alert("Vui lòng chọn phòng và khách hàng trước khi lưu.");
        return;
      }
      const newBooking: cuBooking = {
        id: "",
        roomid: formData.roomid,
        userId: formData.userId,
        date: formData.date || new Date().toISOString(),
        status: formData.status || 0,
        note: formData.note || "",
      };
      onSubmit(newBooking);
    }

    onClose();
  };

  // ------------------------------------------------------------
  // formatDateToDatetimeLocal => YYYY-MM-DDTHH:mm
  // ------------------------------------------------------------
  const formatDateToDatetimeLocal = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">
        {isEditMode ? "Chỉnh sửa Booking" : "Tạo mới Booking"}
      </h2>

      {/* ------------- Tòa nhà ------------- */}
      {isEditMode ? (
        <div>
          <label className="block text-sm font-medium mb-1">Tòa nhà</label>
          <div className="w-full p-2 border rounded bg-gray-100">
            {buildingName || "Chưa có thông tin tòa nhà"}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Tòa nhà</label>
          <select
            value={buildingId}
            onChange={(e) => handleSelectBuildingCreate(e.target.value)}
            className="w-full p-2 border rounded bg-white focus:outline-none"
          >
            <option value="">Chọn tòa nhà</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.building_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ------------- Phòng ------------- */}
      <div>
        <label className="block text-sm font-medium mb-1">Phòng</label>
        <select
          value={formData.roomid}
          onChange={(e) => handleInputChange("roomid", e.target.value)}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">Chọn phòng</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room_name}
            </option>
          ))}
        </select>
      </div>

      {/* ------------- Khách hàng ------------- */}
      {isEditMode ? (
        <div>
          <label className="block text-sm font-medium mb-1">Khách hàng</label>
          <div className="w-full p-2 border rounded bg-gray-100">
            {customerName || "Chưa có thông tin khách hàng"}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Khách hàng</label>
          <select
            value={formData.userId}
            onChange={(e) => {
              const userIdSelected = e.target.value;
              handleInputChange("userId", userIdSelected);

              // Tìm trong listCustomer để lấy thông tin hiển thị
              const foundCustomer = listCustomer.find(
                (c) => c.userId === userIdSelected
              );
              if (foundCustomer) {
                setCustomerName(foundCustomer.customer_name || "");
                setPhone(foundCustomer.phone_number || "");
                setEmail(foundCustomer.email || "");
              }
            }}
            className="w-full p-2 border rounded bg-white focus:outline-none"
          >
            <option value="">Chọn khách hàng</option>
            {listCustomer.map((customer) => (
              <option key={customer.id} value={customer.userId}>
                {customer.customer_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ------------- Số điện thoại ------------- */}
      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <div className="w-full p-2 border rounded bg-gray-100">
          {phone || "Chưa có số điện thoại"}
        </div>
      </div>

      {/* ------------- Email ------------- */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <div className="w-full p-2 border rounded bg-gray-100">
          {email || "Chưa có email"}
        </div>
      </div>

      {/* ------------- Ngày ------------- */}
      <div>
        <label className="block text-sm font-medium mb-1">Ngày</label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-full px-4 py-2 border border-gray-300 rounded-[8px] text-left flex flex-row justify-between"
            >
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
                  date: date ? date.toISOString().slice(0, 16) : "",
                }))
              }
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* ------------- Ghi chú (cho phép sửa ở cả 2 chế độ) ------------- */}
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange("note", e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      {/* ------------- Nút hành động ------------- */}
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
          {isEditMode ? "Lưu" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};

export default CreateBooking;