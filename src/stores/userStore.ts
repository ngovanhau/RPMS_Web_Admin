// src/stores/useAuthStore.ts
import { create } from 'zustand';
import { User } from '../types/types';

// Định nghĩa giao diện cho AuthStore
interface AuthStore {
  userData: User | null;
  setUserData: (user: User) => void;
  clearUserData: () => void;
}

// Tạo store Zustand với kiểu dữ liệu được định nghĩa
const useAuthStore = create<AuthStore>((set) => ({
  userData: null, // Thông tin user ban đầu

  // Hành động để cập nhật thông tin userData
  setUserData: (user) => set({ userData: user }),

  // Hành động để xóa thông tin userData
  clearUserData: () => set({ userData: null }),
}));

export default useAuthStore;
