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
  userData: JSON.parse(localStorage.getItem('userData') || 'null'), // Lấy userData từ localStorage nếu có

  // Hành động để cập nhật thông tin userData và lưu vào localStorage
  setUserData: (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
    set({ userData: user });
  },

  // Hành động để xóa thông tin userData khỏi store và localStorage
  clearUserData: () => {
    localStorage.removeItem('userData');
    set({ userData: null });
  },
}));

export default useAuthStore;
