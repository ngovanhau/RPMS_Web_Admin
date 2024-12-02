import { Contract } from "@/types/types";
import api from "../axios";
import useTenantStore from "@/stores/tenantStore";
import useContractStore from "@/stores/contractStore";

export const getCustomerNoRoom = async () => {
  try {
    const response = await api.get(`/customer/getlistbynoroom`);
    const tenantData = response.data.data;
    // Set the fetched data to tenantsWithoutRoom
    useTenantStore.getState().setTenantsWithoutRoom(tenantData);

    return tenantData;
  } catch (error) {
    console.error(`Error fetching Customer:`, error);
    throw error;
  }
};

export const getAllContract = async () => {
  try {
    const response = await api.get(`/contract/contractall`);
    useContractStore.getState().clearContracts(); // Clear existing contracts
    useContractStore.getState().addContracts(response.data.data); // Add new contracts
    useContractStore.getState().removeDuplicateContracts(); 
    return response;
  } catch (error) {
    console.error(`Error fetching Contract:`, error);
    throw error;
  }
};


export const createContract = async (contract: Contract) => {
  try {
    console.log("Đây là contract được tạo : ", contract)
    const response = await api.post(`/contract/create/`, contract);
    console.log(response);
  } catch (error) {
    console.error("Error create contract :", error);
    throw error;
  }
};

export const deleteContract = async (id: string) => {
  try {
    const response = await api.delete(`/contract/delete?id=${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error delete contract :", error);
    throw error;
  }
};

export const getContractByBuildingId = async ( id : string ) => {
  try {
    const response = await api.get(`/contract/getcontractbybuildingid?id=${id}`)
    useContractStore.getState().clearContracts(); // Clear existing contracts
    useContractStore.getState().addContracts(response.data.data);
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const downloadContractPDF = async ( contractId : string ) => {
  try {
    const response = await api.get(`/contract/download-pdf/${contractId}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
} 

export const updateContract = async ( contract : Contract ) => {
  try {
    const response = await api.put(`/contract/update?id=${contract.id}`, contract)
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
