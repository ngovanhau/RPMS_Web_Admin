import { create } from "zustand";
import { Bill } from "@/types/types";

interface BillStore {
  bills: Bill[]; // Danh sách các hóa đơn
  setBills: (bills: Bill[]) => void; // Cập nhật toàn bộ danh sách hóa đơn (và sắp xếp)
  addBill: (bill: Bill) => void; // Thêm hóa đơn mới (và sắp xếp)
  updateBill: (bill: Bill) => void; // Cập nhật hóa đơn (và sắp xếp)
  deleteBill: (id: string) => void; // Xóa hóa đơn theo ID
  clearBills: () => void; // Xóa toàn bộ danh sách hóa đơn
}

const useBillStore = create<BillStore>((set) => ({
  bills: [],
  setBills: (bills) =>
    set({
      bills: bills.sort((a, b) =>
        new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime()
      ),
    }),
  addBill: (bill) =>
    set((state) => ({
      bills: [...state.bills, bill].sort((a, b) =>
        new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime()
      ),
    })),
  updateBill: (updatedBill) =>
    set((state) => ({
      bills: state.bills
        .map((bill) => (bill.id === updatedBill.id ? updatedBill : bill))
        .sort((a, b) =>
          new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime()
        ),
    })),
  deleteBill: (id) =>
    set((state) => ({
      bills: state.bills
        .filter((bill) => bill.id !== id)
        .sort((a, b) =>
          new Date(b.updatedAt || "").getTime() - new Date(a.updatedAt || "").getTime()
        ),
    })),
  clearBills: () => set({ bills: [] }),
}));

export default useBillStore;
