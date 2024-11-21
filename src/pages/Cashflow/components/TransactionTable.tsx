import React, { useState } from "react";
import { Transaction } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white">
      {transactions.length === 0 ? (
        <div className="text-center h-[30vh] w-full flex justify-center items-center text-gray-500">
          <span className="text-sm">Không có dữ liệu giao dịch</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[8px] border">
          {/* Table Container */}
          <div className="max-h-[700px] overflow-y-auto">
            <table className="w-full text-sm table-auto">
              <thead className="sticky top-0 bg-themeColor h-12 text-white z-10">
                <tr>
                  <th className="px-4 py-2 text-left">Tên nhóm giao dịch</th>
                  <th className="px-4 py-2 text-left">Tên hợp đồng</th>
                  <th className="px-4 py-2 text-left">Ghi chú</th>
                  <th className="px-4 py-2 text-left">Số tiền</th>
                  <th className="px-4 py-2 text-left">
                    Phương thức thanh toán
                  </th>
                  <th className="px-4 py-2 text-left">Ngày giao dịch</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-100 h-14 cursor-pointer`}
                    onClick={() => handleRowClick(transaction)}
                  >
                    <td className="px-4 py-2 max-w-xs break-words">
                      {transaction.transactiongroupname}
                    </td>
                    <td className="px-4 py-2 max-w-xs break-words">
                      {transaction.contractname}
                    </td>
                    <td className="px-4 py-2 max-w-sm break-words">
                      {transaction.note}
                    </td>
                    <td className="px-4 py-2">
                      {transaction.amount.toLocaleString()} VND
                    </td>
                    <td className="px-4 py-2">{transaction.paymentmethod}</td>
                    <td className="px-4 py-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for transaction details */}
      <CustomModal
        header="Thông tin giao dịch"
        isOpen={isModalOpen}
        onClose={closeModal}
        className="w-[90%] md:w-[50%]"
        contentClassName="space-y-6"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-semibold mb-1">
                  Tên nhóm giao dịch
                </label>
                <input
                  type="text"
                  defaultValue={selectedTransaction.transactiongroupname}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-semibold mb-1">
                  Tên hợp đồng
                </label>
                <input
                  type="text"
                  defaultValue={selectedTransaction.contractname}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-1">
                Ghi chú
              </label>
              <textarea
                defaultValue={selectedTransaction.note}
                rows={3}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-semibold mb-1">
                  Số tiền (VND)
                </label>
                <input
                  type="text"
                  defaultValue={selectedTransaction.amount.toLocaleString()}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-semibold mb-1">
                  Phương thức thanh toán
                </label>
                <input
                  type="text"
                  defaultValue={selectedTransaction.paymentmethod}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-semibold mb-1">
                Ngày giao dịch
              </label>
              <input
                type="date"
                defaultValue={new Date(selectedTransaction.date)
                  .toISOString()
                  .substring(0, 10)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {selectedTransaction.image && (
              <div className="flex flex-col items-start">
                <label className="text-gray-600 text-sm font-semibold mb-1">
                  Hình ảnh
                </label>
                <img
                  src={selectedTransaction.image}
                  alt="Transaction"
                  className="max-w-full h-auto mt-2 rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Logic to save changes
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default TransactionsTable;
