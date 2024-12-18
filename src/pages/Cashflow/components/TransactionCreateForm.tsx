import React, { useEffect, useState } from "react";
import { Contract, Transaction } from "@/types/types";
import { getAllTransactionGroup } from "@/services/transactiongroupApi/transactiongroupApi";
import useTransactionGroupStore from "@/stores/transactiongroupStore";
import { getAllContract } from "@/services/contractApi/contractApi";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Viewer from "react-viewer";
import { uploadImage, deleteImage } from "@/services/imageApi/imageApi";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { Building, Room } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuildingStore } from "@/stores/buildingStore";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to store the file
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Loading state
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // For image preview

  console.log(formData.buildingid)

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
    <form onSubmit={handleSubmit} className="space-y-4 overflow-hidden">
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-1/3 gap-2">
          <span className="">Tòa nhà</span>
          <Select onValueChange={(value) => setFormData((prev) => ({...prev, buildingid: value}))}>
            <SelectTrigger className="w-full border-gray-300 rounded-[8px]">
              <SelectValue placeholder="Theme" />
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
