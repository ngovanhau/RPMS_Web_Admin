import api from "../axios";
import { Account, User } from "@/types/types";
import useAccountStore from "@/stores/accountStore";

export const createAccount = async (newAccount: User) => {
    try {
      // Send POST request to create account
      const response = await api.post("/identityusers/register", newAccount);
      console.log("Account created successfully:", response);

    } catch (error) {
      console.error("Error creating account:", error);
      // Handle error, e.g., show a message to the user
    }
  };

  export const getAllAccount = async () => {
    try {
        const response = await api.get("/identityusers/getalluser")
        if(response.status === 200){
            useAccountStore.getState().addAccounts(response.data.data)
            return response
        } else {
            console.error('Lấy thông tin account không thành công: ', response.data);
        }
    } catch (error) {
       console.log(error);
       return null;
    }
}

export const deleteAccount = async ( accountId : string) => {
  try {
    const response = await api.delete(`/identityusers/delete?id=${accountId}`)
  } catch (error) {
    console.log(error);
  }
}

export const getPermissionById = async (id : string) => {
  try {
    const response = await api.get(`/permision/getpermisionmanagementbyid?id=${id}`)
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}


export const getUserByBuildingId = async (id: string) => {
  try {
    // Gọi API để lấy dữ liệu quản lý theo tòa nhà
    const response = await api.get(`/permision/getuserbybuildingid?id=${id}`);

    // Kiểm tra và cập nhật dữ liệu vào store nếu có kết quả hợp lệ
    if (response.data && Array.isArray(response.data.data)) {
      const setAccountManageByBuilding = useAccountStore.getState().setAccountManageByBuilding;
      setAccountManageByBuilding(response.data.data);
    } else {
      console.warn("Dữ liệu trả về không hợp lệ:", response.data);
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng theo tòa nhà:", error);
  }
};
