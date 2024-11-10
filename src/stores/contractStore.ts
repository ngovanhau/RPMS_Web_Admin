import { create } from 'zustand';
import { Contract } from '@/types/types';

interface ContractStore {
  contracts: Contract[]; // Mảng chứa các hợp đồng
  addContract: (contract: Contract) => void; // Hàm thêm hợp đồng
  addContracts: (contracts: Contract[]) => void; // Hàm thêm nhiều hợp đồng
  updateContract: (id: string, updatedContract: Partial<Contract>) => void; // Hàm cập nhật hợp đồng
  removeContract: (id: string) => void; // Hàm xóa hợp đồng
  removeDuplicateContracts: () => void; // Hàm xóa hợp đồng trùng lặp
  clearContracts: () => void; // Hàm xóa tất cả hợp đồng
}

const useContractStore = create<ContractStore>((set) => ({
  contracts: [],

  
  addContract: (contract) =>
    set((state) => ({
      contracts: [...state.contracts, contract],
    })),

  // Hàm thêm nhiều hợp đồng vào mảng contracts
  addContracts: (contracts) =>
    set((state) => ({
      contracts: [...state.contracts, ...contracts],
    })),

  updateContract: (id, updatedContract) =>
    set((state) => ({
      contracts: state.contracts.map((contract) =>
        contract.id === id ? { ...contract, ...updatedContract } : contract
      ),
    })),

  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((contract) => contract.id !== id),
    })),

  removeDuplicateContracts: () =>
    set((state) => {
      const uniqueContracts = state.contracts.reduce<Contract[]>((acc, contract) => {
        const isDuplicate = acc.some((item) => item.id === contract.id);
        if (!isDuplicate) {
          acc.push(contract);
        }
        return acc;
      }, []);
      return { contracts: uniqueContracts };
    }),

  clearContracts: () =>
    set(() => ({
      contracts: [],
    })),
}));

export default useContractStore;
