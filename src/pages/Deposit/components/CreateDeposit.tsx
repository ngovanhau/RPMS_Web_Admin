import React, { useState, useEffect } from "react";
import { Building, Deposit, Room, Tenant } from "@/types/types";
import {
  getRoomsByBuildingIdAndStatus,
  getBuildingByRoomId,
} from "@/services/bookingApi/bookingApi";
import { getRoomById } from "@/services/buildingApi/buildingApi";
import { getCustomerByStatus, getCustomerNoRoom } from "@/services/contractApi/contractApi";

import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { uploadImage, deleteImage } from "@/services/imageApi/imageApi";
import * as Select from "@radix-ui/react-select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";

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
      buildingId: "",
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
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [customers, setCustomers] = useState<Tenant[]>([]); // Danh sách khách hàng
  const [roomName, setRoomName] = useState<string>(""); // Tên phòng
  const [buildingName, setBuildingName] = useState<string>(""); // Tên tòa nhà
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const [formState, setFormState] = useState<{
    depositDate: Date;
    moveInDate: Date;
    numberOfPeople: number;
    room_amount: number;
  }>({
    depositDate: new Date(), // Ngày hiện tại
    moveInDate: new Date(), // Ngày hiện tại
    numberOfPeople: 0,
    room_amount: 0,
  });

  const handleBuildingChange = (value: string) => {
    setSelectedBuildingId(value); // Cập nhật selectedBuildingId
    setFormData((prev) => ({
      ...prev,
      buildingId: value, // Đồng bộ buildingId với formData
    }));
  };

  const handleInputChange1 = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: field.includes("Date") ? new Date(value) : value, // Chuyển đổi sang Date nếu là trường ngày
    }));
  };

  // Fetch danh sách phòng khi chọn tòa nhà
  useEffect(() => {
    const fetchRooms = async () => {
      if (selectedBuildingId) {
        setFormData((prev) => ({
          ...prev,
          buildingId: selectedBuildingId,
        }));
        const fetchedRooms = await getRoomsByBuildingIdAndStatus(
          selectedBuildingId,
          99
        );
        setRooms(fetchedRooms);
      } else {
        setRooms([]);
      }
    };

    fetchRooms(); // Gọi hàm async bên trong useEffect
  }, [selectedBuildingId]);

  useEffect(() => {
    if (selectedRoomId) {
      (async () => {
        const fetchedDataRoom = await getRoomById(selectedRoomId);
        
        if (fetchedDataRoom?.data) {
          setFormData((prev) => ({
            ...prev,
            deposit_amount: fetchedDataRoom.data.data.deposit,
          }));
          setFormState((prev) => ({
            ...prev,
            room_amount: fetchedDataRoom.data.data.room_price,
          }));
        } else {
          console.error("fetchedDataRoom or fetchedDataRoom.data is null");
        }
      })();
    }
  }, [selectedRoomId]);

  // Fetch danh sách khách hàng
  useEffect(() => {
    (async () => {
      try {
        const response = await getCustomerByStatus(10);
        if (response) {
          setCustomers(response.data);
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

          const buildingResponse = await getBuildingByRoomId(
            initialData.roomid
          );
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
      setSelectedBuildingId(initialData?.buildingId || "");
      setSelectedRoomId(initialData.roomid);

      const initialFiles: UploadFile[] | undefined = initialData.image?.map(
        (url, index) => ({
          uid: `-${index}`,
          name: `Image ${index + 1}`,
          status: "done",
          url,
        })
      );
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
      formattedValue = formattedValue.replace(/^0+/, "");
      formattedValue = formatNumber(formattedValue);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form Data: ", formData); // Kiểm tra formData trước khi submit
    e.preventDefault();
    const cleanedAmount = formData.deposit_amount
      ?.toString()
      .replace(/\./g, "");

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
      const isDatetimeLocalFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(
        date
      );
      return isDatetimeLocalFormat
        ? date
        : new Date(date).toISOString().slice(0, 16);
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

      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== file.uid)
      );
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
      {/* <div className="w-full">
        <span className="text-themeColor font-semibold">Thông tin khách</span>
      </div> */}
      <div className="w-full flex flex-row justify-between  space-x-4">
        <div className="w-[48%]">
          <label className="block text-sm font-medium mb-1">Tòa nhà</label>
          <select
            value={selectedBuildingId}
            onChange={(e) => handleBuildingChange(e.target.value)}
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
        <div className="w-[48%]">
          <label className="block text-sm font-medium mb-1">Phòng</label>
          <select
            value={formData.roomid}
            onChange={(e) => {
              handleInputChange("roomid", e.target.value),
                setSelectedRoomId(e.target.value);
            }}
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
      </div>

      {/* Chọn khách hàng */}
      <div className="flex flex-row w-full justify-between">
        <div className="w-[48%]">
          <label className="block text-sm font-medium mb-1">Khách hàng</label>
          <select
            value={formData.customerid}
            onChange={(e) => handleInputChange("customerid", e.target.value)}
            className="w-full p-2 border rounded bg-white focus:outline-none"
          >
            <option value="">Chọn khách hàng</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.customer_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-[48%]">
          <label className="block text-sm font-medium mb-1">
            Ngày dự kiến nhận phòng
          </label>
          {/* <input
            type="datetime-local"
            value={formatToDatetimeLocal(formData.move_in_date)}
            onChange={(e) => handleInputChange("move_in_date", e.target.value)}
            className="w-full p-2 border rounded"
          /> */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-[8px] text-left flex flex-row justify-between">
                {formData.move_in_date
                  ? new Date(formData.move_in_date).toLocaleDateString("vi-VN")
                  : "Chọn ngày"}
                <CalendarDays className="text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white rounded-md shadow-md">
              <Calendar
                mode="single"
                selected={formData.move_in_date ? new Date(formData.move_in_date) : undefined}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    move_in_date: date ? date.toISOString() : "",
                  }))
                }
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="w-[30%]">
          <label className="block text-sm font-medium mb-1">Tiền phòng</label>
          <div
            className={`w-full p-2 border rounded bg-white ${
              formState.room_amount ? "text-black" : "text-gray-400"
            }`}
          >
            {formState.room_amount.toLocaleString() || "Tiền phòng"}{" "}
            {/* Hiển thị thông tin hoặc thông báo nếu giá trị rỗng */}
          </div>
        </div>
        <div className="w-[30%]">
          <label className="block text-sm font-medium mb-1">Số tiền cọc</label>
          <div
            className={`w-full p-2 border rounded bg-white ${
              formData.deposit_amount ? "text-black" : "text-gray-400"
            }`}
          >
            {formData.deposit_amount?.toLocaleString() || "Tiền cọc"}{" "}
            {/* Hiển thị thông tin hoặc thông báo nếu giá trị rỗng */}
          </div>
        </div>

        <div className="w-[30%]">
          <label className="block text-sm font-medium mb-1">
            Phương thức thanh toán
          </label>
          <select
            value={formData.payment_method}
            onChange={(e) =>
              handleInputChange("payment_method", e.target.value)
            }
            className="w-full p-2 border rounded bg-white focus:outline-none"
          >
            <option value="">Chọn phương thức</option>
            <option value="Tiền mặt">Tiền mặt</option>
            <option value="Chuyển khoản">Chuyển khoản</option>
          </select>
        </div>
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
