import { create } from "zustand";
import { PaymentScheduleType } from "@/types/types";

interface PaymentScheduleStore {
  schedules: PaymentScheduleType[]; // Danh sách các lịch thanh toán
  setSchedules: (schedules: PaymentScheduleType[]) => void; // Cập nhật toàn bộ danh sách lịch thanh toán (và sắp xếp)
  addSchedule: (schedule: PaymentScheduleType) => void; // Thêm lịch thanh toán mới (và sắp xếp)
  updateSchedule: (schedule: PaymentScheduleType) => void; // Cập nhật lịch thanh toán (và sắp xếp)
  deleteSchedule: (roomId: string) => void; // Xóa lịch thanh toán theo roomId
  clearSchedules: () => void; // Xóa toàn bộ danh sách lịch thanh toán
}

const usePaymentScheduleStore = create<PaymentScheduleStore>((set) => ({
  schedules: [],
  setSchedules: (schedules) =>
    set({
      schedules: schedules.sort((a, b) =>
        new Date(a.billingStartDate).getTime() - new Date(b.billingStartDate).getTime()
      ),
    }),
  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule].sort((a, b) =>
        new Date(a.billingStartDate).getTime() - new Date(b.billingStartDate).getTime()
      ),
    })),
  updateSchedule: (updatedSchedule) =>
    set((state) => ({
      schedules: state.schedules
        .map((schedule) =>
          schedule.roomId === updatedSchedule.roomId ? updatedSchedule : schedule
        )
        .sort((a, b) =>
          new Date(a.billingStartDate).getTime() - new Date(b.billingStartDate).getTime()
        ),
    })),
  deleteSchedule: (roomId) =>
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.roomId !== roomId),
    })),
  clearSchedules: () => set({ schedules: [] }),
}));

export default usePaymentScheduleStore;
