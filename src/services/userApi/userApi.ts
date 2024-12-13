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

export const forgotpassword = async (email: string): Promise<any> => {
    try {
        const response = await api.post("/identityusers/forgotpassword?Email="+ email);

        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Quên mật khẩu thất bại:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API quên mật khẩu:", error);
        return null;
    }
};

export const verifyotp = async (email: string, otp: string): Promise<any> => {
    try {
        const response = await api.post(`/identityusers/verifyotp?email=${email}&otp=${otp}`, {
            email,
            otp,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error("xác thực otp thất bại:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API xác thực otp:", error);
        return null;
    }
};

export const updatepassword = async (email: string, otp: string, newPassword: string): Promise<any> => {
    try {
        // Xây dựng URL động với các tham số email, otp, và newPassword
        const response = await api.post(`/identityusers/updatepassword?email=${email}&enteredCode=${otp}&newPassword=${newPassword}`);

        if (response.status === 200) {
            return response.data; // Trả về dữ liệu từ phản hồi
        } else {
            console.error("Cập nhật mật khẩu thất bại:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API cập nhật mật khẩu:", error);
        return null;
    }
};