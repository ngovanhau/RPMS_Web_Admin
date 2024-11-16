import api from "../axios";

export const uploadImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await api.post("/upload/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
}

export const deleteImage = async (imageId: string) => {
    try {
      await api.delete(`/upload/delete-image?imageUrl=${imageId}`);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  };