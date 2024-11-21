import api from "../axios";
import { Bill } from "@/types/types";
import useBillStore from "@/stores/invoiceStore";

// Lấy tất cả hóa đơn
export const getAllBills = async () => {
  try {
    useBillStore.getState().clearBills(); // Xóa danh sách hóa đơn cũ
    const response = await api.get(`/bill/billall`); // Đường dẫn mới
    useBillStore.getState().setBills(response.data.data); // Lưu danh sách hóa đơn vào store
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Lấy hóa đơn theo Room ID
export const getBillByRoomId = async (roomId: string) => {
  try {
    useBillStore.getState().clearBills(); // Xóa danh sách hóa đơn cũ
    const response = await api.get(`/bill/getbillbyroomid?id=${roomId}`); // Đường dẫn mới
    useBillStore.getState().setBills(response.data.data); // Lưu hóa đơn vào store
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Lấy hóa đơn theo Building ID
export const getBillByBuildingId = async (buildingId: string) => {
  try {
    useBillStore.getState().clearBills(); // Xóa danh sách hóa đơn cũ
    const response = await api.get(`/bill/getbillbybuildingid?id=${buildingId}`); // Đường dẫn mới
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
    console.log(response)
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
    console.log(response)
  } catch (error) {
    throw error;
  }
};
