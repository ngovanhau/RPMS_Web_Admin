import api from "@/services/axios"; 

/**
 * Hàm upload ảnh
 * @param {File} file - File ảnh được chọn từ input
 * @returns {Promise<string>} - Trả về URL ảnh sau khi upload thành công
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("imageFile", file); // Tham số `imageFile` phải khớp với API backend

    const response = await api.post("/upload/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Header để gửi file
      },
    });
    console.log('Đây là response ', response)
    if (response.status === 201 || response.status === 200) {
      return response.data.data; 
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
