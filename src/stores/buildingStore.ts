import { create } from 'zustand';
// Define the Building interface
import { Building } from '@/types/types';

// Define the Zustand store
interface BuildingStore {
  buildings: Building[];
  building: Building | null; // Add the single building variable
  addBuilding: (building: Building) => void;
  updateBuilding: (id: string, updatedBuilding: Partial<Building>) => void;
  removeBuilding: (id: string) => void;
  setBuildings: (buildings: Building[]) => void;
  clearAllBuildings: () => void;
  setBuilding: (building: Building) => void; // Add setBuilding function
  clearBuilding: () => void; // Add clearBuilding function
}

export const useBuildingStore = create<BuildingStore>((set) => ({
  buildings: [],
  building: null, // Initialize the single building variable as null

  // Add a building to the store
  addBuilding: (building) => 
    set((state) => ({ buildings: [...state.buildings, building] })),
  
  // Update a building by id
  updateBuilding: (id, updatedBuilding) => 
    set((state) => ({
      buildings: state.buildings.map((building) =>
        building.id === id ? { ...building, ...updatedBuilding } : building
      ),
    })),
  
  // Remove a building by id
  removeBuilding: (id) => 
    set((state) => ({
      buildings: state.buildings.filter((building) => building.id !== id),
    })),
  
  // Set the entire array of buildings
  setBuildings: (buildings) => set({ buildings }),
  
  // Clear all buildings from the array
  clearAllBuildings: () => set({ buildings: [] }),

  // Set a single building
  setBuilding: (building) => set({ building }),

  // Clear the single building (set to null)
  clearBuilding: () => set({ building: null }),
}));

