import api from "../axios";
import useAuthStore from "@/stores/userStore";
export const login = async (username: string, password: string): Promise<any> => {
    try {
        const response = await api.post("/identityusers/login", {
            username,
            password,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Đăng nhập thất bại:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API đăng nhập:", error);
        return null;
    }
};

export const information = async (username: string) => {
    try {
        const response = await api.get("/identityusers/information?username=" + username);
        if (response.status === 200) {
            useAuthStore.getState().setUserData(response.data.data)
            return response.data.data;
        } else {
            console.error("Lấy thông tin người dùng thất bại:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin người dùng:", error);
        return null;
    }
};

export const changepassword = async (username: string, oldPassword: string, newPassword: string): Promise<any> => {
    try {
        const response = await api.post("/identityusers/changepassword", {
            username,
            oldPassword,
            newPassword,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Đổi mật khẩu thất bại:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API đổi mật khẩu:", error);
        return null;
    }
};


