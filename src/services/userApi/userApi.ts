import api from "../axios";

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
            return response.data;
        } else {
            console.error("Lấy thông tin người dùng thất bại:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin người dùng:", error);
        return null;
    }
};

