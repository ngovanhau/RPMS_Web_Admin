import React, { useState, useEffect } from "react";
import { Building, Contract } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ServiceInfo } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox is available for multi-selection
import Select, { MultiValue } from "react-select";
import { getroombystatus } from "@/services/tenantApi/tenant";
import { Room } from "@/types/types";
import { getCustomerNoRoom } from "@/services/contractApi/contractApi";
import useTenantStore from "@/stores/tenantStore";
import { deleteImage, uploadImage } from "@/services/imageApi/imageApi";
import Viewer from "react-viewer";
import { Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";

import {
  getAllBuildings,
  getBuildingByUserId,
  getRoomById,
} from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import useAuthStore from "@/stores/userStore";
import { getRoomsByBuildingIdAndStatus } from "@/services/bookingApi/bookingApi";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface CreateContractFormProps {
  onSubmit: (contract: Contract) => void;
}

const CreateContractForm: React.FC<CreateContractFormProps> = ({
  onSubmit,
}) => {
  const [contract, setContract] = useState<Partial<Contract>>({
    contract_name: "",
    rentalManagement: "",
    room: "",
    roomId: "",
    start_day: new Date(),
    end_day: new Date(),
    billing_start_date: new Date(),
    payment_term: 0,
    room_fee: 0,
    deposit: 0,
    customerId: "",
    service: "",
    clause: "",
    image: "",
    customerName: "",
  });

  const [listRoom, setListRoom] = useState<Room[]>([]);
  const [uploading, setUploading] = useState<boolean>(false); // Changed to single boolean
  const [visible, setVisible] = useState(false); // Trạng thái xem ảnh
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  // Access services from the store
  const services = useServiceStore.getState().services;
  const listCustomer = useTenantStore.getState().tenantsWithoutRoom;
  const buildingList = useBuildingStore.getState().buildings;
  const userInfo = useAuthStore.getState().userData;

  // const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);
  // };

  const onChange: UploadProps["onChange"] = async ({ file }) => {
    if (file.originFileObj && file.status === "uploading") {
      try {
        const imageUrl = await uploadImage(file.originFileObj); // Gọi API upload ảnh
        if (imageUrl) {
          const updatedFile: UploadFile = {
            ...file,
            url: imageUrl,
            status: "done", // Đánh dấu trạng thái là hoàn tất
          };

          // Cập nhật vào danh sách file để hiển thị
          setFileList([updatedFile]);

          // Lưu URL ảnh vào trạng thái contract
          setContract((prevState) => ({
            ...prevState,
            image: imageUrl,
          }));

          message.success("Ảnh đã tải lên thành công!");
        } else {
          throw new Error("Không nhận được URL ảnh từ API.");
        }
      } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        message.error("Tải ảnh thất bại. Vui lòng thử lại.");
        setFileList([]); // Reset fileList nếu lỗi
      }
    }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContract((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contract as Contract);
  };

  const handleRoomChange = async (selectedRoom: {
    value: string;
    label: string;
  }) => {
    const response = await getRoomById(selectedRoom.value);
    setContract((prevState) => ({
      ...prevState,
      room: selectedRoom.label,
      roomId: selectedRoom.value,
      room_fee: response?.data.data.room_price,
    }));
  };

  const handleCustomerChange = (selectedCustomer: {
    value: string;
    label: string;
  }) => {
    setContract((prevState) => ({
      ...prevState,
      customerId: selectedCustomer.value,
      customerName: selectedCustomer.label,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo) {
          userInfo.role === "ADMIN"
            ? (await getAllBuildings(), await getCustomerNoRoom())
            : (await getBuildingByUserId(userInfo.userId || ""), await getCustomerNoRoom());
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const response = await getRoomsByBuildingIdAndStatus(selectedBuilding?.id || "", 3)
      setListRoom(response)
    }
    getData()
  }, [selectedBuilding]);

  // Tạo danh sách tùy chọn cho phòng
  const roomOptions = listRoom.map((room) => ({
    value: room.id,
    label: room.room_name || "Phòng không tên",
  }));

  // Tạo danh sách tùy chọn cho khách hàng
  const customerOptions = listCustomer.map((customer) => ({
    value: customer.id || "",
    label: customer.customer_name,
  }));

  const buildingOptions = buildingList.map((building) => ({
    value: building.id,
    label: building.building_name,
  }));


  // Xóa ảnh
  const handleRemoveImage = async () => {
    if (contract.image) {
      await deleteImage(contract?.image);
      setContract((prevState) => ({
        ...prevState,
        image: "",
      }));
      setFileList([]); // Xóa file khỏi giao diện
    }
  };

  const handleCloseViewer = () => {
    setVisible(false); // Đóng viewer
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Tên Hợp Đồng
          </label>
          <input
            type="text"
            name="contract_name"
            value={contract.contract_name || ""}
            onChange={handleChange}
            className="border rounded-[6px] p-3 h-10 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tên hợp đồng"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Chọn tòa nhà
          </label>
          <Select
            options={buildingOptions}
            onChange={(selected) => {
              const fullBuilding = buildingList.find(
                (building) => building.id === selected?.value
              );
              if (fullBuilding) {
                setSelectedBuilding(fullBuilding);
              }
            }}
            className="rounded-[6px] w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Chọn tòa nhà"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Phòng
          </label>
          {
            listRoom.length > 0 ? 
            (
              <Select
              options={roomOptions}
              onChange={(selected) =>
                handleRoomChange(selected as { value: string; label: string })
              }
              className="h-10 rounded-[6px] w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Chọn phòng"
            />
            )
            :
            (
              <div className="border border-gray-300 px-2 flex items-center h-10 rounded-[6px]">
                <span>Không có phòng</span>
              </div>
            )
          }

        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Khách Hàng
          </label>
          <Select
            options={customerOptions}
            onChange={(selected) =>
              handleCustomerChange(selected as { value: string; label: string })
            }
            className="rounded-[6px] w-full  focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Chọn khách hàng"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Phí Phòng (VND)
          </label>
          <div className="w-full border  border-gray-200 h-12 justify-start p-2 items-center flex">
            <span>{contract.room_fee?.toLocaleString()} VNĐ</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Tiền Đặt Cọc (VND)
          </label>
          <input
            type="number"
            name="deposit"
            value={contract.deposit || ""}
            onChange={handleChange}
            className="border rounded-[6px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tiền đặt cọc"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Bắt Đầu
          </label>
          <input
            type="date"
            name="start_day"
            value={contract.start_day?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setContract({ ...contract, start_day: new Date(e.target.value) })
            }
            className="border rounded-[6px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Kết Thúc
          </label>
          <input
            type="date"
            name="end_day"
            value={contract.end_day?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setContract({ ...contract, end_day: new Date(e.target.value) })
            }
            className="border rounded-[6px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Bắt Đầu Thanh Toán
          </label>
          <input
            type="date"
            name="billing_start_date"
            value={
              contract.billing_start_date?.toISOString().split("T")[0] || ""
            }
            onChange={(e) =>
              setContract({
                ...contract,
                billing_start_date: new Date(e.target.value),
              })
            }
            className="border rounded-[6px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Kỳ Hạn Thanh Toán (tháng)
          </label>
          <input
            type="number"
            name="payment_term"
            value={contract.payment_term || ""}
            onChange={handleChange}
            className="border rounded-[6px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập kỳ hạn"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ảnh Hợp Đồng
          </label>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              onRemove={handleRemoveImage}
            >
              {fileList.length === 0 && "+ Upload"}{" "}
            </Upload>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          // onClick={onClose}
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
      {/* React Viewer - Hiển thị ảnh khi người dùng bấm vào ảnh */}
      {contract.image && (
        <Viewer
          visible={visible}
          onClose={handleCloseViewer}
          images={[{ src: contract.image, alt: "" }]}
          activeIndex={activeImageIndex}
        />
      )}
    </form>
  );
};

export default CreateContractForm;
