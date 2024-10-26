import api from "../axios";
import useServiceStore from "@/stores/servicesStore";


import { Service } from "@/types/types";


export const createService = async (serviceData: Service): Promise<any> => {
    try {
      const response = await api.post("/service/create", serviceData);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  };



  export const deleteService = async (serviceId: string) => {
    try {
      await api.delete(`/service/delete?id=${serviceId}`);
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };



  export const updateService = async (service: Service) => {
    try {
      await api.put(`/service/update?id=${service.id}`, service);
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };