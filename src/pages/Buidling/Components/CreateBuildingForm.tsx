import React, { useState, useEffect } from "react";
import CustomModal from "@/components/Modal/Modal";
import { useForm } from "react-hook-form";
import { Building, Service } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
interface CreateBuildingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Building) => void;
}

const CreateBuildingForm: React.FC<CreateBuildingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Building>({
    defaultValues: {
    },
  });
  const serviceList = useServiceStore((state) => state.services);
  const [paidServiceList, setPaidServiceList] = useState<
    { serviceId: string; serviceName: string | null }[]
  >([]);
  const [subDetails, setSubDetails] = useState<number>(0);
  const subDetailsLabel = [
    { id: 0, label: "DỊCH VỤ CÓ PHÍ" },
    { id: 1, label: "DỊCH VỤ MIỄN PHÍ" },
    { id: 2, label: "TIỆN ÍCH TÒA NHÀ" },
    { id: 3, label: "MÔ TẢ" },
    { id: 4, label: "LƯU Ý TÒA NHÀ" },
  ];

  React.useEffect(() => {
    if (isOpen) {
      reset(); // Reset form when the modal opens
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: Building) => {
    data.fee_based_service = paidServiceList;
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
    <CustomModal
      className="bg-red-400"
      isOpen={isOpen}
      onClose={onClose}
      header="Tạo mới tòa nhà"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Tên tòa nhà *</label>
            <input
              {...register("building_name", {
                required: "Vui lòng nhập tên tòa nhà",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập tên tòa nhà"
            />
            {errors.building_name && (
              <span className="text-red-500 text-sm">
                {errors.building_name.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Số tầng *</label>
            <input
              {...register("number_of_floors", {
                required: "Vui lòng nhập số tầng",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập số tầng"
            />
            {errors.number_of_floors && (
              <span className="text-red-500 text-sm">
                {errors.number_of_floors.message}
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Địa chỉ *</label>
          <input
            {...register("address", { required: "Vui lòng nhập địa chỉ" })}
            className="w-full border border-gray-300 p-2 rounded-lg"
            placeholder="Nhập địa chỉ"
          />
          {errors.address && (
            <span className="text-red-500 text-sm">
              {errors.address.message}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Thành phố *</label>
            <input
              {...register("city", { required: "Vui lòng nhập tên thành phố" })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập tên thành phố"
            />
            {errors.city && (
              <span className="text-red-500 text-sm">
                {errors.city.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Quận/Huyện *</label>
            <input
              {...register("district", {
                required: "Vui lòng nhập tên quận/huyện",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập tên quận/huyện"
            />
            {errors.district && (
              <span className="text-red-500 text-sm">
                {errors.district.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Ngày chốt tiền *</label>
            <input
              type="number"
              {...register("payment_date", {
                required: "Vui lòng nhập ngày chốt tiền",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập ngày chốt tiền"
            />
            {errors.payment_date && (
              <span className="text-red-500 text-sm">
                {errors.payment_date.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">
              Thông báo chuyển trước *
            </label>
            <input
              type="number"
              {...register("advance_notice", {
                required: "Vui lòng nhập số ngày thông báo",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập số ngày thông báo chuyển trước"
            />
            {errors.advance_notice && (
              <span className="text-red-500 text-sm">
                {errors.advance_notice.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">
              Ngày bắt đầu nộp tiền *
            </label>
            <input
              type="number"
              {...register("payment_time", {
                required: "Vui lòng nhập ngày bắt đầu nộp tiền",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập ngày bắt đầu nộp tiền"
            />
            {errors.payment_time && (
              <span className="text-red-500 text-sm">
                {errors.payment_time.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700">
              Ngày kết thúc nộp tiền *
            </label>
            <input
              type="number"
              {...register("payment_timeout", {
                required: "Vui lòng nhập ngày kết thúc nộp tiền",
              })}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập ngày kết thúc nộp tiền"
            />
            {errors.payment_timeout && (
              <span className="text-red-500 text-sm">
                {errors.payment_timeout.message}
              </span>
            )}
          </div>
        </div>
        <div className="h-56 w-full flex flex-col">
          <div className="h-12 w-full flex flex-row">
            {subDetailsLabel.map((item) => (
              <div
                key={item.id}
                onClick={() => setSubDetails(item.id)}
                className={`h-full px-5 flex justify-center items-center font-semibold text-sm cursor-pointer ${
                  subDetails === item.id
                    ? "text-green-500 border-b-2 border-green-500"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex-1 w-full py-5 flex justify-start items-start">
            {subDetails === 0 && (
              <div className="h-56 w-full flex flex-col">
                <div className="flex-1 w-full py-5 flex justify-start items-start">
                  <div className="h-full w-full flex flex-row flex-wrap">
                    {serviceList.map((service) => (
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
            {subDetails === 1 && (
              <textarea
                {...register("free_service")}
                placeholder="Nhập dịch vụ miễn phí"
                className="h-full w-full shadow-xl align-text-top text-sm outline-none p-2 rounded-xl border resize-none"
              />
            )}
            {subDetails === 2 && (
              <textarea
                {...register("utilities")}
                placeholder="Nhập tiện ích tòa nhà"
                className="h-full w-full shadow-xl align-text-top text-sm outline-none p-2 rounded-xl border resize-none"
              />
            )}
            {subDetails === 3 && (
              <textarea
                {...register("description")}
                placeholder="Nhập mô tả"
                className="h-full w-full shadow-xl align-text-top text-sm outline-none p-2 rounded-xl border resize-none"
              />
            )}
            {subDetails === 4 && (
              <textarea
                {...register("building_note")}
                placeholder="Nhập lưu ý"
                className="h-full w-full shadow-xl align-text-top text-sm outline-none p-2 rounded-xl border resize-none"
              />
            )}
          </div>
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
            Tạo mới tòa nhà
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateBuildingForm;
