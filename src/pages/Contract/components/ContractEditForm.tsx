import React, { useState, useEffect } from "react";
import { Contract } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import Select from "react-select";
import { getroombystatus } from "@/services/tenantApi/tenant";
import { Room } from "@/types/types";
import { getCustomerNoRoom } from "@/services/contractApi/contractApi";
import useTenantStore from "@/stores/tenantStore";
import { deleteImage, uploadImage } from "@/services/imageApi/imageApi";
import { Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // Fetch data from stores
  const services = useServiceStore.getState().services;
  const listCustomer = useTenantStore.getState().tenantsWithoutRoom;

  // Handle field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContract((prevState) => ({ ...prevState, [name]: value }));

    // Track changes in modifiedData
    setModifiedData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onChange: UploadProps["onChange"] = async ({ file }) => {
    if (file.originFileObj && file.status === "uploading") {
      try {
        // Xóa ảnh cũ trước khi tải ảnh mới
        await handleRemoveImage();
  
        // Tải ảnh mới
        const imageUrl = await uploadImage(file.originFileObj);
        if (imageUrl) {
          const updatedFile: UploadFile = {
            uid: '-1', // Định danh tạm thời
            name: file.name || "image.png", // Tên ảnh
            url: imageUrl, // URL của ảnh mới
            status: "done",
          };
  
          // Cập nhật giao diện và trạng thái hợp đồng
          setFileList([updatedFile]);
          setModifiedData((prevState) => ({
            ...prevState,
            image: imageUrl,
          }));
  
          message.success("Ảnh đã tải lên thành công!");
        } else {
          throw new Error("Không nhận được URL ảnh từ API.");
        }
      } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        message.error("Tải ảnh thất bại. Vui lòng thử lại.");
        setFileList([]); // Reset fileList nếu lỗi
      }
    }
  };
  
  // Xóa ảnh
  const handleRemoveImage = async () => {
    if (contract.image) {
      try {
        // Gọi API để xóa ảnh trên server
        await deleteImage(contract.image);
        // Xóa ảnh trong state contract
        setModifiedData((prevState) => ({
          ...prevState,
          image: "",
        }));
  
        // Xóa ảnh khỏi giao diện
        setFileList([]);
  
        message.success("Ảnh đã được xóa!");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        message.error("Xóa ảnh thất bại. Vui lòng thử lại.");
      }
    }
  };
  

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // Submit form with updated data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Merge initial contract with modified data for submission
    const updatedContract = { ...initialContract, ...modifiedData };

    // Return both the full contract and the modified fields
    onSubmit(updatedContract, modifiedData);
  };

  useEffect(() => {
    // Đồng bộ modifiedData với dữ liệu contract khi vào trang
    setModifiedData(initialContract);
  }, [initialContract]);
  
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

        if (contract?.image) {
          const updatedFile: UploadFile = {
            uid: '-1',
            name: 'image.png',
            url: contract.image,
            status: "done",
          };
          setFileList([updatedFile]);
        }
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
            value={formatDateToISO(modifiedData.start_day)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setModifiedData({
                ...modifiedData,
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
            value={formatDateToISO(modifiedData.end_day)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setModifiedData({
                ...modifiedData,
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
          Ảnh hợp đồng
        </label>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          onRemove={handleRemoveImage}
          maxCount={1}
        >
          {fileList.length === 0 && "+ Upload"}{" "}
        </Upload>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          // onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded hover:bg-blue-700 bg-themeColor"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default EditContractForm;
