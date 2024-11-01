import { create } from 'zustand';
import { Building, Room } from '@/types/types';

interface BuildingStore {
  buildings: Building[];
  building: Building | null;
  roomList: Room[];
  room: Room | null; // Changed to null for consistency
  
  // Building functions
  addBuilding: (building: Building) => void;
  updateBuilding: (id: string, updatedBuilding: Partial<Building>) => void;
  removeBuilding: (id: string) => void;
  setBuildings: (buildings: Building[]) => void;
  clearAllBuildings: () => void;
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
  building: null,
  roomList: [],
  room: null,

  // Building functions
  addBuilding: (building) =>
    set((state) => ({ buildings: [...state.buildings, building] })),
  
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
  clearAllBuildings: () => set({ buildings: [] }),
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