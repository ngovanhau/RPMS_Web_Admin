import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons from react-icons
import CustomModal from "@/components/Modal/Modal";
import TransactionGroupForm from "./TransactionGroupForm";
import { TransactionGroup } from "@/types/types";
import {
  createTransactionGroup,
  getAllTransactionGroup,
  deleteTransactionGroup, // Assuming you have a delete function
} from "@/services/transactiongroupApi/transactiongroupApi";
import useAuthStore from "@/stores/userStore";
import useTransactionGroupStore from "@/stores/transactiongroupStore";

const TransactionGroups: React.FC = () => {
  const userData = useAuthStore((state) => state.userData);
  const transactionGroupList = useTransactionGroupStore(
    (state) => state.transactionGroups
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TransactionGroup | null>(null);

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
    const response = await createTransactionGroup(group);
    await getAllTransactionGroup();
    setIsModalOpen(false);
  };

  const handleDeleteGroup = (group: TransactionGroup) => {
    // Call your delete API function here
    deleteTransactionGroup(group.id).then(() => {
      getAllTransactionGroup(); // Refresh the list after deletion
    });
  };

  return (
    <div className="p-4 pt-0 bg-white relative min-h-screen">
      {transactionGroupList.length === 0 ? (
        <div className="text-center h-[30vh] w-full flex justify-center items-end py-4 text-gray-500">
          <span className="text-sm text-gray-500">Không có dữ liệu</span>
        </div>
      ) : (
        <div className="overflow-auto max-h-[750px]">
          <table className="w-full text-sm rounded-lg table-auto">
            <thead className="bg-themeColor text-white">
              <tr className="h-12">
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Tên nhóm
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Loại
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Ghi chú
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {transactionGroupList.map((group, index) => (
                <tr
                  key={group.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-100 h-12`}
                >
                  <td className="px-4 py-2">{group.name}</td>
                  <td className="px-4 py-2">
                    {group.type === 0 ? "Thu" : "Chi"}
                  </td>
                  <td className="px-4 py-2 max-w-sm break-words">
                    {group.note}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={16} /> {/* Edit icon */}
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt size={16} /> {/* Delete icon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      <button
        onClick={handleAddGroup}
        className="fixed bottom-[12%] right-[6%] bg-themeColor text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <span className="text-4xl">+</span>
      </button>
    </div>
  );
};

export default TransactionGroups;
