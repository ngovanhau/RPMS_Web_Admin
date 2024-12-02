import { getServicemeterByBuildingId } from './../roomStatementApi/roomStatementApi';
import api from "../axios";
import { Bill } from "@/types/types";
import useBillStore from "@/stores/invoiceStore";

// Lấy tất cả hóa đơn
export const getAllBills = async () => {
  try {
    const response = await api.get(`/bill/billall`); // Đường dẫn mới
    useBillStore.getState().clearBills(); // Xóa danh sách hóa đơn cũ
    useBillStore.getState().setBills(response.data.data); // Lưu danh sách hóa đơn vào store
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Lấy hóa đơn theo Room ID
export const getBillByRoomId = async (roomId: string) => {
  try {
    const response = await api.get(`/bill/getbillbyroomid?id=${roomId}`); // Đường dẫn mới
    useBillStore.getState().clearBills(); // Xóa danh sách hóa đơn cũ
    useBillStore.getState().setBills(response.data.data); // Lưu hóa đơn vào store
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Lấy hóa đơn theo Building ID
export const getBillByBuildingId = async (buildingId: string) => {
  try {
    const response = await api.get(`/bill/getbillbybuildingid?id=${buildingId}`); // Đường dẫn mới
    useBillStore.getState().clearBills(); // Xóa danh sách hóa đơn cũ
    useBillStore.getState().setBills(response.data.data); // Lưu danh sách hóa đơn vào store
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Tạo hóa đơn mới
export const createBill = async (data: Bill) => {
  try {
    const response = await api.post(`/bill/create`, data); // Đường dẫn mới
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Cập nhật hóa đơn
export const editBill = async (data: Bill) => {
  try {
    const response = await api.put(`/bill/update?id=${data.id}`, data); // Đường dẫn mới
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Xóa hóa đơn
export const deleteBill = async (billId: string) => {
  try {
    const response = await api.delete(`/bill/delete?id=${billId}`); // Đường dẫn mới
    return response;
  } catch (error) {
    throw error;
  }
};



export const getServiceMeterReadingByRoomId = async ( roomId : string ) => {
  try {
    const response = await api.get(`/servicemeterreadings/getservicebyroomid?id=${roomId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    throw error;
  }
}