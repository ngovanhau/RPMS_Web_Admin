import React, { useState, useEffect } from "react";
import { updateTenant, getroombystatus } from "@/services/tenantApi/tenant";
import { uploadImage, deleteImage } from "@/services/imageApi/imageApi";
import { Image, message, Upload } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Tenant } from "@/types/types";

interface Room {
  id: string;
  room_name: string;
}

interface EditTenantFormProps {
  tenant: Tenant; // Dữ liệu Tenant gốc để hiển thị
  onSuccess: () => void; // Callback khi update thành công
  onClose: () => void; // Callback khi đóng form
}

// FileType chỉ là tham chiếu kiểu cho hàm beforeUpload
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const EditTenantForm: React.FC<EditTenantFormProps> = ({
  tenant,
  onSuccess,
  onClose,
}) => {
  // 1) Tạo state cho Tenant đang edit, trong đó ép kiểu `date_of_birth` và `date_of_issue` thành Date
  const [editableTenant, setEditableTenant] = useState<Tenant>({
    ...tenant,
    date_of_birth: tenant.date_of_birth
      ? new Date(tenant.date_of_birth)
      : new Date(),
    date_of_issue: tenant.date_of_issue
      ? new Date(tenant.date_of_issue)
      : new Date(),
  });
  // 2) Danh sách rooms (phòng trống) để cho user chọn
  const [rooms, setRooms] = useState<Room[]>([]);

  // 3) Quản lý fileList cho Upload
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // ----------------------------------------------------------------
  // useEffect: load danh sách phòng, đồng thời map tenant.imageCCCDs -> fileList
  // ----------------------------------------------------------------
  useEffect(() => {
    fetchAvailableRooms();

    // Map ảnh cũ (nếu có) thành dạng UploadFile => để hiển thị trong antd Upload
    const initialFiles: UploadFile[] | undefined = tenant.imageCCCDs?.map(
      (url, index) => ({
        uid: `-${index}`,
        name: `Image ${index + 1}`,
        status: "done",
        url,
      })
    );
    setFileList(initialFiles || []);
  }, [tenant]);
  // Thêm [tenant] để khi prop tenant thay đổi, form cập nhật lại.

  // Hàm load danh sách phòng trống (status=0) => bạn có thể chỉnh lại logic nếu cần
  const fetchAvailableRooms = async () => {
    try {
      const response = await getroombystatus(0);
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  // ----------------------------------------------------------------
  // Các hàm handleChange
  // ----------------------------------------------------------------
  // handleChange cho các input text, select...
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setEditableTenant((prevTenant) => ({
      ...prevTenant,
      [id]: value,
    }));
  };

  // handleDateChange cho trường date (ngày sinh, ngày cấp)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditableTenant((prevTenant) => ({
      ...prevTenant,
      [id]: new Date(value),
    }));
  };

  // ----------------------------------------------------------------
  // Submit form => gọi API updateTenant
  // ----------------------------------------------------------------
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Gọi API update
      await updateTenant(editableTenant);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update tenant:", error);
    }
  };

  // ----------------------------------------------------------------
  // Upload / Remove / Preview ảnh
  // ----------------------------------------------------------------
  // Hàm upload ảnh => customRequest của antd
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const imageUrl = await uploadImage(file);
      onSuccess("OK");
      // Cập nhật vào editableTenant.imageCCCDs
      setEditableTenant((prev) => ({
        ...prev,
        imageCCCDs: [...prev.imageCCCDs, imageUrl],
      }));
      // Cập nhật vào fileList để antd hiển thị
      setFileList((prevList) => [
        ...prevList,
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: imageUrl,
        },
      ]);
      message.success("Upload thành công!");
    } catch (error) {
      onError({ error });
      message.error("Upload thất bại!");
    }
  };

  // Xóa ảnh
  const handleRemove = async (file: UploadFile) => {
    try {
      if (file.url) {
        await deleteImage(file.url);
        message.success("Xóa ảnh thành công!");
      }
      // Xóa file khỏi fileList
      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== file.uid)
      );
      // Xóa link khỏi editableTenant.imageCCCDs
      setEditableTenant((prev) => ({
        ...prev,
        imageCCCDs: prev.imageCCCDs.filter((url) => url !== file.url),
      }));
    } catch (error) {
      message.error("Xóa ảnh thất bại!");
    }
  };

  // Xem ảnh preview
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Cấu hình cho antd Upload
  const uploadProps: UploadProps = {
    customRequest: handleUpload, // Thay thế quy trình upload mặc định
    onRemove: handleRemove,
    listType: "picture-card",
    fileList,
    onPreview: handlePreview,
  };

  // Nút upload
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
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
            value={editableTenant.customer_name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full p-2 border  rounded-[8px]"
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
            value={editableTenant.phone_number}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="w-full p-2 border  rounded-[8px]"
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
            value={editableTenant.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className="w-full p-2 border  rounded-[8px]"
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
            value={editableTenant.date_of_birth.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="w-full p-2 border  rounded-[8px]"
          />
        </div>

        {/* Choose Room */}
       <div>
          <label  className="block text-gray-700 font-semibold mb-1" htmlFor="choose_room">Phòng thuê</label>
  
          {editableTenant.choose_room !==
          "00000000-0000-0000-0000-000000000000" ? (
            // Nếu tenant có phòng (ID khác chuỗi zero)
            <div className="p-2 w-full border border-gray-300 rounded-[8px]">
              <span className="">
                {editableTenant.roomName || "Đang thuê phòng này"}
              </span>
            </div>
          ) : (
            // Ngược lại => hiển thị "Chưa thuê phòng"
            <div className="p-2 w-full border border-gray-300 rounded-[8px]">
              <span className="text-gray-500">Chưa thuê phòng</span>
            </div>
          )}
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
            value={editableTenant.cccd}
            onChange={handleChange}
            placeholder="Nhập số CMND/CCCD"
            className="w-full p-2 border  rounded-[8px]"
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
            value={editableTenant.place_of_issue}
            onChange={handleChange}
            placeholder="Nhập nơi cấp CMND/CCCD"
            className="w-full p-2 border  rounded-[8px]"
          />
        </div>

        {/* Date of Issue */}
        <div>
          <label
            htmlFor="date_of_issue"
            className="block text-gray-700 font-semibold mb-1"
          >
            Ngày cấp
          </label>
          <input
            type="date"
            id="date_of_issue"
            value={editableTenant.date_of_issue.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="w-full p-2 border  rounded-[8px]"
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
            value={editableTenant.address ?? ""}
            onChange={handleChange}
            placeholder="Nhập địa chỉ của người thuê"
            className="w-full p-2 border  rounded-[8px]"
            rows={2}
          />
        </div>

        {/* Image CCCD */}
        <div className="col-span-2">
          <label
            htmlFor="imageCCCDs"
            className="block text-gray-700 font-semibold mb-1"
          >
            Ảnh CMND/CCCD
          </label>
          <Upload {...uploadProps}>
            {fileList.length < 8 && uploadButton}
          </Upload>

          {/* Preview ảnh (ẩn wrapper, chỉ hiển thị khi previewOpen=true) */}
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              src: previewImage,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
          />
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-4">
      <button
          type="button"
          onClick={onClose}
          className="py-2 px-6 rounded-md border border-gray-300"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-md"
        >
          Lưu
        </button>

      </div>
    </form>
  );
};

export default EditTenantForm;
