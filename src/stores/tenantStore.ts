import { create } from 'zustand';

// Định nghĩa interface cho Tenant
export interface Tenant {
  id?: string;
  customer_name: string;
  phone_number: string;
  choose_room: string;
  email: string;
  date_of_birth: Date;
  cccd: string;
  date_of_issue: string;
  place_of_issue: string;
  address: string;
  imageCCCDs: string[];
  roomName: string;
}

// Định nghĩa interface cho TenantStore
interface TenantStore {
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (tenant: Tenant) => void;
  removeTenant: (id: string) => void;
}

// Tạo store Zustand với kiểu dữ liệu được định nghĩa
const useTenantStore = create<TenantStore>((set) => ({
  tenants: [], // Danh sách tenant ban đầu

  // Hành động để cập nhật danh sách tenants
  setTenants: (tenants) => set({ tenants }),

  // Hành động để thêm một tenant mới
  addTenant: (tenant) => set((state) => ({ tenants: [...state.tenants, tenant] })),

  // Hành động để cập nhật một tenant
  updateTenant: (updatedTenant) =>
    set((state) => ({
      tenants: state.tenants.map((tenant) =>
        tenant.id === updatedTenant.id ? updatedTenant : tenant
      ),
    })),

  // Hành động để xóa một tenant
  removeTenant: (id) =>
    set((state) => ({
      tenants: state.tenants.filter((tenant) => tenant.id !== id),
    })),
}));

export default useTenantStore;
