import { createTenant } from "@/services/tenantApi/tenant";
import { Tenant } from "@/types/types";
import React, { useState, useEffect } from "react";
import { getroombystatus } from "@/services/tenantApi/tenant";
// import { uploadImage } from "@/services/uploadApi/upload";
import { Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { uploadImage } from "@/services/imageApi/imageApi";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface TenantFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface Room {
  id: string;
  room_name: string;
}

const TenantForm: React.FC<TenantFormProps> = ({ onSuccess, onClose }) => {
  const [tenant, setTenant] = useState<Tenant>({
    customer_name: "",
    phone_number: "",
    choose_room: "",
    email: "",
    date_of_birth: new Date(),
    cccd: "",
    date_of_issue: new Date(),
    place_of_issue: "",
    address: "",
    imageCCCDs: [],
    roomName: "",
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      const response = await getroombystatus(0);
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setTenant((prevTenant) => ({
      ...prevTenant,
      [id]: value,
    }));
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const uploadedImageUrls: string[] = [];

      for (const file of files) {
        try {
          const response = await uploadImage(file);
          uploadedImageUrls.push(response); // Assuming response.data.url contains the image URL
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }

      setTenant((prevTenant) => ({
        ...prevTenant,
        imageCCCDs: [...prevTenant.imageCCCDs, ...uploadedImageUrls],
      }));
    }
  };

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   // Tạo một bản sao của tenant mà không có `choose_room` nếu nó trống
  //   const { choose_room, ...otherTenantData } = tenant;
  //   const tenantData = choose_room ? tenant : otherTenantData;

  //   try {
  //     await createTenant(tenantData);
  //     onSuccess();
  //     onClose();
  //   } catch (error) {
  //     console.error("Failed to create tenant:", error);
  //   }
  // };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // 1. Tải lên tất cả các ảnh trong fileList và thu thập URL
      const uploadedImageUrls: string[] = await Promise.all(
        fileList.map(async (file) => {
          if (file.originFileObj) {
            const uploadedUrl = await uploadImage(file.originFileObj as File);
            console.log(uploadedUrl);
            return uploadedUrl;
          }
          return ""; // Trả về chuỗi rỗng nếu không có file origin
        })
      );

      // 2. Lọc các URL không rỗng
      const validImageUrls = uploadedImageUrls.filter((url) => url !== "");
      console.log("validImageUrls", validImageUrls);

      // 3. Tạo một bản sao của imageCCCDs với các URL mới
      const updatedImageCCCDs = [...tenant.imageCCCDs, ...validImageUrls];

      // 4. Chuẩn bị dữ liệu tenant với imageCCCDs đã cập nhật
      const { choose_room, ...otherTenantData } = tenant;
      const tenantData = choose_room
        ? { ...tenant, imageCCCDs: updatedImageCCCDs }
        : { ...otherTenantData, imageCCCDs: updatedImageCCCDs };

      // 5. Gửi dữ liệu tenant đến server
      await createTenant(tenantData);

      // 6. Cập nhật state tenant với các URL ảnh đã upload
      setTenant((prevTenant) => ({
        ...prevTenant,
        imageCCCDs: updatedImageCCCDs,
      }));

      // 7. Gọi hàm onSuccess và đóng modal
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create tenant:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 bg-white">
      <div className="grid grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="customer_name"
            className="block text-gray-700 font-semibold mb-1"
          >
            Họ và tên *
          </label>
          <input
            type="text"
            id="customer_name"
            value={tenant.customer_name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone_number"
            className="block text-gray-700 font-semibold mb-1"
          >
            Số điện thoại *
          </label>
          <input
            type="text"
            id="phone_number"
            value={tenant.phone_number}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={tenant.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="date_of_birth"
            className="block text-gray-700 font-semibold mb-1"
          >
            Ngày sinh
          </label>
          <input
            type="date"
            id="date_of_birth"
            value={tenant.date_of_birth.toISOString().split("T")[0]}
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                date_of_birth: new Date(e.target.value),
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Choose Room */}
        <div>
          <label
            htmlFor="choose_room"
            className="block text-gray-700 font-semibold mb-1"
          >
            Chọn phòng thuê
          </label>
          <select
            id="choose_room"
            value={tenant.choose_room}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Chọn phòng thuê có sẵn</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room_name}
              </option>
            ))}
          </select>
        </div>

        {/* CCCD */}
        <div>
          <label
            htmlFor="cccd"
            className="block text-gray-700 font-semibold mb-1"
          >
            Số CMND/CCCD
          </label>
          <input
            type="text"
            id="cccd"
            value={tenant.cccd}
            onChange={handleChange}
            placeholder="Nhập số CMND/CCCD"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Place of Issue */}
        <div>
          <label
            htmlFor="place_of_issue"
            className="block text-gray-700 font-semibold mb-1"
          >
            Nơi cấp
          </label>
          <input
            type="text"
            id="place_of_issue"
            value={tenant.place_of_issue}
            onChange={handleChange}
            placeholder="Nhập nơi cấp CMND/CCCD"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Date of Issue */}
        <div>
          <label
            htmlFor="place_of_issue"
            className="block text-gray-700 font-semibold mb-1"
          >
            Ngày cấp
          </label>
          <input
            type="date"
            id="date_of_issue"
            value={
              tenant.date_of_issue
                ? tenant.date_of_issue.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setTenant((prev) => ({
                ...prev,
                date_of_issue: new Date(e.target.value),
              }))
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label
            htmlFor="address"
            className="block text-gray-700 font-semibold mb-1"
          >
            Địa chỉ
          </label>
          <textarea
            id="address"
            value={tenant.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ của người thuê"
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        {/* Image CCCD */}
        <div className="col-span-2">
          <label
            htmlFor="imageCCCDs"
            className="block text-gray-700 font-semibold mb-1"
          >
            Ảnh CMND/CCCD
          </label>
          <ImgCrop rotationSlider>
            <Upload
              multiple
              maxCount={4}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              beforeUpload={() => false} // Ngăn chặn upload tự động
              onPreview={onPreview}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="bg-themeColor text-white py-2 px-6 rounded-md"
        >
          Thêm mới
        </button>
      </div>
    </form>
  );
};

export default TenantForm;
