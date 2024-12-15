import React, { useState, useEffect } from "react";
import { Building, Deposit, Room, Tenant } from "@/types/types";
import {
  getRoomsByBuildingIdAndStatus,
  getBuildingByRoomId,
} from "@/services/bookingApi/bookingApi";
import { getRoomById } from "@/services/buildingApi/buildingApi";
import { getCustomerNoRoom } from "@/services/contractApi/contractApi";

import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { uploadImage, deleteImage } from "@/services/imageApi/imageApi";

type FileType = UploadFile;

interface CreateDepositProps {
  onSubmit: (deposit: Deposit) => void;
  onClose: () => void;
  buildings: Building[];
  initialData?: Deposit;
}

const CreateDeposit: React.FC<CreateDepositProps> = ({
  onSubmit,
  onClose,
  buildings,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Deposit>>(
    initialData || {
      deposit_amount: 0,
      roomid: "",
      payment_method: "",
      customerid: "",
      customername: "",
      image: [],
      note: "",
      status: 0,
    }
  );

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [customers, setCustomers] = useState<Tenant[]>([]); // Danh sách khách hàng
  const [roomName, setRoomName] = useState<string>(""); // Tên phòng
  const [buildingName, setBuildingName] = useState<string>(""); // Tên tòa nhà
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // Fetch danh sách phòng khi chọn tòa nhà
  useEffect(() => {
    if (selectedBuildingId) {
      (async () => {
        const fetchedRooms = await getRoomsByBuildingIdAndStatus(
          selectedBuildingId,
          0
        );
        setRooms(fetchedRooms);
      })();
    } else {
      setRooms([]);
    }
  }, [selectedBuildingId]);

  // Fetch danh sách khách hàng
  useEffect(() => {
    (async () => {
      try {
        const response = await getCustomerNoRoom();
        if (response) {
          setCustomers(response);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchRoomAndBuilding = async () => {
      if (initialData?.roomid) {
        try {
          const roomData = await getRoomById(initialData.roomid);
          if (roomData?.data?.data) {
            const room = roomData.data.data;
            setRoomName(room.room_name || "");
            setSelectedBuildingId(room.building_Id || "");
            handleInputChange("roomid", initialData.roomid);
          }

          const buildingResponse = await getBuildingByRoomId(initialData.roomid);
          if (buildingResponse?.data) {
            setBuildingName(buildingResponse.data.building_name || "");
          }
        } catch (error) {
          console.error("Error fetching room/building data:", error);
        }
      }
    };

    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        move_in_date: initialData.move_in_date
          ? formatToDatetimeLocal(initialData.move_in_date)
          : "",
      }));

      const initialFiles: UploadFile[] | undefined = initialData.image?.map((url, index) => ({
        uid: `-${index}`,
        name: `Image ${index + 1}`,
        status: "done", // Dùng đúng kiểu cho status
        url,
      }));
      setFileList(initialFiles || []);

      fetchRoomAndBuilding();
    }
  }, [initialData]);

  // Format số tiền
  const formatNumber = (value: string): string => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleInputChange = (field: keyof Deposit, value: string | number) => {
    let formattedValue = value;

    if (field === "deposit_amount") {
      formattedValue = value.toString().replace(/\D/g, "");
      formattedValue = formatNumber(formattedValue);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedAmount = formData.deposit_amount?.toString().replace(/\./g, "");

    if (
      !cleanedAmount ||
      !formData.roomid ||
      !formData.payment_method ||
      !formData.customerid ||
      !formData.deposit_amount ||
      !formData.move_in_date
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const uploadedImages = fileList
      .filter((file) => file.status === "done" && file.url)
      .map((file) => file.url as string);

    onSubmit({
      ...formData,
      deposit_amount: Number(cleanedAmount),
      image: uploadedImages,
    } as Deposit);
    onClose();
  };

  const formatToDatetimeLocal = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      const isDatetimeLocalFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(date);
      return isDatetimeLocalFormat ? date : new Date(date).toISOString().slice(0, 16);
    }
    return date.toISOString().slice(0, 16);
  };

  // Xử lý xem ảnh
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Xử lý upload ảnh
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      const imageUrl = await uploadImage(file);
      onSuccess("OK");

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

  // Xử lý xóa ảnh
  const handleRemove = async (file: UploadFile) => {
    try {
      if (file.url) {
        await deleteImage(file.url);
        message.success("Xóa ảnh thành công!");
      }

      setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    } catch (error) {
      message.error("Xóa ảnh thất bại!");
    }
  };

  const uploadProps: UploadProps = {
    customRequest: handleUpload,
    onRemove: handleRemove,
    listType: "picture-card",
    fileList,
    onPreview: handlePreview,
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tòa nhà */}
      <div>
        <label className="block text-sm font-medium mb-1">Tòa nhà</label>
        <select
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuildingId(e.target.value)}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">{buildingName || "Chọn tòa nhà"}</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.building_name}
            </option>
          ))}
        </select>
      </div>

      {/* Phòng */}
      <div>
        <label className="block text-sm font-medium mb-1">Phòng</label>
        <select
          value={formData.roomid}
          onChange={(e) => handleInputChange("roomid", e.target.value)}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">{roomName || "Chọn phòng"}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.room_name}
            </option>
          ))}
        </select>
      </div>

      {/* Chọn khách hàng */}
      <div>
        <label className="block text-sm font-medium mb-1">Khách hàng</label>
        <select
          value={formData.customerid}
          onChange={(e) => handleInputChange("customerid", e.target.value)}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">Chọn khách hàng</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.customer_name} - {customer.phone_number}
            </option>
          ))}
        </select>
      </div>

      {/* Số tiền cọc */}
      <div>
        <label className="block text-sm font-medium mb-1">Số tiền</label>
        <input
          type="text"
          value={formData.deposit_amount}
          onChange={(e) => handleInputChange("deposit_amount", e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Nhập số tiền"
        />
      </div>

      {/* Phương thức thanh toán */}
      <div>
        <label className="block text-sm font-medium mb-1">Phương thức thanh toán</label>
        <select
          value={formData.payment_method}
          onChange={(e) => handleInputChange("payment_method", e.target.value)}
          className="w-full p-2 border rounded bg-white focus:outline-none"
        >
          <option value="">Chọn phương thức</option>
          <option value="Tiền mặt">Tiền mặt</option>
          <option value="Chuyển khoản">Chuyển khoản</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ngày dự kiến nhận phòng</label>
        <input
          type="datetime-local"
          value={formatToDatetimeLocal(formData.move_in_date)}
          onChange={(e) => handleInputChange("move_in_date", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <textarea
          value={formData.note}
          onChange={(e) => handleInputChange("note", e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>
      <div>
      <Upload {...uploadProps}>{fileList.length < 8 && uploadButton}</Upload>
      <Image
        wrapperStyle={{ display: "none" }}
        preview={{
          visible: previewOpen,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
      />
    </div>

      {/* Nút lưu */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
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

export default CreateDeposit;
