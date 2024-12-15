import api from "@/services/axios"; 
import axios from "axios";

/**
 * Hàm upload ảnh
 * @param {File} file - File ảnh được chọn từ input
 * @returns {Promise<string>} - Trả về URL ảnh sau khi upload thành công
 */
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

    console.log("Đây là response ", response);

    if (response.status === 201 || response.status === 200) {
      // Kiểm tra cấu trúc response trả về từ API
      if (response.data?.isSuccess && response.data?.data) {
        return response.data.data; // Trả về URL ảnh từ thuộc tính `data`
      } else {
        throw new Error("Invalid response format from server");
      }
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};


export const deleteImage = async ( imageUrl : string) => {
  try {
    const response = await api.delete(`/upload/delete-image?imageUrl=${imageUrl}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

