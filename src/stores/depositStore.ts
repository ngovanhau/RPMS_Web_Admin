import { create } from 'zustand';
import { Deposit } from '@/types/types';

// Define the state type for deposits
interface DepositStore {
  deposits: Deposit[];
  addDeposit: (deposit: Deposit) => void;
  updateDeposit: (id: string, updatedDeposit: Partial<Deposit>) => void;
  removeDeposit: (id: string) => void;
  setDeposits: (deposits: Deposit[]) => void;
  clearDeposits: () => void; // Function to clear the list of deposits
}

// Create the store using Zustand
export const useDepositStore = create<DepositStore>((set) => ({
  deposits: [], // initial empty list of deposits

  // Action to add a new deposit to the state
  addDeposit: (deposit) => set((state) => ({
    deposits: [...state.deposits, deposit],
  })),

  // Action to update a deposit by its ID
  updateDeposit: (id, updatedDeposit) => set((state) => ({
    deposits: state.deposits.map((deposit) =>
      deposit.id === id ? { ...deposit, ...updatedDeposit } : deposit
    ),
  })),

  // Action to remove a deposit by its ID
  removeDeposit: (id) => set((state) => ({
    deposits: state.deposits.filter((deposit) => deposit.id !== id),
  })),

  // Action to set the initial list of deposits
  setDeposits: (deposits) => set({ deposits: [...deposits] }),

  // Action to clear the list of deposits
  clearDeposits: () => set({ deposits: [] }), // Sets deposits to an empty array
}));
