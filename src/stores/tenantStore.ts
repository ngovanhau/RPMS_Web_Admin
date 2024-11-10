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
  date_of_issue: Date;
  place_of_issue: string;
  address: string;
  imageCCCDs: string[];
  roomName: string;
}

// Định nghĩa interface cho TenantStore
interface TenantStore {
  tenants: Tenant[];
  tenantsWithoutRoom: Tenant[]; // Mảng lưu tenant chưa có room
  setTenants: (tenants: Tenant[]) => void;
  setTenantsWithoutRoom: (tenants: Tenant[]) => void; // Thêm hàm mới
  addTenant: (tenant: Tenant) => void;
  updateTenant: (tenant: Tenant) => void;
  removeTenant: (id: string) => void;
}

// Tạo store Zustand với kiểu dữ liệu được định nghĩa
const useTenantStore = create<TenantStore>((set) => ({
  tenants: [],
  tenantsWithoutRoom: [],

  setTenants: (tenants) =>
    set({
      tenants,
      tenantsWithoutRoom: tenants.filter((tenant) => !tenant.choose_room),
    }),

  // Thêm hàm mới để cập nhật tenantsWithoutRoom
  setTenantsWithoutRoom: (tenants) =>
    set({
      tenantsWithoutRoom: tenants,
    }),

  addTenant: (tenant) =>
    set((state) => {
      const updatedTenants = [...state.tenants, tenant];
      return {
        tenants: updatedTenants,
        tenantsWithoutRoom: updatedTenants.filter((tenant) => !tenant.choose_room),
      };
    }),

  updateTenant: (updatedTenant) =>
    set((state) => {
      const updatedTenants = state.tenants.map((tenant) =>
        tenant.id === updatedTenant.id ? updatedTenant : tenant
      );
      return {
        tenants: updatedTenants,
        tenantsWithoutRoom: updatedTenants.filter((tenant) => !tenant.choose_room),
      };
    }),

  removeTenant: (id) =>
    set((state) => {
      const updatedTenants = state.tenants.filter((tenant) => tenant.id !== id);
      return {
        tenants: updatedTenants,
        tenantsWithoutRoom: updatedTenants.filter((tenant) => !tenant.choose_room),
      };
    }),
}));

export default useTenantStore;
