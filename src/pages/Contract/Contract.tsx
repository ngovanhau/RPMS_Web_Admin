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
  updateContract,
  downloadContractPDF,
  getContractByBuildingId,
} from "@/services/contractApi/contractApi";
import useContractStore from "@/stores/contractStore";
import EditContractForm from "./components/ContractEditForm";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import {
  getAllBuildings,
  getBuildingByUserId,
} from "@/services/buildingApi/buildingApi";
import { Bell } from "lucide-react";

const DashBoardContract: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false); // Separate state for Edit Modal
  const [editContract, setEditContract] = useState<Contract | null>(null); // Store the contract to be edited
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  ); // State for selected building
  const contractData = useContractStore((state) => state.contracts);
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const roomList = useBuildingStore((state) => state.roomList);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await getAllContract();
      } else if (userData?.role === "MANAGEMENT") {
        const buildingsData = (await getBuildingByUserId(userData?.id || ""))
          .data.data;
        if (buildingsData.length > 0) {
          setSelectedBuildingId(buildingsData[0].id);
          setBuilding(buildingsData[0]);
          // await getContractByBuildingId(buildingsData[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    if (selectedBuildingId) {
      getContractByBuildingId(selectedBuildingId);
    }
  }, [selectedBuildingId]);

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

  const handlePrint = async (contractId: string) => {
    try {
      const response = await downloadContractPDF(contractId);
      const fileUrl = response.data.downloadLink;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank"; // Mở trong tab mới
      link.rel = "noopener noreferrer"; // Bảo mật cho liên kết mở trong tab mới
      link.click();
    } catch (error) {
      console.error("Error downloading the contract:", error);
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditContract(contract); // Set the contract to be edited
    setIsOpenEditModal(true); // Open the edit modal
  };

  const handleEditContract = async (contract: Contract) => {
    await updateContract(contract);
    await getAllContract(); // Refresh the contract list after saving
    setIsOpenEditModal(false); // Close the modal
  };

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBuildingId(e.target.value);
    const selectedBuilding = buildings.find(
      (building) => building.id === e.target.value
    );
    if (selectedBuilding) {
      setBuilding(selectedBuilding);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
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
              {/* Building Selector */}
              <div className="flex items-center gap-4">
                <select
                  className="p-2 border border-gray-300 rounded-md"
                  value={selectedBuildingId || ""}
                  onChange={handleBuildingChange}
                >
                  <option value="">Chọn tòa nhà</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.building_name}
                    </option>
                  ))}
                </select>
              </div>
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
                <th className="w-[20%] py-2 px-4 text-left border border-gray-300">
                  Tên người thuê
                </th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                  Phòng
                </th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                  Ngày bắt đầu
                </th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                  Ngày kết thúc
                </th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                  Giá thuê phòng
                </th>
                <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                  Tiền cọc
                </th>
              </tr>
            </thead>
            <tbody>
              {contractData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
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
                    onEdit={() => handleEdit(contract)} // Pass the contract to edit
                    onPrint={() => handlePrint(contract.id)}
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
        header="Tạo hợp đồng"
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
      >
        <CreateContractForm onSubmit={handleCreateContract} />
      </CustomModal>

      {/* Edit Contract Modal */}
      <CustomModal
        header="Sửa hợp đồng"
        isOpen={isOpenEditModal} // Use separate modal state for editing
        onClose={() => setIsOpenEditModal(false)}
      >
        {editContract && (
          <EditContractForm
            contract={editContract}
            onSubmit={handleEditContract}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default DashBoardContract;
