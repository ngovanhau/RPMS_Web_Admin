import api from "../axios";

import { Tenant } from "@/types/types";
import useTenantStore from "@/stores/tenantStore";

export const getallTenant = async () => {
  try {
    const response = await api.get(`/customer/customerall`);
    const tenantData = response.data.data;
    useTenantStore.getState().setAllTenants(tenantData);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Tenants:", error);
    throw error;
  }
};
export const getbyidTenant = async(TenanID: string) => {
  try {
    const response = await api.get(`/customer/getcustomerbyid?id=${TenanID}` );
    return response.data;
  } catch (error) {
    console.error(`Error fetching Tenant with ID ${TenanID}:`, error);
      throw error;
  }
}

export const createTenant = async (TenantData: Tenant) => {
    try {
      const response = await api.post("/customer/create", TenantData);
      return response.data;
    } catch (error) {
      console.error("Error creating Tenant:", error);
      throw error;
    }
  };

export const deleteTenant = async (TenantId: string) => {
  try {
    await api.delete(`/customer/delete?id=${TenantId}`);
  } catch (error) {
    console.error("Failed to delete Tenant:", error);
    throw error;
  }
};

export const updateTenant = async (Tenant: Tenant) => {
  try {
    await api.put(`/customer/update?id=${Tenant.id}`, Tenant);
  } catch (error) {
    console.error("Failed to update Tenant:", error);
    throw error;
  }
};

export const getroombystatus = async(ID: number) => {
  try {
    const response = await api.get(`/room/getroombystatus?status=${ID}` );
    return response.data;
  } catch (error) {
    console.error(`Error fetching Tenant with ID ${ID}:`, error);
      throw error;
  }
}
