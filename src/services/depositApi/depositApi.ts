import api from "../axios";
import { Deposit } from "@/types/types";
import { useDepositStore } from "@/stores/depositStore";

export const createDeposit = async (depositData: Deposit) => {
    try {
      const response = await api.post("/deposit/create", depositData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo deposit:", error);
      throw error;
    }
  };

  export const getAllDeposit = async () => {
    try {
        useDepositStore.getState().clearDeposits()
       const response = await api.get("/deposit/depositall") 
       useDepositStore.getState().setDeposits(response.data.data)
       return response.data.data
    } catch (error) {
        console.log(error);
    }
  }


  export const getDepositByBuildingId = async ( buildingId : string ) => {
    try {
      useDepositStore.getState().clearDeposits()
      const response = await api.get(`/deposit/depositorallbybuildingid?id=${buildingId}`)
      useDepositStore.getState().setDeposits(response.data.data)
      return response.data.data
    } catch (error) {
      console.log(error);
    }
  }


export const deleteDepositById = async ( depositId : string ) => {
  try {
    const response = await api.delete(`/deposit/delete?id=${depositId}`)
    return response.data.data
  } catch (error) {
    console.log(error);
  }
}


// Hàm để thay đổi trạng thái deposit theo id
export const changeStatusDepositById = async (id: string, status: number) => {
    try {
      // Gửi yêu cầu PUT để cập nhật trạng thái deposit
      const response = await api.put(`/deposit/updatestatus?id=${id}&status=${status}`);
        return response.data.data
  
    //   return response.data;
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái deposit:", error);
      throw error;
    }
  };



  export const updateDeposit = async (deposit: Deposit) => {
    try {
      // Gửi yêu cầu PUT để cập nhật thông tin deposit
      const response = await api.put(`/deposit/update?id=${deposit.id}`, deposit);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật deposit:", error);
      throw error;
    }
  };