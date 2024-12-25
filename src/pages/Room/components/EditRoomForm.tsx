import React, { useState, useEffect } from "react";
import CustomModal from "@/components/Modal/Modal";
import { useForm } from "react-hook-form";
import { Building, Room } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import { ServiceInfo } from "@/types/types";
import { deleteImage, uploadImage } from "@/services/imageApi/imageApi";
import TextField from "@mui/material/TextField";
import { message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import type { RcFile } from "antd/es/upload/interface";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface EditRoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Room) => void;
  building: Building | null;
  room: Room | null;
}

const EditRoomForm: React.FC<EditRoomFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  building,
  room,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Room>({
    defaultValues: {
      roomservice: [],
    },
  });

  const [paidServiceList, setPaidServiceList] = useState<ServiceInfo[]>([]);
  const [selectedSubDetail, setSelectedSubDetail] = useState<number>(0);
  const [imageUrls, setImageUrls] = useState<string[]>(room?.imageUrls || []);
  const [utilities, setUtilities] = useState<string>(room?.utilities || "");
  const [describe, setDescribe] = useState<string>(room?.describe || "");
  const [note, setNote] = useState<string>(room?.note || "");
  const [interior, setInterior] = useState<string>(room?.interior || ""); // Mới: nội thất
  const [renter, setRenter] = useState<number>(room?.renter ?? 0);         // Mới: số người đang thuê
  const [customerId, setCustomerId] = useState<string>(room?.customerId || ""); 
  const [nameCustomer, setNameCustomer] = useState<string>(room?.nameCustomer || ""); 

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const subDetailsLabel = [
    { id: 0, label: "DỊCH VỤ" },
    { id: 1, label: "ẢNH PHÒNG" },
    { id: 2, label: "TIỆN ÍCH PHÒNG" },
    { id: 3, label: "MÔ TẢ" },
    { id: 4, label: "LƯU Ý" },
    { id: 5, label: "NỘI THẤT" }, // Thêm tab cho nội thất, tuỳ ý
  ];

  useEffect(() => {
    if (isOpen) {
      reset(room || {}); // Reset form khi mở modal
      if (room) {
        setPaidServiceList(room.roomservice || []);
        setImageUrls(room.imageUrls || []);
        setUtilities(room.utilities || "");
        setDescribe(room.describe || "");
        setNote(room.note || "");
        setInterior(room.interior || "");
        setRenter(room.renter ?? 0);
        setCustomerId(room.customerId || "");
        setNameCustomer(room.nameCustomer || "");
      }
    }
  }, [isOpen, room, reset]);

  // Lấy danh sách dịch vụ (nếu cần)
  useEffect(() => {
    getallService();
  }, []);

  // Xử lý submit form
  const handleFormSubmit = (data: Room) => {
    data.roomservice = paidServiceList;
    data.utilities = utilities;
    data.describe = describe;
    data.note = note;
    data.interior = interior;
    data.renter = renter;
    data.customerId = customerId;
    data.nameCustomer = nameCustomer;

    // Gán ID building
    data.building_Id = building?.id || "";
    // Gán danh sách ảnh
    data.imageUrls = imageUrls;

    onSubmit(data);
    onClose();
  };

  // Upload & Remove ảnh
  const handleRemove = (file: UploadFile) => {
    if (file.url) {
      deleteImage(file.url);
      setImageUrls((prevUrls) => prevUrls.filter((url) => url !== file.url));
    }
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
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

  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    try {
      const url = await uploadImage(file);
      setImageUrls((prev) => [...prev, url]);

      // Thêm vào fileList
      setFileList((prevFileList) => [
        ...prevFileList,
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: url,
        },
      ]);
      message.success("Upload thành công!");
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Upload thất bại!");
    }
  };

  // Xử lý chọn / bỏ chọn dịch vụ
  const handleServiceClick = (serviceId: string | null, serviceName: string | null) => {
    if (!serviceId) return;
    setPaidServiceList((prev) => {
      const serviceExists = prev.some((svc) => svc.serviceId === serviceId);
      return serviceExists
        ? prev.filter((svc) => svc.serviceId !== serviceId)
        : [...prev, { serviceId, serviceName }];
    });
  };

  // Lấy mảng dịch vụ từ store
  const allServices = useServiceStore.getState().services;

  // Chuẩn bị dữ liệu fileList ban đầu (nếu room có imageUrls)
  useEffect(() => {
    if (room?.imageUrls && room.imageUrls.length > 0) {
      const initialFileList: UploadFile[] = room.imageUrls.map((url, index) => ({
        uid: `-${index}`,
        name: `image${index + 1}.png`,
        status: "done",
        url: url,
      }));
      setFileList(initialFileList);
    }
  }, [room]);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} header="Sửa phòng">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 h-[70vh]"
      >
        {/* ------------ Thông tin cơ bản ------------- */}
        <div className="grid grid-cols-2 gap-4">
          {/* room_name */}
          <div>
            <label className="block text-gray-700">Tên phòng *</label>
            <input
              {...register("room_name", {
                required: "Vui lòng nhập tên phòng",
              })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Nhập tên phòng"
            />
            {errors.room_name && (
              <span className="text-red-500 text-sm">
                {errors.room_name.message}
              </span>
            )}
          </div>

          {/* floor */}
          <div>
            <label className="block text-gray-700">Tầng *</label>
            <input
              {...register("floor", { required: "Vui lòng nhập tầng" })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Nhập tầng"
            />
            {errors.floor && (
              <span className="text-red-500 text-sm">
                {errors.floor.message}
              </span>
            )}
          </div>
        </div>

        {/* ------------ Row 2: số phòng ngủ/khách ------------- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Số phòng ngủ *</label>
            <input
              {...register("number_of_bedrooms", {
                required: "Vui lòng nhập số phòng ngủ",
              })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Số phòng ngủ"
            />
            {errors.number_of_bedrooms && (
              <span className="text-red-500 text-sm">
                {errors.number_of_bedrooms.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Số phòng khách *</label>
            <input
              {...register("number_of_living_rooms", {
                required: "Vui lòng nhập số phòng khách",
              })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Số phòng khách"
            />
            {errors.number_of_living_rooms && (
              <span className="text-red-500 text-sm">
                {errors.number_of_living_rooms.message}
              </span>
            )}
          </div>
        </div>

        {/* ------------ Row 3: diện tích / giới hạn người ------------- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Diện tích (m2) *</label>
            <input
              {...register("acreage", {
                required: "Vui lòng nhập diện tích",
              })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Diện tích"
            />
            {errors.acreage && (
              <span className="text-red-500 text-sm">
                {errors.acreage.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Giới hạn số người thuê *</label>
            <input
              {...register("limited_occupancy", {
                required: "Vui lòng nhập giới hạn số người",
              })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Giới hạn số người"
            />
            {errors.limited_occupancy && (
              <span className="text-red-500 text-sm">
                {errors.limited_occupancy.message}
              </span>
            )}
          </div>
        </div>

        {/* ------------ Row 4: cọc / giá / status ------------- */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Tiền đặt cọc *</label>
            <input
              {...register("deposit", {
                required: "Vui lòng nhập tiền đặt cọc",
              })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Tiền đặt cọc"
            />
            {errors.deposit && (
              <span className="text-red-500 text-sm">
                {errors.deposit.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Giá phòng *</label>
            <input
              {...register("room_price", {
                required: "Vui lòng nhập giá phòng",
              })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="Giá phòng"
            />
            {errors.room_price && (
              <span className="text-red-500 text-sm">
                {errors.room_price.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Trạng thái *</label>
            <select
              {...register("status", { required: "Vui lòng chọn trạng thái" })}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
            >
              <option value="">Chọn trạng thái</option>
              <option value="1">Đang cho thuê</option>
              <option value="0">Trống</option>
            </select>
            {errors.status && (
              <span className="text-red-500 text-sm">
                {errors.status.message}
              </span>
            )}
          </div>
        </div>

        {/* ------------ Row 5: renter, customerId, nameCustomer ------------- */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Số người đang thuê</label>
            <input
              type="number"
              value={renter}
              onChange={(e) => setRenter(Number(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded-[8px]"
              placeholder="VD: 2"
            />
          </div>

        </div>

        {/* ========== Tabs chi tiết (Dịch vụ, Ảnh phòng, Tiện ích, Mô tả, Lưu ý, Nội thất) ========== */}
        <div className="w-full h-56 ">
          <div className="h-12 w-full flex flex-row">
            {subDetailsLabel.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setSelectedSubDetail(tab.id)}
                className={`h-10 px-4 flex justify-center items-center cursor-pointer ${
                  selectedSubDetail === tab.id
                    ? "border-b-2 border-themeColor text-themeColor"
                    : ""
                }`}
              >
                <span className="text-sm text-gray-700">{tab.label}</span>
              </div>
            ))}
          </div>

          {/* Tab 0: Dịch vụ */}
          {selectedSubDetail === 0 && (
            <div className="h-56 w-full flex flex-col">
              <div className="flex-1 w-full py-5 flex justify-start items-start">
                <div className="h-full w-full flex flex-row flex-wrap">
                  {allServices.map((service) => (
                    <div
                      key={service.id}
                      className="h-14 mr-2 px-2 w-36 flex flex-row border justify-center items-center border-gray-200 rounded-[8px] cursor-pointer"
                      onClick={() =>
                        handleServiceClick(service.id!, service.service_name)
                      }
                      style={{
                        borderColor: paidServiceList.some(
                          (s) => s.serviceId === service.id!
                        )
                          ? "#001eb4"
                          : "transparent",
                      }}
                    >
                      <div className="w-1/5">
                        <img
                          className="object-cover h-8 w-8"
                          src="https://as1.ftcdn.net/jpg/01/40/62/16/500_F_140621690_lCjpTdvOoqdovvUlh89F5FM1gODHMIdx.jpg"
                        />
                      </div>
                      <div className="w-4/5 flex flex-col pl-3">
                        <span className="text-gray-700 text-[13px] font-semibold">
                          {service.service_name}
                        </span>
                        <span className="text-gray-700 text-[13px] font-semibold">
                          {service.service_cost.toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Ảnh phòng */}
          {selectedSubDetail === 1 && (
            <div className="h-56 w-full flex flex-col">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={onPreview}
                customRequest={handleUpload}
                onRemove={handleRemove}
                onChange={onChange}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </div>
          )}

          {/* Tab 2: Tiện ích phòng */}
          {selectedSubDetail === 2 && (
            <div className="w-full pt-4">
              <TextField
                label="Tiện ích phòng"
                variant="outlined"
                value={utilities}
                onChange={(e) => setUtilities(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
              />
            </div>
          )}

          {/* Tab 3: Mô tả */}
          {selectedSubDetail === 3 && (
            <div className="w-full pt-4">
              <TextField
                label="Mô tả"
                variant="outlined"
                value={describe}
                onChange={(e) => setDescribe(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
              />
            </div>
          )}

          {/* Tab 4: Lưu ý */}
          {selectedSubDetail === 4 && (
            <div className="w-full pt-4">
              <TextField
                label="Lưu ý"
                variant="outlined"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
              />
            </div>
          )}

          {/* Tab 5: Nội thất */}
          {selectedSubDetail === 5 && (
            <div className="w-full pt-4">
              <TextField
                label="Nội thất"
                variant="outlined"
                value={interior}
                onChange={(e) => setInterior(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
              />
            </div>
          )}
        </div>

        {/* Nút action */}
        <div className="flex fixed bottom-[5%] right-[5%]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-[8px]"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-themeColor text-white rounded-[8px]"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default EditRoomForm;
