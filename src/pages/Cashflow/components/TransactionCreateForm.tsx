import React, { useEffect, useState } from "react";
import { Contract, Transaction } from "@/types/types";
import { getAllTransactionGroup } from "@/services/transactiongroupApi/transactiongroupApi";
import useTransactionGroupStore from "@/stores/transactiongroupStore";
import { getAllContract } from "@/services/contractApi/contractApi";

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
  const [formData, setFormData] = useState<Partial<Transaction>>({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    date: "",
    amount: 0,
    transactiongroupid: "",
    transactiongroupname: "",
    paymentmethod: "",
    contractid: "550e8400-e29b-41d4-a716-446655440000",
    contractname: "",
    note: "",
    image: "",
  });

  const transactionGroupList = useTransactionGroupStore(
    (state) => state.transactionGroups
  );

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await getAllTransactionGroup();
    await getAllContract()
    
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 overflow-hidden">
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
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Số tiền</label>
        <input
          type="number"
          name="amount"
          value={formData.amount || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>

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
        >
          <option value="">Chọn nhóm</option>
          {transactionGroupList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

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
        >
          <option value="">Chọn phương thức</option>
          <option value="1">Tiền mặt</option> 
          <option value="0">Chuyển khoản</option> 
        </select>
      </div>

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
        >
          <option value="">Chọn hợp đồng</option>
          {contractList.map((contract) => (
            <option key={contract.id} value={contract.id}>
              {contract.contract_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium text-gray-700">Ghi chú</label>
        <textarea
          name="note"
          value={formData.note || ""}
          onChange={handleInputChange}
          placeholder="Nhập ghi chú"
          className="w-full p-2 border rounded"
        ></textarea>
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Tải lên hình ảnh
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Preview"
              className="max-w-full h-auto rounded"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-themeColor text-white rounded hover:bg-themeColor-dark"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default NewTransactionForm;
