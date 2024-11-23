import React, { useState, useEffect } from "react";
import { Room, Booking } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  rooms: Room[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  rooms,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (booking) {
      setEditedBooking({ ...booking });
    }
  }, [booking]);

  if (!booking) return null;

  const roomName = rooms.find((room) => room.id === booking.roomid)?.room_name || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editedBooking) return;
    const { name, value } = e.target;
    setEditedBooking({
      ...editedBooking,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (editedBooking) {
      onEdit(editedBooking);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedBooking({ ...booking });
    setIsEditing(false);
  };

  return (
    <CustomModal header={isEditing ? "Chỉnh sửa Booking" : "Chi tiết Booking"} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block font-semibold">Tên khách hàng:</label>
              <input
                type="text"
                name="customername"
                value={editedBooking?.customername || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={editedBooking?.phone || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Email:</label>
              <input
                type="email"
                name="email"
                value={editedBooking?.email || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Phòng:</label>
              <select
                name="roomid"
                value={editedBooking?.roomid || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Ngày:</label>
              <input
                type="datetime-local"
                name="date"
                value={
                  editedBooking
                    ? new Date(editedBooking.date).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Ghi chú:</label>
              <textarea
                name="note"
                value={editedBooking?.note || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Trạng thái:</label>
              <select
                name="status"
                value={editedBooking?.status ?? 0}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value={0}>Hẹn khách</option>
                <option value={1}>Đặt cọc</option>
                <option value={2}>Hoàn thành</option>
                <option value={3}>Thất bại</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Tên khách hàng:</strong> {booking.customername}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {booking.phone}
            </p>
            <p>
              <strong>Email:</strong> {booking.email}
            </p>
            <p>
              <strong>Phòng:</strong> {roomName}
            </p>
            <p>
              <strong>Ngày:</strong>{" "}
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
            </p>
            <p>
              <strong>Ghi chú:</strong> {booking.note}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {booking.status === 0
                ? "Hẹn khách"
                : booking.status === 1
                ? "Đặt cọc"
                : booking.status === 2
                ? "Hoàn thành"
                : "Thất bại"}
            </p>
          </>
        )}

        {/* Nút hành động */}
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Lưu
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Sửa
              </button>
              <button
                onClick={() => onDelete(booking.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Xóa
              </button>
            </>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default BookingDetailModal;
