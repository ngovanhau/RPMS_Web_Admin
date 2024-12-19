import React, { useEffect, useState } from "react";
import { Contract, Transaction } from "@/types/types";
import { getAllTransactionGroup } from "@/services/transactiongroupApi/transactiongroupApi";
import useTransactionGroupStore from "@/stores/transactiongroupStore";
import {
  getAllContract,
  getContractByBuildingId,
} from "@/services/contractApi/contractApi";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Viewer from "react-viewer";
import { uploadImage, deleteImage } from "@/services/imageApi/imageApi";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { Building, Room } from "@/types/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuildingStore } from "@/stores/buildingStore";
import { getRoomByBuildingId } from "@/services/buildingApi/buildingApi";
import useContractStore from "@/stores/contractStore";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";

interface NewTransactionFormProps {
  onSubmit: (transaction: Partial<Transaction>) => void;
  onCancel: () => void;
}

const NewTransactionForm: React.FC<NewTransactionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  // Initialize contractid and contractname as empty strings
  const [formData, setFormData] = useState<Partial<Transaction>>({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    buildingid: "",
    roomid: "",
    customerid: "",
    namereason: "",
    transactiongroupid: "",
    paymentmethod: "",
    date: "",
    note: "",
    amount: 0,
    image: "",
  });
  const buildingList = useBuildingStore((state) => state.buildings);
  const roomList = useBuildingStore((state) => state.roomList);
  const contractList = useContractStore((state) => state.contracts);
  const transactionGroupList = useTransactionGroupStore(
    (state) => state.transactionGroups
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to store the file
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Loading state
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // For image preview
  const [nameCustomer, setNameCustomer] = useState<string>("");

  console.log(contractList);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await getAllTransactionGroup();
      await getAllContract();
    } catch (error) {
      message.error("Failed to fetch initial data.");
      console.error(error);
    }
  };

  const handleBuildingSelect = async (value: string) => {
    setFormData((prev) => ({ ...prev, buildingid: value }));
    await getRoomByBuildingId(value);
    await getContractByBuildingId(value);
  };

  const handleRoomSelect = async (value: string) => {
    setFormData((prev) => ({ ...prev, roomid: value }));
    const contract = contractList.find((item) => item.roomId === value);
    if (contract) {
      setFormData((prev) => ({ ...prev, customerid: contract.customerId }));
      if (contract.customerName) {
        setNameCustomer(contract.customerName);
      } else {
        setNameCustomer("");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (info: UploadChangeParam) => {
    const fileList = info.fileList;
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj as RcFile;
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({
            ...prev,
            image: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSelectedFile(null);
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure imageUrl is always a string
      let imageUrl: string = formData.image || "";

      // If a file is selected, upload it
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
        setFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
      }

      // Prepare the final form data
      const finalFormData: Partial<Transaction> = {
        ...formData,
        image: imageUrl, // image is always a string
      };

      // Submit the form data
      onSubmit(finalFormData);
      message.success("Transaction submitted successfully!");
    } catch (error) {
      message.error("Failed to submit transaction.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 overflow-hidden">
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Tòa nhà</span>
          <Select onValueChange={handleBuildingSelect}>
            <SelectTrigger className="w-full border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Tòa nhà" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {buildingList.map((building) => (
                <SelectItem key={building.id} value={building.id}>
                  {building.building_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Phòng</span>
          <Select onValueChange={handleRoomSelect}>
            <SelectTrigger className="w-full border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Phòng" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {roomList.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.room_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Tên khách hàng</span>
          <Input
            value={nameCustomer}
            onChange={(e) => setNameCustomer(e.target.value)}
            className="border-gray-300 rounded-[8px]"
            placeholder="Tên khách hàng"
          />{" "}
        </div>
      </div>
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span className="">Tên giao dịch</span>
          <Input
            value={formData.namereason}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                namereason: e.target.value,
              }))
            }
            className="border-gray-300 rounded-[8px]"
            placeholder="Tên giao dịch"
          />{" "}
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span>Nhóm giao dịch</span>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                transactiongroupid: value,
              }))
            }
          >
            <SelectTrigger className="border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Nhóm giao dịch" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {transactionGroupList.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span>Phương thức thanh toán</span>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                paymentmethod: value,
              }))
            }
          >
            <SelectTrigger className="border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Phương thức thanh toán" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
              <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span>Ngày thanh toán</span>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-[8px] text-left flex flex-row justify-between">
                {formData.date
                  ? new Date(formData.date).toLocaleDateString("vi-VN")
                  : "Chọn ngày"}
                <CalendarDays className="text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 bg-white rounded-md shadow-md">
              <Calendar
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    date: date ? date.toISOString() : "",
                  }))
                }
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span>Số tiền</span>
          <div className="relative">
            <input
              placeholder="Số tiền"
              type="number"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-[8px] p-2 pr-10"
            />
            <span className="absolute inset-y-0 right-2 flex items-center text-gray-500">
              VNĐ
            </span>
          </div>
        </div>

        <div className="flex flex-col w-[30%] gap-2"></div>
      </div>
      <div className="flex flex-col w-full gap-2">
        <span>Ghi chú</span>
        <textarea
          placeholder="Nhập ghi chú"
          className="border border-gray-300 rounded-[8px] p-2"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              note: e.target.value, 
            }))
          }
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-themeColor text-white rounded hover:bg-themeColor-dark ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
};

export default NewTransactionForm;
