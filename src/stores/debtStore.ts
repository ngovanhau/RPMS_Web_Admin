// src/store/useDebtStore.ts

import { create } from "zustand";
import { DebtType } from "@/types/types";

interface DebtStore {
  debts: DebtType[]; // List of debts
  setDebts: (debts: DebtType[]) => void; // Set the entire list of debts (and sort)
  addDebt: (debt: DebtType) => void; // Add a new debt (and sort)
  updateDebt: (debt: DebtType) => void; // Update an existing debt (and sort)
  deleteDebt: (id: string) => void; // Delete a debt by ID
  clearDebts: () => void; // Clear all debts
}

const useDebtStore = create<DebtStore>((set) => ({
  debts: [],
  
  // Set the entire list of debts and sort them by due_date descending
  setDebts: (debts) =>
    set({
      debts: debts.sort((a, b) =>
        new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
      ),
    }),
  
  // Add a new debt and sort the updated list
  addDebt: (debt) =>
    set((state) => ({
      debts: [...state.debts, debt].sort((a, b) =>
        new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
      ),
    })),
  
  // Update an existing debt and sort the updated list
  updateDebt: (updatedDebt) =>
    set((state) => ({
      debts: state.debts
        .map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
        .sort((a, b) =>
          new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
        ),
    })),
  
  // Delete a debt by ID and sort the remaining debts
  deleteDebt: (id) =>
    set((state) => ({
      debts: state.debts
        .filter((debt) => debt.id !== id)
        .sort((a, b) =>
          new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
        ),
    })),
  
  // Clear all debts
  clearDebts: () => set({ debts: [] }),
}));

export default useDebtStore;
