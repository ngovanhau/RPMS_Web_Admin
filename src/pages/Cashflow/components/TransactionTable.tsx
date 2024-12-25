import React, { useState } from "react";
import { Transaction } from "@/types/types";
import CustomModal from "@/components/Modal/Modal";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import EditTransactionForm from "./TransactionEditForm";
import { IoEye } from "react-icons/io5";

interface TransactionsTableProps {
  onSelect: (transaction: Transaction) => void;
  filterType: number;
  transactions: Transaction[];
  onUpdateTransaction: (updatedTransaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  onSelect,
  filterType,
  transactions,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTransactions =
    filterType === 2
      ? transactions // Hiển thị tất cả nếu filterType là 2
      : transactions.filter((transaction) => transaction.type === filterType);

  // Lấy dữ liệu của trang hiện tại từ danh sách đã lọc
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  const handleSave = (transaction: Transaction) => {
    if (transaction) {
      onUpdateTransaction(transaction);
      closeModal();
    }
  };

  const handleDelete = async (transactionId: string) => {
    await onDeleteTransaction(transactionId);
    closeModal();
  };

  return (
    <div className="bg-white">
      <div className="overflow-hidden rounded-[8px] h-[70vh]">
        {/* Table Container */}
        <div className="h-[100%] overflow-y-auto">
          <div className="min-h-96 ">
            <table className="w-full text-sm table-auto">
              <thead className="sticky top-0 bg-themeColor h-12 text-white z-10">
                <tr>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Thao tác
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Tên
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Nhóm giao dịch
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Tòa nhà
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Phòng
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Khách hàng
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Số tiền
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Phương thức thanh toán
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Ngày giao dịch
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-300 text-left">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center border-2 h-64 border-gray-300 text-gray-500"
                    >
                      Chưa có giao dịch
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-100 h-14`}
                    >
                      <td className="border-2 border-gray-300 px-4 py-2 text-center align-middle">
                        <div
                          className="space-x-4"
                          style={{
                            display: "inline-flex",
                            verticalAlign: "middle",
                          }}
                        >
                          {/* Dropdown Menu */}
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreHorizontal className="w-5 h-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-white">
                                <DropdownMenuItem
                                  className="flex flex-row"
                                  onClick={() => {
                                    setSelectedTransaction(transaction);
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2 " />
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(transaction.id)}
                                  className="flex flex-row"
                                >
                                  <Trash className="w-4 h-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Eye Icon */}
                          <div onClick={() => onSelect(transaction)}>
                            <IoEye className="w-5 h-5 text-themeColor cursor-pointer" />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction?.namereason}
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction?.transactiongroupname}
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction.buildingname}
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction.roomname}
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction.customername}
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction.amount.toLocaleString()} VND
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction.paymentmethod}
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {new Date(transaction.date).toLocaleDateString("en-GB")}
                      </td>

                      <td className="px-4 py-2 border-2 border-gray-300 text-left">
                        {transaction.note}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="flex justify-center items-center mt-4">
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={`${
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Trước
              </PaginationPrevious>

              <PaginationContent>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem
                    key={index}
                    className={`${
                      currentPage === index + 1
                        ? "bg-themeColor text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <PaginationLink onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>

              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={`${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Sau
              </PaginationNext>
            </Pagination>
          )}
        </div>
      </div>
      {selectedTransaction && (
        <CustomModal
          header="Chỉnh sửa"
          onClose={() => setIsEditModalOpen(false)}
          isOpen={isEditModalOpen}
          children={
            <EditTransactionForm
              transaction={selectedTransaction}
              onCancel={() => setIsEditModalOpen(false)}
              onSubmit={handleSave}
            />
          }
        />
      )}
    </div>
  );
};

export default TransactionsTable;
