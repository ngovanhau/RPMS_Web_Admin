import api from "../axios";

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
