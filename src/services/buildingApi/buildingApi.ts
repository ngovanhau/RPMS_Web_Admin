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