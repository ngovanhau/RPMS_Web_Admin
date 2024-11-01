import { sortBuildingsByName } from "@/config/config";
import api from "../axios";
import { useBuildingStore } from "@/stores/buildingStore";
import { Building, Room } from "@/types/types";


export const getAllBuildings = async () => {
  try {
    const response = await api.get("/building/buildingall");
    const buildingsData =sortBuildingsByName(response.data.data);
    // Cập nhật vào Zustand store
    useBuildingStore.getState().setBuildings(buildingsData);
    return response;
  } catch (error) {
    console.error("Error fetching buildings: ", error);
    throw error;
  }
};

export const deleteBuilding = async (buildingId: string | null) => {
  try {
      const response = await api.delete(`/building/delete?id=${buildingId}`);
      // setBuilding(response.data.data)
      return response
  } catch (error) {
      console.error("Error deleting building:", error);
      throw error;
  }
};

export const getBuildingById = async (buildingId: string) => {
  try {
    const response = await api.get('/building/getbuildingbyid', {
      params: { id: buildingId },
    });
    useBuildingStore.getState().setBuilding(response.data.data)
    return response
    
  } catch (error: any) {
    console.error('Error fetching building:', error.response?.data || error.message);
    throw error;
  }
};


export const editBuilding = async (building: Building) => {
  try {
    const response = await api.put(`/building/update?id=${building.id}`, building);
    return response
  } catch (error) {
    console.error("Failed to update building", error);
    throw error;
  }
};

export const addBuilding = async (building: Building) => {
  try {
      const response = await api.post("/building/create", building);
      return response;
  } catch (error) {
      console.error("Failed to add building:", error);
      throw error;
  }
};

export const getRoomByBuildingId = async (buildingId: string | null) => {
  try {
    const response = await api.get(`/room/getallroombybuildingid?id=${buildingId}`);
    useBuildingStore.getState().setRooms(response.data.data.rooms)
    return response;
  } catch (error) {
    useBuildingStore.getState().setRooms([])

  }
};


export const getRoomById = async (roomId: string | null) => {
  try {
    const response = await api.get(`/room/getroombyid?id=${roomId}`);
    useBuildingStore.getState().setRoom(null)
    useBuildingStore.getState().setRoom(response.data.data);
    return response;
  } catch (error) {
    // Explicitly set room data to null on error
    useBuildingStore.getState().setRoom(null);
    return null; // Optionally return null to indicate failure
  }
};


export const deleteRoom = async (roomId: string | null) => {
  try {
      const response = await api.delete(`/room/delete?id=${roomId}`);
      return response
  } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
  }
};

export const addRoom = async (room: Room) => {
  try {
      const response = await api.post("/room/create", room);
      console.log('Tạo room nè :' ,response);
      return response;
  } catch (error) {
      console.error("Failed to add room:", error);
      throw error;
  }
};

export const editRoom = async (room: Room) => {
  try {
    const response = await api.put(`/room/update?id=${room.id}`, room);
    console.log(response);
    return response
  } catch (error) {
    console.error("Failed to update room", error);
    throw error;
  }
};