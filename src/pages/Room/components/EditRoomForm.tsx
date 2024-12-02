import React, { useState, useEffect } from "react";
import CustomModal from "@/components/Modal/Modal";
import { useForm } from "react-hook-form";
import { Building, Room } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import { ServiceInfo } from "@/types/types";
import { uploadImage } from "@/services/imageApi/imageApi";

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
  const [selectedSubDetail, setSelectedSubDetail] = useState<Number>(0);
  const [imageUrls, setImageUrls] = useState<string[]>(room?.imageUrls || []); // Để lưu các ảnh phòng

  const subDetailsLabel = [
    { id: 0, label: "DỊCH VỤ" },
    { id: 1, label: "ẢNH PHÒNG" },
    { id: 2, label: "TIỆN ÍCH PHÒNG" },
    { id: 3, label: "MÔ TẢ" },
    { id: 4, label: "LƯU Ý" },
  ];

  useEffect(() => {
    if (isOpen) {
      reset(room || {}); // Reset the form with existing room data if editing
      if (room) {
        setPaidServiceList(room.roomservice || []);
        setImageUrls(room.imageUrls || []); // Cập nhật lại mảng ảnh khi mở modal
      }
    }
  }, [isOpen, room, reset]);

  const handleFormSubmit = (data: Room) => {
    // Thay thế toàn bộ data.roomservice bằng paidServiceList
    data.roomservice = paidServiceList;

    // Gán ID của building vào data nếu có
    data.building_Id = building?.id || "";
    data.imageUrls = imageUrls;

    // Gọi hàm onSubmit để gửi dữ liệu đã cập nhật
    onSubmit(data);
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        // Chuyển các tệp được chọn thành một mảng URL
        const uploadedUrls = await Promise.all(
          Array.from(files).map((file) => uploadImage(file)) // Gọi hàm uploadImage cho từng file
        );

        // Cập nhật lại mảng ảnh với các URL mới
        setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  };

  useEffect(() => {
    getallService();
  }, []);

  const handleServiceClick = (
    serviceId: string | null,
    serviceName: string | null
  ) => {
    if (serviceId === null) return;

    setPaidServiceList((prevList) => {
      const serviceExists = prevList.some(
        (service) => service.serviceId === serviceId
      );
      if (serviceExists) {
        // Loại bỏ dịch vụ nếu đã có
        return prevList.filter((service) => service.serviceId !== serviceId);
      } else {
        // Thêm dịch vụ nếu chưa có
        return [...prevList, { serviceId, serviceName }];
      }
    });
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} header="Sửa phòng">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 h-[70vh]"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Tên phòng *</label>
            <input
              {...register("room_name", {
                required: "Vui lòng nhập tên phòng",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập tên phòng"
            />
            {errors.room_name && (
              <span className="text-red-500 text-sm">
                {errors.room_name.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Tầng *</label>
            <input
              {...register("floor", { required: "Vui lòng nhập tầng" })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập tầng"
            />
            {errors.floor && (
              <span className="text-red-500 text-sm">
                {errors.floor.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Số phòng ngủ *</label>
            <input
              {...register("number_of_bedrooms", {
                required: "Vui lòng nhập số phòng ngủ",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
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
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Số phòng khách"
            />
            {errors.number_of_living_rooms && (
              <span className="text-red-500 text-sm">
                {errors.number_of_living_rooms.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Diện tích (m2) *</label>
            <input
              {...register("acreage", { required: "Vui lòng nhập diện tích" })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Diện tích"
            />
            {errors.acreage && (
              <span className="text-red-500 text-sm">
                {errors.acreage.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">
              Giới hạn số người thuê *
            </label>
            <input
              {...register("limited_occupancy", {
                required: "Vui lòng nhập giới hạn số người",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Giới hạn số người"
            />
            {errors.limited_occupancy && (
              <span className="text-red-500 text-sm">
                {errors.limited_occupancy.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Tiền đặt cọc *</label>
            <input
              {...register("deposit", {
                required: "Vui lòng nhập tiền đặt cọc",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
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
              className="w-full border border-gray-300 p-2 rounded-lg"
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
              className="w-full border border-gray-300 p-2 rounded-lg"
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

          {selectedSubDetail === 0 && (
            <div className="h-56 w-full flex flex-col">
              <div className="flex-1 w-full py-5 flex justify-start items-start">
                <div className="h-full w-full flex flex-row flex-wrap">
                  {useServiceStore.getState().services.map((service) => (
                    <div
                      key={service.id}
                      className="h-14 mr-2 px-2 w-36 flex flex-row border justify-center items-center border-gray-200 rounded-[8px]"
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
                          {service?.service_name}
                        </span>
                        <span className="text-gray-700 text-[13px] font-semibold">
                          {service.service_cost}/{service.collect_fees}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Phần Ảnh Phòng */}
          {selectedSubDetail === 1 && (
            <div className="h-56 w-full flex flex-col">
              <div className="flex-1 w-full py-5 flex justify-start items-start">
                <div className="w-full flex flex-row flex-wrap">
                  {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                      <div key={index} className="h-24 w-24 mr-4 mb-4">
                        <img
                          className="object-cover h-full w-full rounded-lg"
                          src={url}
                          alt={`Room image ${index + 1}`}
                        />
                      </div>
                    ))
                  ) : (
                    <p>Chưa có ảnh phòng</p>
                  )}
                </div>
              </div>

              {/* Form upload ảnh */}
              <div className="w-full mt-4">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  multiple // Cho phép chọn nhiều ảnh
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex fixed bottom-[5%] right-[5%]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-themeColor text-white rounded-lg"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default EditRoomForm;
