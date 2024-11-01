import React, { useState, useEffect } from "react";
import CustomModal from "@/components/Modal/Modal";
import { useForm } from "react-hook-form";
import { Building, Room } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";

interface CreateRoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Room) => void;
  building: Building | null;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  building,
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

  const [paidServiceList, setPaidServiceList] = useState<
    { serviceId: string; serviceName: string | null }[]
  >([]);
  const [selectedSubDetail, setSelectedSubDetail] = useState<Number>(0);
  const subDetailsLabel = [
    { id: 0, label: "DỊCH VỤ" },
    { id: 1, label: "ẢNH PHÒNG" },
    { id: 2, label: "TIỆN ÍCH PHÒNG" },
    { id: 3, label: "MÔ TẢ" },
    { id: 4, label: "LƯU Ý" },
  ];

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: Room) => {
    // Đẩy danh sách dịch vụ vào trường roomservice
    const roomServices = paidServiceList.map((service) => ({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
    }));
    data.roomservice = roomServices;

    // Cập nhật building_Id nếu có building được truyền vào
    data.building_Id = building?.id || "";

    // Gọi hàm onSubmit với dữ liệu đã cập nhật
    onSubmit(data);
    onClose();
  };

  useEffect(() => {
    getallService();
  }, []);

  const handleServiceClick = (
    serviceId: string,
    serviceName: string | null
  ) => {
    setPaidServiceList((prevList) =>
      prevList.some((service) => service.serviceId === serviceId)
        ? prevList.filter((service) => service.serviceId !== serviceId)
        : [...prevList, { serviceId, serviceName }]
    );
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} header="Thêm phòng">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                    ? "border-b-2 border-green-400 text-green-500"
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
                          ? "#4ade80"
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
          {selectedSubDetail === 2 && (
            <div className="py-4">
              <textarea
                {...register("utilities")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập tiện ích phòng"
              />
            </div>
          )}
          {selectedSubDetail === 3 && (
            <div className="py-4">
              <textarea
                {...register("describe")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập mô tả phòng"
              />
            </div>
          )}
          {selectedSubDetail === 4 && (
            <div className="py-4">
              <textarea
                {...register("note")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập lưu ý cho người thuê"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Thêm phòng
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateRoomForm;