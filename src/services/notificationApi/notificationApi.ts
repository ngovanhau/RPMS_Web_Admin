import api from "../axios";
import { UserTokens } from "@/types/types";
import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDlxyL-YbbZloekntzaV8aJNuONvi3kRdI",
  authDomain: "uploadimg-97839.firebaseapp.com",
  projectId: "uploadimg-97839",
  storageBucket: "uploadimg-97839.appspot.com",
  messagingSenderId: "766099455450",
  appId: "1:766099455450:web:d8ed6c9f8aa18cc4e654e3",
  measurementId: "G-CEL2EZ1H2F",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getDeviceToken = async (): Promise<string | null> => {
  try {
    // Yêu cầu quyền thông báo từ người dùng
    console.log("Đang yêu cầu quyền thông báo...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Người dùng chưa cấp quyền thông báo.");
      return null; // Dừng tại đây nếu không có quyền
    }
    console.log("Người dùng đã cấp quyền thông báo.");

    // Đăng ký Service Worker
    console.log("Đang đăng ký Service Worker...");
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("Service Worker đăng ký thành công:", registration);

    // Lấy Device Token
    console.log("Đang lấy device token...");
    const token = await getToken(messaging, {
      vapidKey: "BFw7f8P8iYgA4xqXCeh-y6tGln4rOUsURTWW_HAUmDASP8sPi0yNtaqqIpI6DIsW0Ra2j0NNDpJPuDYA9v-ETXM",
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("Device token lấy thành công:", token);
    } else {
      console.warn("Không tìm thấy device token.");
    }
    return token;
  } catch (error) {
    console.error("Lỗi khi lấy device token:", error);
    return null;
  }
};


// api lưu UserTokens
export const useUserTokens = async (data: UserTokens) => {
  try {
    console.log("Gửi UserTokens đến API:", data);
    const response = await api.post(`/usertokens/create`, data);
    console.log("API trả về:", response.data);
    return response;
  } catch (error) {
    console.error("Lỗi khi lưu UserTokens:", error);
    throw error;
  }
};


export const createNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  isRead: boolean
) => {
  try {
    // Tạo body dữ liệu cần gửi đi
    const notificationData = {
      title,
      message,
      userId,
      createdAt: new Date().toISOString(),
      isRead,
    };

    // Thực hiện request POST đến API
    const response = await api.post('notifications/create', notificationData);
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;  // Ném lỗi ra ngoài nếu có lỗi xảy ra
  }
};


// get 
export const getAllNotification= async (userId: string) => {
  try {
    const response = await api.get(`/notifications/getbyuserid?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    throw error;
  }
};

//update isread

export const updateisread= async (userId: string, isread: boolean) => {
  try {
    const response = await api.put(`/notifications/updateisread?id=${userId}&isread=${isread}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
    throw error;
  }
};
//delete
export const deletenotification = async (userId: string) => {
  try {
    const response = await api.delete(`/notifications/delete?id=${userId}`); 
    return response;
  } catch (error) {
    throw error;
  }
};
