import { create } from 'zustand';
import { Building, Room } from '@/types/types';

interface BuildingStore {
  buildings: Building[];
  buildingByUserId: Building[]; // Another array to store buildings by user ID
  building: Building | null;
  roomList: Room[];
  room: Room | null;
  
  // Building functions
  addBuilding: (building: Building) => void;
  addBuildingByUserId: (building: Building) => void; // New function to add to buildingByUserId
  updateBuilding: (id: string, updatedBuilding: Partial<Building>) => void;
  removeBuilding: (id: string) => void;
  setBuildings: (buildings: Building[]) => void;
  setBuildingByUserId: (buildings: Building[]) => void; // New function to set buildingByUserId array
  clearAllBuildings: () => void;
  clearAllBuildingsByUserId: () => void; // New function to clear buildingByUserId array
  setBuilding: (building: Building) => void;
  clearBuilding: () => void;
  
  // Room list functions
  addRoom: (room: Room) => void;
  updateRoom: (id: string, updatedRoom: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  setRooms: (rooms: Room[]) => void;
  clearAllRooms: () => void;
  
  // Single room functions
  setRoom: (room: Room | null) => void;
  clearRoom: () => void;
  updateCurrentRoom: (updatedRoom: Partial<Room>) => void;
}

export const useBuildingStore = create<BuildingStore>((set) => ({
  buildings: [],
  buildingByUserId: [], // Initialize as an empty array
  building: null,
  roomList: [],
  room: null,

  // Building functions
  addBuilding: (building) =>
    set((state) => ({ buildings: [...state.buildings, building] })),
  
  addBuildingByUserId: (building) =>
    set((state) => ({ buildingByUserId: [...state.buildingByUserId, building] })),

  updateBuilding: (id, updatedBuilding) =>
    set((state) => ({
      buildings: state.buildings.map((building) =>
        building.id === id ? { ...building, ...updatedBuilding } : building
      ),
    })),
  
  removeBuilding: (id) =>
    set((state) => ({
      buildings: state.buildings.filter((building) => building.id !== id),
    })),
  
  setBuildings: (buildings) => set({ buildings }),
  setBuildingByUserId: (buildings) => set({ buildingByUserId: buildings }),
  clearAllBuildings: () => set({ buildings: [] }),
  clearAllBuildingsByUserId: () => set({ buildingByUserId: [] }),
  setBuilding: (building) => set({ building }),
  clearBuilding: () => set({ building: null }),

  // Room list functions
  addRoom: (room) => 
    set((state) => ({ roomList: [...state.roomList, room] })),
  
  updateRoom: (id, updatedRoom) =>
    set((state) => ({
      roomList: state.roomList.map((room) =>
        room.id === id ? { ...room, ...updatedRoom } : room
      ),
    })),
  
  removeRoom: (id) =>
    set((state) => ({
      roomList: state.roomList.filter((room) => room.id !== id),
    })),
  
  setRooms: (rooms) => set({ roomList: rooms }),
  clearAllRooms: () => set({ roomList: [] }),

  // Single room functions
  setRoom: (room) => set({ room }),
  clearRoom: () => set({ room: null }),
  updateCurrentRoom: (updatedRoom) =>
    set((state) => ({
      room: state.room ? { ...state.room, ...updatedRoom } : null,
    })),
}));
