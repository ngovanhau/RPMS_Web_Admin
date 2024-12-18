import React, { useState } from "react";
import { Transaction } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";
import { MoreHorizontal, Edit, Trash } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  onUpdateTransaction: (updatedTransaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const handleDropdownToggle = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (selectedTransaction) {
      onUpdateTransaction(selectedTransaction);
      closeModal();
    }
  };

  const handleDelete = async (transactionId: string) => {
    await onDeleteTransaction(transactionId);
    closeModal();
  };

  const paymentMethodMap: { [key: string]: string } = {
    0: "Chuyển khoản",
    1: "Tiền mặt",
  };

  return (
    <div className="bg-white">
      <div className="overflow-hidden rounded-[8px] h-[70vh]">
        {/* Table Container */}
        <div className="h-[100%] overflow-y-auto">
          <table className="w-full text-sm table-auto">
            <thead className="sticky top-0 bg-themeColor h-12 text-white z-10">
              <tr>
                <th className="px-4 py-2 border-2 border-gray-300 text-left"></th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Tên</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Nhóm giao dịch</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Tòa nhà</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Phòng</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Khách hàng</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Số tiền</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Phương thức thanh toán</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Ngày giao dịch</th>
                <th className="px-4 py-2 border-2 border-gray-300 text-left">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center border-2 border-gray-300 py-4 text-gray-500">
                    Chưa có giao dịch
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-100 h-14`}
                  >
                    <td className="px-4 py-2 relative">
                      {/* Dropdown Trigger */}
                      <button
                        className="focus:outline-none"
                        onClick={() => handleDropdownToggle(index)}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpen === index && (
                        <div className="absolute left-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-20">
                          <button
                            className="w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-100"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setIsModalOpen(true);
                              setDropdownOpen(null);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2 text-blue-500" />
                            Sửa
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm flex items-center text-red-600 hover:bg-gray-100"
                            // onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.namereason}</td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.transactiongroupid}</td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.buildingname}</td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.roomname}</td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.customername}</td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.amount.toLocaleString()}VND</td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{paymentMethodMap[transaction.paymentmethod]}</td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.date} </td>
                    <td className="px-4 py-2 border-2 border-gray-300 text-left">{transaction.note} </td>

                    <td className="px-4 py-2 border-2 border-gray-300 text-left">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for editing transaction */}
      {/* <CustomModal
        header="Chỉnh sửa giao dịch"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Tên nhóm giao dịch</label>
              <input
                type="text"
                value={selectedTransaction.transactiongroupname}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    transactiongroupname: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Tên hợp đồng</label>
              <input
                type="text"
                value={selectedTransaction.contractname || undefined}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    contractname: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Số tiền</label>
              <input
                type="number"
                value={selectedTransaction.amount}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    amount: Number(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Ghi chú</label>
              <textarea
                value={selectedTransaction.note}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    note: e.target.value,
                  })
                }
                className="border p-2 rounded"
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        )}
      </CustomModal> */}
    </div>
  );
};

export default TransactionsTable;
