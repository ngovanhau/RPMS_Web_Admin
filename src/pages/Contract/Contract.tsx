import React, { useState, useEffect } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import HeaderContractRow from "./components/HeaderContractRow";
import ContractRow from "./components/ContractRow";
import ContractDetailsModal from "./components/ContractDetailModal";
import CustomModal from "@/components/Modal/Modal";
import CreateContractForm from "./components/ContractCreateForm";
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
      await getCustomerNoRoom()
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
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b bg-white w-full">
        <FaSearch className="text-gray-600" size={20} />
        <input
          className="w-full text-sm border-none focus:outline-none"
          placeholder="Tìm kiếm hợp đồng"
        />
        <FaBell className="text-gray-600" size={20} />
      </div>

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span>Thêm</span>
              </div>
            </div>
          </div>

          <HeaderContractRow />

          {contractData?.length === 0 && (
            <div className="flex flex-1 w-full justify-center items-center pb-20">
              <span className="text-gray-500 text-sm">Chưa có hợp đồng nào</span>
            </div>
          )}
          {contractData?.map((contract) => (
            <ContractRow
              key={contract?.id}
              contract={contract}
              onClick={() => handleRowClick(contract)}
              onDelete={() => handleDelete(contract.id)}
            />
          ))}
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
