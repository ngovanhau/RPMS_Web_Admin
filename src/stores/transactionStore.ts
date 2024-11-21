import {create} from 'zustand';
import { Transaction } from '@/types/types';

// Định nghĩa state và các action
interface TransactionStore {
  transactions: Transaction[]; // Danh sách các transaction
  setTransactions: (transactions: Transaction[]) => void; // Gán danh sách transactions
  addTransaction: (transaction: Transaction) => void; // Thêm transaction mới
  removeTransaction: (id: string) => void; // Xóa transaction theo ID
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void; // Cập nhật transaction
  clearTransactions: () => void; // Xóa toàn bộ transactions
}

// Tạo store Zustand
const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],

  // Gán toàn bộ mảng transactions
  setTransactions: (transactions) => set({ transactions }),

  // Thêm một transaction vào mảng
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),

  // Xóa một transaction dựa trên ID
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  // Cập nhật một transaction dựa trên ID
  updateTransaction: (id, updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updatedTransaction } : t
      ),
    })),

  // Xóa toàn bộ transactions
  clearTransactions: () => set({ transactions: [] }),
}));

export default useTransactionStore;
