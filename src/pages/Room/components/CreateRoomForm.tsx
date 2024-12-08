import React, { useState, useEffect } from "react";
import CustomModal from "@/components/Modal/Modal";
import { useForm } from "react-hook-form";
import { Building, Room } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import { uploadImage } from "@/services/imageApi/imageApi";
import { Upload, message, Spin } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useBuildingStore } from "@/stores/buildingStore";
import Select, { SingleValue } from "react-select";

interface CreateRoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Room) => void;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
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
  } = useForm<Room>({
    defaultValues: {
      roomservice: [],
    },
  });

  const [paidServiceList, setPaidServiceList] = useState<
    { serviceId: string; serviceName: string | null }[]
  >([]);
  const [selectedSubDetail, setSelectedSubDetail] = useState<number>(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false); // State for upload status
  const buildingList = useBuildingStore((state) => state.buildings);

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
      setFileList([]);
      setImageUrls([]);
      setPaidServiceList([]);
      setSelectedSubDetail(0);
    }
  }, [isOpen, reset]);

  const buildingOptions = buildingList.map((building) => ({
    value: building.id,
    label: building.building_name,
  }));

  const handleBuildingChange = (
    selectedOption: SingleValue<{ value: string; label: string }> | null
  ) => {
    if (selectedOption) {
      setValue("building_Id", selectedOption.value);
    } else {
      setValue("building_Id", undefined);
    }
  };

  // Function to handle image uploads
  const handleUpload = async (file: UploadFile) => {
    try {
      setUploading(true);
      const url = await uploadImage(file.originFileObj as File);
      setImageUrls((prevUrls) => [...prevUrls, url]);
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      message.error(`${file.name} upload failed`);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    listType: "picture-card",
    fileList: fileList,
    onChange: async ({ file, fileList: newFileList }) => {
      setFileList(newFileList);

      // Only handle newly added files that are not already uploaded
      const newFiles = newFileList.filter(
        (f) => f.status === "uploading" && !f.url && !f.thumbUrl
      );

      for (const file of newFiles) {
        if (file.originFileObj) {
          await handleUpload(file);
          // Update the file status to done
          setFileList((prevList) =>
            prevList.map((f) =>
              f.uid === file.uid ? { ...f, status: "done" } : f
            )
          );
        }
      }
    },
    onPreview: async (file) => {
      let src = file.url as string;
      if (!src && file.originFileObj) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as File);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} không phải là ảnh`);
      }
      return isImage || Upload.LIST_IGNORE;
    },
    // Disable automatic upload
    customRequest: ({ onSuccess }) => {
      // Simulate a successful upload immediately
      setTimeout(() => {
        onSuccess && onSuccess("ok");
      }, 0);
    },
  };

  const handleFormSubmit = (data: Room) => {
    // Assign the uploaded image URLs
    data.imageUrls = imageUrls;

    // Assign the selected services
    const roomServices = paidServiceList.map((service) => ({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
    }));
    data.roomservice = roomServices;

    // Call the onSubmit prop with the form data
    onSubmit(data);
    onClose();
  };

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

  useEffect(() => {
    getallService();
  }, []);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} header="Thêm phòng">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Tòa nhà */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="block text-gray-700">Tòa nhà *</label>
            <Select
              options={buildingOptions}
              onChange={handleBuildingChange}
              className="w-full"
              placeholder="Chọn tòa nhà"
            />
            {errors.building_Id && (
              <span className="text-red-500 text-sm">
                {errors.building_Id.message}
              </span>
            )}
          </div>
        </div>

        {/* Tên phòng và Tầng */}
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

        {/* Số phòng ngủ và Số phòng khách */}
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

        {/* Diện tích và Giới hạn số người */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Diện tích (m²) *</label>
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

        {/* Tiền đặt cọc, Giá phòng và Trạng thái */}
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

        {/* Sub Details Tabs */}
        <div className="w-full h-56">
          {/* Tab Headers */}
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

          {/* Tab Content */}
          {selectedSubDetail === 0 && (
            <div className="h-56 w-full flex flex-col">
              <div className="flex-1 w-full py-5 flex justify-start items-start">
                <div className="h-full w-full flex flex-row flex-wrap">
                  {useServiceStore.getState().services.map((service) => (
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
                          alt={service.service_name}
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

          {selectedSubDetail === 1 && (
            <div className="py-4">
              <label className="block text-gray-700 mb-2">Chọn ảnh phòng *</label>
              <ImgCrop >
                <Upload {...uploadProps} multiple accept="image/*">
                  {fileList.length < 5 && "+ Upload"}
                </Upload>
              </ImgCrop>
              {/* Display loading spinner during upload */}
              {uploading && (
                <div className="mt-2 flex justify-center">
                  <Spin />
                </div>
              )}
              {/* Display error if any (optional) */}
              {errors.imageUrls && (
                <span className="text-red-500 text-sm">
                  {errors.imageUrls.message}
                </span>
              )}
            </div>
          )}

          {selectedSubDetail === 2 && (
            <div className="py-4">
              <label className="block text-gray-700 mb-2">Tiện ích phòng</label>
              <textarea
                {...register("utilities")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập tiện ích phòng"
              />
            </div>
          )}
          {selectedSubDetail === 3 && (
            <div className="py-4">
              <label className="block text-gray-700 mb-2">Mô tả phòng</label>
              <textarea
                {...register("describe")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập mô tả phòng"
              />
            </div>
          )}
          {selectedSubDetail === 4 && (
            <div className="py-4">
              <label className="block text-gray-700 mb-2">Lưu ý cho người thuê</label>
              <textarea
                {...register("note")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập lưu ý cho người thuê"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
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
            className="px-4 py-2 bg-themeColor text-white rounded-lg"
            disabled={uploading} // Disable submit while uploading
          >
            Thêm phòng
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateRoomForm;
