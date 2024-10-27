import api from "../axios";
import { useBuildingStore } from "@/stores/buildingStore";
import { Building } from "@/types/types";


export const getAllBuildings = async () => {
  try {
    const response = await api.get("/building/buildingall");
    const buildingsData = response.data.data;
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