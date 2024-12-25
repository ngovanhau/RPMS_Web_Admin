import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import CustomModal from "@/components/Modal/Modal";
import TransactionGroupForm from "./components/TransactionGroupForm";
import { TransactionGroup } from "@/types/types";
import {
  createTransactionGroup,
  getAllTransactionGroup,
  deleteTransactionGroup,
  updateTransactionGroup,
} from "@/services/transactiongroupApi/transactiongroupApi";
import useAuthStore from "@/stores/userStore";
import useTransactionGroupStore from "@/stores/transactiongroupStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Pagination components
import TransactionGroupDetail from "./components/TransactionGroupDetail";
import { IoEye } from "react-icons/io5";

const TransactionGroups = () => {
  const userData = useAuthStore((state) => state.userData);
  const transactionGroupList = useTransactionGroupStore(
    (state) => state.transactionGroups
  );
  const ITEMS_PER_PAGE = 8; // Số phần tử mỗi trang

  // Thêm state để quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactionGroup, setSelectedTransactionGroup] = useState<TransactionGroup | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TransactionGroup | null>(
    null
  );
  const [filterType, setFilterType] = useState("all");
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN" || userData?.role === "MANAGEMENT") {
        await getAllTransactionGroup();
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddGroup = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEditGroup = (group: TransactionGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleSaveGroup = async (group: TransactionGroup) => {
    try {
      if (editingGroup) {
        // If editing, update the group
        await updateTransactionGroup(group.id, group);
      } else {
        // If adding a new group
        await createTransactionGroup(group);
      }

      // After creating or updating, close the modal and refresh the list
      setIsModalOpen(false);
      await getAllTransactionGroup();
      setCurrentPage(1); // Reset về trang đầu tiên sau khi cập nhật dữ liệu
    } catch (error) {
      console.error("Error saving group:", error);
      // Bạn có thể thêm thông báo lỗi ở đây
    }
  };

  const handleDeleteGroup = async (group: TransactionGroup) => {
    try {
      await deleteTransactionGroup(group.id);
      await getAllTransactionGroup();
      // Nếu trang hiện tại vượt quá tổng số trang sau khi xóa, chuyển về trang cuối
      const newTotalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      // Bạn có thể thêm thông báo lỗi ở đây
    }
  };

  const filteredGroups = transactionGroupList.filter((group) => {
    if (filterType === "all") return true;
    if (filterType === "income") return group.type === 0;
    if (filterType === "expense") return group.type === 1;
    return true;
  });

  // Tính toán tổng số trang dựa trên danh sách đã lọc
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);

  // Điều chỉnh currentPage nếu nó vượt quá tổng số trang
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  // Lấy phần tử của trang hiện tại từ danh sách đã lọc
  const currentTrasaction = filteredGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const onViewDetails = (transactionGroup : TransactionGroup) => {
    setSelectedTransactionGroup(transactionGroup)
    setIsModalDetailOpen(true)
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full">
      <div className="flex flex-col flex-1 p-6 overflow-auto">
        <Card className="flex flex-col flex-1 shadow-none border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold text-themeColor">
              Danh sách nhóm giao dịch
            </CardTitle>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
              }}
            >
              <SelectTrigger className="w-[180px] rounded-[8px] border-themeColor text-themeColor">
                <SelectValue placeholder="Chọn loại giao dịch" />
              </SelectTrigger>
              <SelectContent className="bg-white ">
                <SelectItem
                  className="data-[state=checked]:bg-themeColor data-[state=checked]:text-white"
                  value="all"
                >
                  Tất cả
                </SelectItem>
                <SelectItem
                  className="data-[state=checked]:bg-themeColor data-[state=checked]:text-white"
                  value="income"
                >
                  Thu
                </SelectItem>
                <SelectItem
                  className="data-[state=checked]:bg-themeColor data-[state=checked]:text-white"
                  value="expense"
                >
                  Chi
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Không có dữ liệu</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-themeColor text-white text-xl">
                      <th className="w-16 px-4 py-3 border-2 border-gray-300 text-left font-medium "></th>
                      <th className="px-4 py-3 border-2 border-gray-300 text-left font-medium">
                        Tên nhóm
                      </th>
                      <th className="px-4 py-3 border-2 border-gray-300 text-left font-medium ">
                        Loại
                      </th>
                      <th className="px-4 py-3 border-2 border-gray-300 text-left  font-medium ">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTrasaction.map((group, index) => (
                      <tr
                        key={group.id}
                        className="hover:bg-gray-50 transition-colors text-md font-semibold"
                      >
                        <td className="px-4 py-3 border-2 border-gray-300 flex flex-row justify-center items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none ">
                              <div className="p-2 hover:bg-gray-100 rounded-full">
                                <MoreHorizontal />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="px-4 bg-white"
                            >
                              <DropdownMenuItem
                                className="flex items-center space-x-2"
                                onClick={() => handleEditGroup(group)}
                              >
                                <FaEdit size={16} />
                                <span>Chỉnh sửa</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center space-x-2"
                                onClick={() => handleDeleteGroup(group)}
                              >
                                <FaTrashAlt
                                  className="text-gray-500"
                                  size={16}
                                />
                                <span>Xóa</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div
                            onClick={() => onViewDetails(group)}
                          >
                              <IoEye className="w-5 mr-2 h-5 text-themeColor" />
                          </div>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-md text-gray-900">
                          {group.name}
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300">
                          <span
                            className={`inline-flex items-center py-0.5 px-2 rounded-full text-md font-medium ${
                              group.type === 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {group.type === 0 ? "Thu" : "Chi"}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-md text-gray-900">
                          {group.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          {/* Thêm phần phân trang ở đây */}
          {filteredGroups.length > ITEMS_PER_PAGE && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Trước
                </PaginationPrevious>
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-themeColor text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Sau
                </PaginationNext>
              </Pagination>
            </div>
          )}
        </Card>
      </div>
      <button
        onClick={handleAddGroup}
        className="fixed bottom-[10%] right-[6%] bg-themeColor text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <span className="text-2xl">+</span>
      </button>

      <CustomModal
        header={editingGroup ? "Chỉnh sửa" : "Thêm mới"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <TransactionGroupForm
          initialData={editingGroup || undefined}
          onSubmit={handleSaveGroup}
          onCancel={() => setIsModalOpen(false)}
          onUpdate={fetchInitialData} // Pass the fetch function to refresh the list
        />
      </CustomModal>


      <CustomModal
      header="Chi tiết"
      isOpen={isModalDetailOpen}
      onClose={()=>setIsModalDetailOpen(false)}
      >
        <TransactionGroupDetail data={selectedTransactionGroup || {}} onClose={()=>setIsModalDetailOpen(false)}/>
      </CustomModal>
    </div>
  );
};

export default TransactionGroups;
