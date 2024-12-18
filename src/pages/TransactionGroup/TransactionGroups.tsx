import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import CustomModal from "@/components/Modal/Modal";
import TransactionGroupForm from "../Cashflow/components/TransactionGroupForm";
import { TransactionGroup } from "@/types/types";
import {
  createTransactionGroup,
  getAllTransactionGroup,
  deleteTransactionGroup,
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
import { MoreHorizontal } from "lucide-react";

const TransactionGroups = () => {
  const userData = useAuthStore((state) => state.userData);
  const transactionGroupList = useTransactionGroupStore(
    (state) => state.transactionGroups
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TransactionGroup | null>(
    null
  );
  const [filterType, setFilterType] = useState("all");

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
    await createTransactionGroup(group);
    await getAllTransactionGroup();
    setIsModalOpen(false);
  };

  const handleDeleteGroup = async (group: TransactionGroup) => {
    await deleteTransactionGroup(group.id);
    await getAllTransactionGroup();
  };

  const filteredGroups = transactionGroupList.filter((group) => {
    if (filterType === "all") return true;
    if (filterType === "income") return group.type === 0;
    if (filterType === "expense") return group.type === 1;
    return true;
  });

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <div className="flex h-[100%] p-6 overflow-hidden">
        <Card className="flex flex-col flex-1 shadow-none border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-bold text-themeColor">
              Danh sách nhóm giao dịch
            </CardTitle>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value)}
            >
              <SelectTrigger className="w-[180px] rounded-[8px] border-themeColor text-themeColor">
                <SelectValue placeholder="Chọn loại giao dịch" />
              </SelectTrigger>
              <SelectContent className="bg-white ">
                <SelectContent className="bg-white">
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
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Không có dữ liệu</p>
              </div>
            ) : (
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-themeColor text-white">
                      <th className="w-16 px-4 py-3 border-2 border-gray-300 text-left text-sm font-medium "></th>
                      <th className="px-4 py-3 border-2 border-gray-300 text-left text-sm font-medium">
                        Tên nhóm
                      </th>
                      <th className="px-4 py-3 border-2 border-gray-300 text-left text-sm font-medium ">
                        Loại
                      </th>
                      <th className="px-4 py-3 border-2 border-gray-300 text-left text-sm font-medium ">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups.map((group, index) => (
                      <tr
                        key={group.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 border-2 border-gray-300">
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
                                className="flex items-center space-x-2 text-blue-600"
                                onClick={() => handleEditGroup(group)}
                              >
                                <FaEdit size={16} />
                                <span>Chỉnh sửa</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center space-x-2 text-red-600"
                                onClick={() => handleDeleteGroup(group)}
                              >
                                <FaTrashAlt size={16} />
                                <span>Xóa</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-md text-gray-900">
                          {group.name}
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300">
                          <span
                            className={`inline-flex items-center py-0.5 rounded-full text-md font-medium `}
                          >
                            {group.type === 0 ? "Thu" : "Chi"}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-2 border-gray-300 text-md text-gray-500 max-w-sm break-words">
                          {group.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <button
        onClick={handleAddGroup}
        className="fixed bottom-[10%] right-[6%] bg-themeColor text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        <span className="text-2xl">+</span>
      </button>

      <CustomModal
        header={editingGroup ? "Chỉnh sửa nhóm" : "Thêm nhóm mới"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <TransactionGroupForm
          initialData={editingGroup || undefined}
          onSubmit={handleSaveGroup}
          onCancel={() => setIsModalOpen(false)}
        />
      </CustomModal>
    </div>
  );
};

export default TransactionGroups;
