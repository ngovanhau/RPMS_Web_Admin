import api from "../axios";

export const getAllDashboard = async () => {
    try {
       const response = await api.get("/dashboard/dashboardall") 
       return response.data.data
    } catch (error) {
        console.log(error);
    }
  }