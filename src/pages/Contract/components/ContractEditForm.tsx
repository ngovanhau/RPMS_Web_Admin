import React, { useState, useEffect } from "react";
import { Contract } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import Select from "react-select";
import { getroombystatus } from "@/services/tenantApi/tenant";
import { Room } from "@/types/types";
import { getCustomerNoRoom } from "@/services/contractApi/contractApi";
import useTenantStore from "@/stores/tenantStore";
import { uploadImage } from "@/services/imageApi/imageApi";

interface EditContractFormProps {
  contract: Contract; // Contract to edit
  onSubmit: (contract: Contract, modifiedData: Partial<Contract>) => void; // Return both the full contract and modified data
}

const EditContractForm: React.FC<EditContractFormProps> = ({
  contract: initialContract, // Get contract to edit from prop
  onSubmit,
}) => {
  const [contract, setContract] = useState<Partial<Contract>>(initialContract);
  const [modifiedData, setModifiedData] = useState<Partial<Contract>>({});
  const [listRoom, setListRoom] = useState<Room[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // To store image preview URLs

  // Fetch data from stores
  const services = useServiceStore.getState().services;
  const listCustomer = useTenantStore.getState().tenantsWithoutRoom;

  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContract((prevState) => ({ ...prevState, [name]: value }));

    // Track changes in modifiedData
    setModifiedData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Submit form with updated data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Merge initial contract with modified data for submission
    const updatedContract = { ...initialContract, ...modifiedData };

    // Return both the full contract and the modified fields
    onSubmit(updatedContract, modifiedData);
  };

  // Handle room change
  const handleRoomChange = (selectedRoom: { value: string; label: string }) => {
    setContract((prevState) => ({
      ...prevState,
      room: selectedRoom.label,
      roomId: selectedRoom.value,
    }));
    setModifiedData((prevState) => ({
      ...prevState,
      room: selectedRoom.label,
      roomId: selectedRoom.value,
    }));
  };

  // Fetch initial data (rooms and customers)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getallService();
        await getCustomerNoRoom();
        const responseRoom = await getroombystatus(0);
        setListRoom(responseRoom.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Format service options for react-select
  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.service_name,
  }));

  // Format room options for react-select
  const roomOptions = listRoom.map((room) => ({
    value: room.id,
    label: room.room_name || "Phòng không tên",
  }));

  // Format customer options for react-select
  const customerOptions = listCustomer.map((customer) => ({
    value: customer.id || "",
    label: customer.customer_name,
  }));

  // Handle multiple image uploads
  const handleUploadImage = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImageUrls = await Promise.all(
        Array.from(files).map((file) => uploadImage(file))
      );
      // Update contract with new images and preview URLs
      setContract((prevState) => ({
        ...prevState,
        image: [...(prevState.image || []), ...newImageUrls],
      }));
      setImagePreviews((prevState) => [
        ...prevState,
        ...newImageUrls.map((url) => url),
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  // Helper function to safely convert to ISO string
  const formatDateToISO = (date: Date | string | undefined) => {
    if (date instanceof Date) {
      return date.toISOString().split("T")[0]; // Convert Date object to 'YYYY-MM-DD'
    }
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      return parsedDate.toISOString().split("T")[0]; // Convert string to Date and format
    }
    return ""; // Return empty string if the date is undefined or invalid
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Chỉnh Sửa Hợp Đồng
      </h2>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contract Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Tên Hợp Đồng
          </label>
          <input
            type="text"
            name="contract_name"
            value={contract.contract_name || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tên hợp đồng"
            required
          />
        </div>

        {/* Rental Management */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Quản Lý Cho Thuê
          </label>
          <input
            type="text"
            name="rentalManagement"
            value={contract.rentalManagement || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Tên quản lý"
          />
        </div>

        {/* Room */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Phòng
          </label>
          <Select
            options={roomOptions}
            value={{
              label: contract.room || "Chọn phòng",
              value: contract.roomId || "",
            }}
            onChange={(selected) =>
              handleRoomChange(selected as { value: string; label: string })
            }
            className="border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Chọn phòng"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Bắt Đầu
          </label>
          <input
            type="date"
            name="start_day"
            value={formatDateToISO(contract.start_day)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setContract({
                ...contract,
                start_day: newDate,
              });
            }}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Kết Thúc
          </label>
          <input
            type="date"
            name="end_day"
            value={formatDateToISO(contract.end_day)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setContract({
                ...contract,
                end_day: newDate,
              });
            }}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Billing Start Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Bắt Đầu Thanh Toán
          </label>
          <input
            type="date"
            name="billing_start_date"
            value={formatDateToISO(contract.billing_start_date)}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Customer */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Khách Hàng
          </label>
          <Select
            options={customerOptions}
            value={{
              label: contract.customerName || "Chọn khách hàng",
              value: contract.customerId || "",
            }}
            onChange={(selected) => {
              setContract({
                ...contract,
                customerId: selected?.value || "",
                customerName: selected?.label || "",
              });
              setModifiedData({
                ...modifiedData,
                customerId: selected?.value || "",
                customerName: selected?.label || "",
              });
            }}
            className="border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Chọn khách hàng"
          />
        </div>
      </div>

      {/* Upload Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          Hình Ảnh
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUploadImage(e.target.files)}
          className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        {/* Display uploaded images as thumbnails */}
        {imagePreviews.length > 0 && (
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Ảnh đã tải lên</h3>
            <div className="flex space-x-4">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`preview-${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {uploading ? "Đang tải..." : "Cập nhật hợp đồng"}
        </button>
      </div>
    </form>
  );
};

export default EditContractForm;
