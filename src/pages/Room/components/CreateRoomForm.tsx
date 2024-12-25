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

/** 
 * Props nhận từ component cha:
 * - isOpen: boolean => xác định modal mở/đóng
 * - onClose: () => void => callback đóng modal
 * - onSubmit: (data: Room) => void => callback submit form
 */
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

  // --------------------------------------------------------------------------------
  // 1) Tạo local state để lưu chuỗi đã "format" (cho các trường numeric)
  // --------------------------------------------------------------------------------
  const [formattedValues, setFormattedValues] = useState<Record<string, string>>(
    {}
  );

  /**
   * handleNumberInputChange:
   *  - Loại bỏ ký tự không phải số
   *  - Chuyển sang number
   *  - Format bằng toLocaleString("vi-VN")
   *  - Lưu vào RHF bằng setValue (dạng "raw" - không chứa dấu .)
   *  - Lưu vào state `formattedValues[fieldName]` (dạng "1.000" ...)
   */
  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof Room
  ) => {
    const raw = e.target.value.replace(/\D/g, ""); // chỉ giữ chữ số
    const num = parseInt(raw, 10) || 0;
    const formatted = num.toLocaleString("vi-VN");

    // Lưu vào react-hook-form (dưới dạng chuỗi số "1000", "3000000" ...)
    // => khi Submit, ta sẽ parse lại sang number nếu cần.
    setValue(fieldName, raw as any, { shouldValidate: true });

    // Lưu vào local state -> để hiển thị
    setFormattedValues((prev) => ({ ...prev, [fieldName]: formatted }));
  };

  // Danh sách dịch vụ phòng (service)
  const [paidServiceList, setPaidServiceList] = useState<
    { serviceId: string; serviceName: string | null }[]
  >([]);

  // Tab hiện tại trong Sub Details
  const [selectedSubDetail, setSelectedSubDetail] = useState<number>(0);

  // Quản lý upload ảnh
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // Lấy danh sách Building từ store
  const buildingList = useBuildingStore((state) => state.buildings);
  // Tạo option cho react-select
  const buildingOptions = buildingList.map((building) => ({
    value: building.id,
    label: building.building_name,
  }));

  // Danh sách Tab hiển thị
  const subDetailsLabel = [
    { id: 0, label: "DỊCH VỤ (TÙY CHỌN)" },
    { id: 1, label: "ẢNH PHÒNG" },
    { id: 2, label: "TIỆN ÍCH PHÒNG (TÙY CHỌN)" },
    { id: 3, label: "MÔ TẢ PHÒNG (TÙY CHỌN)" },
    { id: 4, label: "LƯU Ý/QUY ĐỊNH (TÙY CHỌN)" },
  ];

  // Mở modal => reset form
  useEffect(() => {
    if (isOpen) {
      reset(); // xóa hết dữ liệu
      setFileList([]); 
      setImageUrls([]);
      setPaidServiceList([]);
      setSelectedSubDetail(0);
      // Đồng thời reset formattedValues
      setFormattedValues({});
    }
  }, [isOpen, reset]);

  // Lấy tất cả dịch vụ khi mount
  useEffect(() => {
    getallService();
  }, []);

  // Xử lý chọn Tòa nhà (react-select)
  const handleBuildingChange = (
    selectedOption: SingleValue<{ value: string; label: string }> | null
  ) => {
    if (selectedOption) {
      // Gán building_Id vào form
      setValue("building_Id", selectedOption.value);
    } else {
      setValue("building_Id", undefined);
    }
  };

  // Upload ảnh
  const handleUpload = async (file: UploadFile) => {
    try {
      setUploading(true);
      // Gọi API upload
      const url = await uploadImage(file.originFileObj as File);
      // Thêm vào imageUrls
      setImageUrls((prevUrls) => [...prevUrls, url]);
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      message.error(`${file.name} upload failed`);
    } finally {
      setUploading(false);
    }
  };

  // Cấu hình Upload của antd
  const uploadProps: UploadProps = {
    listType: "picture-card",
    fileList: fileList,
    // Mỗi lần fileList thay đổi => onChange
    onChange: async ({ file, fileList: newFileList }) => {
      setFileList(newFileList);

      // Lọc ra file mới => status=uploading, chưa có url
      const newFiles = newFileList.filter(
        (f) => f.status === "uploading" && !f.url && !f.thumbUrl
      );
      for (const file of newFiles) {
        if (file.originFileObj) {
          await handleUpload(file);
          // Đánh dấu file đã xong
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
    // Kiểm tra file có phải ảnh
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} không phải là ảnh`);
      }
      // Nếu không phải ảnh => ignore
      return isImage || Upload.LIST_IGNORE;
    },
    // Tắt auto upload => ta sẽ handle custom
    customRequest: ({ onSuccess }) => {
      // Giả lập "thành công" ngay
      onSuccess && onSuccess("ok");
    },
  };

  // Khi user chọn dịch vụ => gán/tháo trong paidServiceList
  const handleServiceClick = (serviceId: string, serviceName: string | null) => {
    setPaidServiceList((prevList) =>
      prevList.some((service) => service.serviceId === serviceId)
        ? prevList.filter((service) => service.serviceId !== serviceId)
        : [...prevList, { serviceId, serviceName }]
    );
  };

  // Submit form
  const handleFormSubmit = (data: Room) => {
    // Gán list ảnh
    data.imageUrls = imageUrls;

    // Gán danh sách dịch vụ
    data.roomservice = paidServiceList.map((svc) => ({
      serviceId: svc.serviceId,
      serviceName: svc.serviceName,
    }));

    /**
     * Do trong handleNumberInputChange ta chỉ setValue(...) dưới dạng chuỗi "raw" (không có chấm),
     * => Lúc Submit, tùy nhu cầu mà ta parse lại sang number.
     *  (VÍ DỤ parse: data.floor = parseInt(data.floor as unknown as string, 10) )
     *  => Ở đây, mình minh họa parse 1 vài trường. 
     */
    data.floor = parseInt(data.floor as unknown as string, 10) || 0;
    data.number_of_bedrooms =
      parseInt(data.number_of_bedrooms as unknown as string, 10) || 0;
    data.number_of_living_rooms =
      parseInt(data.number_of_living_rooms as unknown as string, 10) || 0;
    data.acreage = parseInt(data.acreage as unknown as string, 10) || 0;
    data.limited_occupancy =
      parseInt(data.limited_occupancy as unknown as string, 10) || 0;
    data.deposit = parseInt(data.deposit as unknown as string, 10) || 0;
    data.room_price = parseInt(data.room_price as unknown as string, 10) || 0;

    // Gửi lên props
    onSubmit(data);
    onClose();
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} header="Thêm phòng">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* ------------ Chọn Tòa nhà ------------ */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="block text-gray-700 font-semibold">
              Tòa nhà *
            </label>
            <Select
              options={buildingOptions}
              onChange={handleBuildingChange}
              className="w-full"
              placeholder="Chọn tòa nhà"
              isSearchable
            />
            {errors.building_Id && (
              <span className="text-red-500 text-sm">
                {errors.building_Id.message}
              </span>
            )}
          </div>
        </div>

        {/* ------------ Row: Tên phòng + Tầng ------------ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Tên phòng *
            </label>
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
            <label className="block text-gray-700 font-semibold">Tầng *</label>
            {/* Input floor => format */}
            <input
              value={formattedValues["floor"] ?? ""}
              onChange={(e) => handleNumberInputChange(e, "floor")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="Nhập tầng"
            />
            {errors.floor && (
              <span className="text-red-500 text-sm">{errors.floor.message}</span>
            )}
          </div>
        </div>

        {/* ------------ Row: Số phòng ngủ + phòng khách ------------ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Số phòng ngủ *
            </label>
            <input
              value={formattedValues["number_of_bedrooms"] ?? ""}
              onChange={(e) => handleNumberInputChange(e, "number_of_bedrooms")}
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
            <label className="block text-gray-700 font-semibold">
              Số phòng khách *
            </label>
            <input
              value={formattedValues["number_of_living_rooms"] ?? ""}
              onChange={(e) =>
                handleNumberInputChange(e, "number_of_living_rooms")
              }
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

        {/* ------------ Row: Diện tích + Giới hạn người ------------ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Diện tích (m²) *
            </label>
            <input
              value={formattedValues["acreage"] ?? ""}
              onChange={(e) => handleNumberInputChange(e, "acreage")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="VD: 30"
            />
            {errors.acreage && (
              <span className="text-red-500 text-sm">
                {errors.acreage.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Giới hạn số người thuê *
            </label>
            <input
              value={formattedValues["limited_occupancy"] ?? ""}
              onChange={(e) => handleNumberInputChange(e, "limited_occupancy")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="VD: 4"
            />
            {errors.limited_occupancy && (
              <span className="text-red-500 text-sm">
                {errors.limited_occupancy.message}
              </span>
            )}
          </div>
        </div>

        {/* ------------ Row: Đặt cọc + Giá phòng + Status ------------ */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">
              Tiền đặt cọc *
            </label>
            <input
              value={formattedValues["deposit"] ?? ""}
              onChange={(e) => handleNumberInputChange(e, "deposit")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="VD: 1000000"
            />
            {errors.deposit && (
              <span className="text-red-500 text-sm">
                {errors.deposit.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Giá phòng *
            </label>
            <input
              value={formattedValues["room_price"] ?? ""}
              onChange={(e) => handleNumberInputChange(e, "room_price")}
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholder="VD: 3000000"
            />
            {errors.room_price && (
              <span className="text-red-500 text-sm">
                {errors.room_price.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Trạng thái *
            </label>
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

        {/* ------------ SubDetails Tabs ------------ */}
        <div className="w-full h-56">
          {/* Tabs Header */}
          <div className="h-12 w-full flex flex-row border-b border-gray-200">
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

          {/* Tab 0: Chọn dịch vụ (tùy chọn) */}
          {selectedSubDetail === 0 && (
            <div className="h-56 w-full overflow-auto py-2 mt-4">
              <div className="flex flex-row flex-wrap">
                {useServiceStore.getState().services.map((service) => (
                  <div
                    key={service.id}
                    className="h-14 mr-2 px-2 w-36 flex flex-row border justify-center items-center border-gray-200 rounded-[8px] cursor-pointer mb-2"
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
                        {service.service_cost.toLocaleString()} đ/{service.unitMeasure}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1: Ảnh phòng */}
          {selectedSubDetail === 1 && (
            <div className="py-4 h-56 overflow-auto">
              <label className="block text-gray-700 mb-2 font-semibold">
                Ảnh phòng *
              </label>
              <ImgCrop>
                <Upload {...uploadProps} multiple accept="image/*">
                  {fileList.length < 5 && "+ Upload"}
                </Upload>
              </ImgCrop>
              {/* Loader */}
              {uploading && (
                <div className="mt-2 flex justify-center">
                  <Spin />
                </div>
              )}
              {/* Error ảnh (nếu cần) */}
              {errors.imageUrls && (
                <span className="text-red-500 text-sm">
                  {errors.imageUrls.message}
                </span>
              )}
            </div>
          )}

          {/* Tab 2: Tiện ích phòng (utilities) */}
          {selectedSubDetail === 2 && (
            <div className="py-4 h-56">
              <label className="block text-gray-700 mb-2 font-semibold">
                Tiện ích phòng
              </label>
              <textarea
                {...register("utilities")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập tiện ích phòng (nếu có)"
              />
            </div>
          )}

          {/* Tab 3: Mô tả phòng (describe) */}
          {selectedSubDetail === 3 && (
            <div className="py-4 h-56">
              <label className="block text-gray-700 mb-2 font-semibold">
                Mô tả phòng
              </label>
              <textarea
                {...register("describe")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập mô tả (nếu có)"
              />
            </div>
          )}

          {/* Tab 4: Lưu ý (note) */}
          {selectedSubDetail === 4 && (
            <div className="py-4 h-56">
              <label className="block text-gray-700 mb-2 font-semibold">
                Lưu ý/Quy định
              </label>
              <textarea
                {...register("note")}
                className="w-full border h-36 border-gray-300 p-2 rounded-lg"
                placeholder="Nhập lưu ý/quy định (nếu có)"
              />
            </div>
          )}
        </div>

        {/* ------------ Action Buttons ------------ */}
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
            disabled={uploading}
          >
            Thêm phòng
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateRoomForm;
