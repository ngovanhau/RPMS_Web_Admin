import { create } from "zustand";
import { Booking } from "@/types/types";

interface BookingStore {
  bookings: Booking[];
  setBookings: (newBookings: Booking[]) => void; // Thay thế danh sách
  addBooking: (newBooking: Booking) => void; // Thêm booking mới
  clearBookings: () => void; // Xóa toàn bộ danh sách
  updateBooking: (id: string, updatedBooking: Partial<Booking>) => void; // Cập nhật booking theo ID
  removeBooking: (id: string) => void; // Xóa booking theo ID
}

const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],

  // Thay thế toàn bộ danh sách bookings
  setBookings: (newBookings: Booking[]) => set({ bookings: newBookings }),

  // Thêm một booking mới
  addBooking: (newBooking: Booking) =>
    set((state) => ({
      bookings: [...state.bookings, newBooking],
    })),

  // Xóa toàn bộ danh sách bookings
  clearBookings: () => set({ bookings: [] }),

  // Cập nhật thông tin booking theo ID
  updateBooking: (id, updatedBooking) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, ...updatedBooking } : booking
      ),
    })),

  // Xóa một booking theo ID
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    })),
}));

export default useBookingStore;
