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
  allTenants: Tenant[]; // Biến lưu trữ tất cả tenants
  tenants: Tenant[];
  tenantsWithoutRoom: Tenant[]; // Mảng lưu tenant chưa có room
  setTenants: (tenants: Tenant[]) => void;
  setAllTenants: (tenants: Tenant[]) => void; // Hàm cập nhật allTenants
  setTenantsWithoutRoom: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (tenant: Tenant) => void;
  removeTenant: (id: string) => void;
}

// Tạo store Zustand với kiểu dữ liệu được định nghĩa
const useTenantStore = create<TenantStore>((set) => ({
  allTenants: [], // Initialize the allTenants array
  tenants: [],
  tenantsWithoutRoom: [],

  setAllTenants: (tenants) => 
    set({ allTenants: tenants }),

  setTenants: (tenants) =>
    set({
      tenants,
      tenantsWithoutRoom: tenants.filter((tenant) => !tenant.choose_room),
      allTenants: tenants, // Ensure allTenants is also set when tenants are set
    }),

  // Thêm hàm mới để cập nhật tenantsWithoutRoom
  setTenantsWithoutRoom: (tenants) =>
    set({
      tenantsWithoutRoom: tenants,
    }),

  addTenant: (tenant) =>
    set((state) => {
      const updatedTenants = [...state.tenants, tenant];
      const updatedAllTenants = [...state.allTenants, tenant];
      return {
        tenants: updatedTenants,
        tenantsWithoutRoom: updatedTenants.filter((tenant) => !tenant.choose_room),
        allTenants: updatedAllTenants,
      };
    }),

  updateTenant: (updatedTenant) =>
    set((state) => {
      const updatedTenants = state.tenants.map((tenant) =>
        tenant.id === updatedTenant.id ? updatedTenant : tenant
      );
      const updatedAllTenants = state.allTenants.map((tenant) =>
        tenant.id === updatedTenant.id ? updatedTenant : tenant
      );
      return {
        tenants: updatedTenants,
        tenantsWithoutRoom: updatedTenants.filter((tenant) => !tenant.choose_room),
        allTenants: updatedAllTenants,
      };
    }),

  removeTenant: (id) =>
    set((state) => {
      const updatedTenants = state.tenants.filter((tenant) => tenant.id !== id);
      const updatedAllTenants = state.allTenants.filter((tenant) => tenant.id !== id);
      return {
        tenants: updatedTenants,
        tenantsWithoutRoom: updatedTenants.filter((tenant) => !tenant.choose_room),
        allTenants: updatedAllTenants,
      };
    }),
}));

export default useTenantStore;
