import { create } from "zustand";

import { TransactionGroup } from "@/types/types";

// Zustand store cho TransactionGroup
interface TransactionGroupState {
  transactionGroups: TransactionGroup[]; // Danh sách transaction groups
  addTransactionGroup: (group: TransactionGroup) => void; // Hàm thêm group mới
  removeTransactionGroup: (id: string) => void; // Hàm xóa group theo ID
  updateTransactionGroup: (id: string, updatedGroup: Partial<TransactionGroup>) => void; // Hàm cập nhật group
  setTransactionGroups: (groups: TransactionGroup[]) => void; // Đặt lại toàn bộ danh sách
  clearTransactionGroups: () => void; // Xóa toàn bộ danh sách
}

const useTransactionGroupStore = create<TransactionGroupState>((set) => ({
  transactionGroups: [],

  // Thêm transaction group mới
  addTransactionGroup: (group: TransactionGroup) =>
    set((state) => ({
      transactionGroups: [...state.transactionGroups, group],
    })),

  // Xóa transaction group theo ID
  removeTransactionGroup: (id: string) =>
    set((state) => ({
      transactionGroups: state.transactionGroups.filter((group) => group.id !== id),
    })),

  // Cập nhật thông tin transaction group
  updateTransactionGroup: (id: string, updatedGroup: Partial<TransactionGroup>) =>
    set((state) => ({
      transactionGroups: state.transactionGroups.map((group) =>
        group.id === id ? { ...group, ...updatedGroup } : group
      ),
    })),

  // Đặt toàn bộ danh sách transaction groups
  setTransactionGroups: (groups: TransactionGroup[]) =>
    set(() => ({
      transactionGroups: groups,
    })),

  // Xóa toàn bộ danh sách transaction groups
  clearTransactionGroups: () =>
    set(() => ({
      transactionGroups: [],
    })),
}));

export default useTransactionGroupStore;
