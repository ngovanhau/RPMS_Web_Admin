import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaBell,
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaFileSignature
} from "react-icons/fa";
import {
  getAllBuildings,
  getRoomByBuildingId,
  getBuildingByUserId,
} from "@/services/buildingApi/buildingApi";
import CustomModal from "@/components/Modal/Modal";
import DepositForm from "./components/CreateDepositForm";
import { Building, Deposit } from "@/types/types";
import { getallTenant } from "@/services/tenantApi/tenant";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import useTenantStore from "@/stores/tenantStore";
import {
  changeStatusDepositById,
  createDeposit,
  deleteDepositById,
  editDeposit,
  getAllDeposit,
  getDepositByBuildingId,
} from "@/services/depositApi/depositApi";
import { useDepositStore } from "@/stores/depositStore";
import DepositEditForm from "./components/EditDepositForm";
import Header from "./components/Header";
import OptionSelector from "./components/OptionSelector";
import DepositTable from "./components/DepositTable";
import AddDepositButton from "./components/AddDepositButton";

const DashBoardDeposit: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("Đang chờ phòng");
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );

  // Fetching data from stores and APIs
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const roomList = useBuildingStore((state) => state.roomList);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const building = useBuildingStore((state) => state.building);
  const customerList = useTenantStore((state) => state.allTenants);
  const depositList = useDepositStore((state) => state.deposits);

  const options = [
    "Đang chờ phòng",
    "Quá hạn",
    "Khách hủy cọc",
    "Đã tạo hợp đồng",
  ];

  const statusMap: { [key: number]: string } = {
    0: "Đang chờ phòng",
    1: "Quá hạn",
    2: "Khách hủy cọc",
    3: "Đã tạo hợp đồng",
  };

  const filteredDeposits = depositList.filter(
    (item) => statusMap[item.status] === selectedOption
  );

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        const buildingsData = (await getAllBuildings()).data.data;
        useBuildingStore.getState().setBuildings(buildingsData);
        const response = await getAllDeposit();
        useDepositStore.getState().setDeposits(response);
        setSelectedBuildingId(buildingsData[0]?.id || null);
        setBuilding(buildingsData[0] || null);
      } else if (userData?.role === "MANAGEMENT") {
        const buildingsData = (await getBuildingByUserId(userData?.id || "")).data.data;
        useBuildingStore.getState().setBuildings(buildingsData);
        if (buildingsData.length > 0) {
          const response = await getDepositByBuildingId(buildingsData[0].id);
          useDepositStore.getState().setDeposits(response);
          setSelectedBuildingId(buildingsData[0].id);
          setBuilding(buildingsData[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleBuildingSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBuilding = buildings.find(
      (building) => building.building_name === event.target.value
    );
    if (selectedBuilding) {
      await getRoomByBuildingId(selectedBuilding.id);
      const updatedDeposits = await getDepositByBuildingId(selectedBuilding.id);
      useDepositStore.getState().setDeposits(updatedDeposits);
      setBuilding(selectedBuilding);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddDeposit = async (newDeposit: Deposit) => {
    try {
      await createDeposit(newDeposit);
      setIsModalCreateOpen(false);
      if (selectedBuildingId) {
        const updatedDeposits = await getDepositByBuildingId(selectedBuildingId);
        useDepositStore.getState().setDeposits(updatedDeposits);
      }
    } catch (error) {
      console.error("Failed to create deposit:", error);
    }
  };

  const handleEditDeposit = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setIsModalEditOpen(true);
  };

  const handleUpdateDeposit = async (deposit: Deposit) => {
    try {
      await editDeposit(deposit);
      if (selectedBuildingId) {
        const updatedDeposits = await getDepositByBuildingId(selectedBuildingId);
        useDepositStore.getState().setDeposits(updatedDeposits);
      }
    } catch (error) {
      console.error("Error updating deposit:", error);
    }
  };

  const handleDeleteDeposit = async (depositId: string) => {
    try {
      await deleteDepositById(depositId);
      if (selectedBuildingId) {
        const updatedDeposits = await getDepositByBuildingId(selectedBuildingId);
        useDepositStore.getState().setDeposits(updatedDeposits);
      }
    } catch (error) {
      console.error("Error deleting deposit:", error);
    }
  };

  const handleStatusChange = async (id: string, status: number) => {
    await changeStatusDepositById(id, status);
    if (selectedBuildingId) {
      const updatedDeposits = await getDepositByBuildingId(selectedBuildingId);
      useDepositStore.getState().setDeposits(updatedDeposits);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <Header />

      <div className="flex h-[95%] p-6 overflow-hidden">
        <div className="flex flex-1 rounded-lg flex-col py-4 px-4 w-full bg-white shadow-md">
          <OptionSelector
            options={options}
            selectedOption={selectedOption}
            buildings={buildings}
            onOptionChange={setSelectedOption}
            onBuildingChange={handleBuildingSelect}
          />

          <DepositTable
            deposits={filteredDeposits}
            statusMap={statusMap}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <AddDepositButton onClick={() => setIsModalCreateOpen(true)} />

      <CustomModal
        header="Tạo cọc mới"
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
      >
        <DepositForm
          customerList={customerList}
          roomList={roomList}
          onSubmit={handleAddDeposit}
          onClose={() => setIsModalCreateOpen(false)}
        />
      </CustomModal>

      {/* Modal for Deposit Edit */}
      <CustomModal
        header="Chỉnh sửa cọc"
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
      >
        {selectedDeposit && (
          <DepositEditForm
            deposit={selectedDeposit}
            roomList={roomList}
            customerList={customerList}
            onSubmit={handleUpdateDeposit}
            onClose={() => setIsModalEditOpen(false)}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default DashBoardDeposit;