import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa"; // Import các icon từ react-icons
import HeaderContractRow from "./components/HeaderContractRow";
import ContractDetailsModal from "./components/ContractDetailModal";
import CustomModal from "@/components/Modal/Modal";
import CreateContractForm from "./components/ContractCreateForm";
import ContractRow from "./components/ContractRow";
import { Contract } from "@/types/types";
import {
  createContract,
  getAllContract,
  deleteContract,
  getCustomerNoRoom,
} from "@/services/contractApi/contractApi";
import useContractStore from "@/stores/contractStore";

const DashBoardContract: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const contractData = useContractStore((state) => state.contracts);

  useEffect(() => {
    const fetchContracts = async () => {
      await getAllContract();
      await getCustomerNoRoom();
    };
    fetchContracts();
  }, []);

  const handleRowClick = (contract: Contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  const handleCreateContract = async (contract: Contract) => {
    await createContract(contract);
    await getAllContract();
    setIsOpenCreateModal(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?");
    if (confirmed) {
      await deleteContract(id);
      await getAllContract();
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b bg-white w-full"></div>

      <div className="flex h-[95%] p-4 overflow-hidden">
        <div className="flex flex-1 rounded-[8px] flex-col py-4 px-4 w-full bg-white">
          <div className="flex flex-row justify-between items-center pb-4 border-b">
            <div className="flex flex-row items-center gap-6">
              <div className="py-1 px-2 rounded-[6px] flex justify-center items-center bg-themeColor">
                <span className="text-base text-white font-bold">
                  {contractData.length}
                </span>
              </div>
              <span className="text-sm">{contractData.length} Hợp đồng</span>
            </div>
            <div>
              <div
                onClick={() => setIsOpenCreateModal(true)}
                className="bg-themeColor flex flex-row justify-center items-center gap-2 text-base h-12 text-white py-2 w-44 rounded-[6px] shadow hover:bg-themeColor transition duration-300 cursor-pointer"
                title="Thêm Mới"
              >
                <FaPlus size={20} />
                <span>Thêm</span>
              </div>
            </div>
          </div>

          {/* Bảng hiển thị hợp đồng */}
          <table className="w-full table-fixed border-collapse border border-gray-300">
            <thead>
              <tr className="bg-themeColor text-white h-12">
                <th className="w-[5%] py-2 px-4 text-left border border-gray-300"></th>
                <th className="w-[20%] py-2 px-4 text-left border border-gray-300">Tên người thuê</th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">Phòng</th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">Ngày bắt đầu</th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">Ngày kết thúc</th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">Giá thuê phòng</th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">Tiền cọc</th>
              </tr>
            </thead>
            <tbody>
              {contractData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-500 py-4"
                  >
                    Chưa có hợp đồng nào
                  </td>
                </tr>
              ) : (
                contractData.map((contract, index) => (
                  <ContractRow
                    key={contract.id}
                    contract={contract}
                    onClick={() => handleRowClick(contract)}
                    onDelete={() => handleDelete(contract.id)}
                    index={index + 1}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContract && (
        <ContractDetailsModal
          contract={selectedContract}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}

      <CustomModal
        header="Create New Contract"
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
      >
        <CreateContractForm onSubmit={handleCreateContract} />
      </CustomModal>
    </div>
  );
};

export default DashBoardContract;
