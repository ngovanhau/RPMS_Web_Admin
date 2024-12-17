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

interface NewTransactionFormProps {
  onSubmit: (transaction: Partial<Transaction>) => void;
  onCancel: () => void;
  contractList: Contract[]; // Contract list passed as a prop
}

const NewTransactionForm: React.FC<NewTransactionFormProps> = ({
  onSubmit,
  onCancel,
  contractList,
}) => {
  // Initialize contractid and contractname as empty strings
  const [formData, setFormData] = useState<Partial<Transaction>>({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    date: "",
    amount: 0,
    transactiongroupid: "",
    transactiongroupname: "",
    paymentmethod: "",
    contractid: "", // Changed from default UUID to empty string
    contractname: "", // Ensure this is also empty
    note: "",
    image: "", // Initialize as empty string
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to store the file
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Loading state
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // For image preview

  const transactionGroupList = useTransactionGroupStore(
    (state) => state.transactionGroups
  );

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
        contractid: formData.contractid ? formData.contractid : undefined, // Set to undefined if empty
        contractname: formData.contractname ? formData.contractname : undefined, // Set to undefined if empty
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
      {/* Date Field */}
      <div>
        <label className="block font-medium text-gray-700">
          Ngày giao dịch
        </label>
        <input
          type="date"
          name="date"
          value={formData.date || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Amount Field */}
      <div>
        <label className="block font-medium text-gray-700">Số tiền</label>
        <input
          type="number"
          name="amount"
          value={formData.amount || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
          min="0"
          step="0.01"
        />
      </div>

      {/* Transaction Group Field */}
      <div>
        <label className="block font-medium text-gray-700">
          Nhóm giao dịch
        </label>
        <select
          name="transactiongroupid"
          value={formData.transactiongroupid || ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedGroup = transactionGroupList.find(
              (item) => item.id === selectedId
            );
            setFormData((prev) => ({
              ...prev,
              transactiongroupid: selectedId,
              transactiongroupname: selectedGroup ? selectedGroup.name : "",
            }));
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Chọn nhóm</option>
          {transactionGroupList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Method Field */}
      <div>
        <label className="block font-medium text-gray-700">
          Phương thức thanh toán
        </label>
        <select
          name="paymentmethod"
          value={formData.paymentmethod || ""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setFormData((prev) => ({
              ...prev,
              paymentmethod: selectedValue,
            }));
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Chọn phương thức</option>
          <option value="1">Tiền mặt</option>
          <option value="0">Chuyển khoản</option>
        </select>
      </div>

      {/* Contract Field (Optional) */}
      <div>
        <label className="block font-medium text-gray-700">
          Hợp đồng liên quan
        </label>
        <select
          name="contractid"
          value={formData.contractid || ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedContract = contractList.find(
              (contract) => contract.id === selectedId
            );
            setFormData((prev) => ({
              ...prev,
              contractid: selectedId,
              contractname: selectedContract
                ? selectedContract.contract_name
                : "",
            }));
          }}
          className="w-full p-2 border rounded"
          /* Removed the `required` attribute to make it optional */
        >
          <option value="">Chọn hợp đồng (Không bắt buộc)</option>
          {contractList.map((contract) => (
            <option key={contract.id} value={contract.id}>
              {contract.contract_name}
            </option>
          ))}
        </select>
      </div>

      {/* Note Field */}
      <div>
        <label className="block font-medium text-gray-700">Ghi chú</label>
        <textarea
          name="note"
          value={formData.note || ""}
          onChange={handleInputChange}
          placeholder="Nhập ghi chú"
          className="w-full p-2 border rounded"
          rows={4}
        ></textarea>
      </div>

      {/* Image Upload Field */}
      <div>
        <label className="block font-medium text-gray-700">
          Tải lên hình ảnh (chỉ 1 ảnh)
        </label>
        <Upload
          beforeUpload={() => false} // Prevent automatic upload
          onChange={handleFileChange}
          listType="picture-card"
          className="w-full p-2 border rounded"
          maxCount={1}
          onPreview={handlePreview}
        >
          {formData.image ? null : (
            <div>
              <UploadOutlined />
              <div className="mt-2">Chọn ảnh</div>
            </div>
          )}
        </Upload>
        {formData.image && (
          <Viewer
            visible={previewVisible}
            onClose={handleCancelPreview}
            images={[{ src: formData.image, alt: "Uploaded Image" }]}
          />
        )}
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
