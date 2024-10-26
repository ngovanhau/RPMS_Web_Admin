import { create } from 'zustand';

// Định nghĩa interface cho Service
interface Service {
  id: string;
  service_name: string;
  unitMeasure: string;
  service_cost: number;
  collect_fees: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  note?: string;
}

// Định nghĩa interface cho ServiceStore
interface ServiceStore {
  services: Service[];
  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  removeService: (id: string) => void;
}

// Tạo store Zustand với kiểu dữ liệu được định nghĩa
const useServiceStore = create<ServiceStore>((set) => ({
  services: [], // Danh sách dịch vụ ban đầu

  // Hành động để cập nhật danh sách dịch vụ
  setServices: (services) => set({ services }),

  // Hành động để thêm một dịch vụ mới
  addService: (service) => set((state) => ({ services: [...state.services, service] })),

  // Hành động để cập nhật một dịch vụ
  updateService: (updatedService) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      ),
    })),

  // Hành động để xóa một dịch vụ
  removeService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    })),
}));

export default useServiceStore;
