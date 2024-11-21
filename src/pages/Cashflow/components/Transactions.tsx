import React, { useState, useEffect } from "react";
import { Building, Room, Transaction } from "@/types/types";
import { getAllBuildings, getBuildingByUserId, getRoomByBuildingId } from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import TransactionsTable from "./TransactionTable"; // Import TransactionsTable
import useTransactionStore from "@/stores/transactionStore";
import useAuthStore from "@/stores/userStore";
import { getAllTransaction, getTransactionByBuildingId } from "@/services/transactionApi/transactionApi";
import CustomModal from "@/components/Modal/Modal";
import NewTransactionForm from "./TransactionCreateForm";

interface TransactionsProps {}

const Transactions: React.FC<TransactionsProps> = () => {
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const setRooms = useBuildingStore((state) => state.setRooms);
  const transactionList = useTransactionStore((state) => state.transactions);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await getAllTransaction();
      } else if (userData?.role === "MANAGEMENT") {
        await getBuildingByUserId(userData?.id);
        if (buildings.length > 0) {
          setSelectedBuildingId(buildings[0].id);
          await getTransactionByBuildingId(buildings[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchRooms = async (buildingId: string) => {
    try {
      await getRoomByBuildingId(buildingId);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleBuildingSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const buildingId = event.target.value;
    setSelectedBuildingId(buildingId);
    fetchRooms(buildingId);
    await getTransactionByBuildingId(buildingId);
  };

  const handleCreateTransaction = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (transaction: Partial<Transaction>) => {
    console.log("New Transaction:", transaction);
    // Call API to save transaction or update state here
    setIsModalOpen(false);
  };

  return (
    <div className="">
      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Building and Room Selectors */}
        <div className="flex flex-wrap gap-4">
          <select
            className="p-2 border rounded w-48"
            value={selectedBuildingId || ""}
            onChange={handleBuildingSelect}
          >
            <option value="">Tòa nhà</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.building_name}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded w-48"
            value={selectedRoom?.id || ""}
            onChange={(event) => {
              const roomId = event.target.value;
              const room = rooms.find((r) => r.id === roomId) || null;
              setSelectedRoom(room);
            }}
          >
            <option value="">Phòng</option>
            {rooms?.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room_name}
              </option>
            ))}
          </select>
        </div>

        {/* Other Filters */}
        <select className="p-2 border rounded w-48">
          <option value="">Loại thu/chi</option>
        </select>
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={transactionList} />

      {/* Fixed Button */}
      <div
        onClick={handleCreateTransaction}
        className="fixed bottom-[10%] right-[6%] h-14 w-14 bg-themeColor flex justify-center items-center rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
      >
        <span className="text-white text-2xl font-bold">+</span>
      </div>

      {/* Custom Modal */}
      <CustomModal header="Tạo giao dịch" isOpen={isModalOpen} onClose={handleModalClose}>
        <NewTransactionForm onSubmit={handleFormSubmit} onCancel={handleModalClose} />
      </CustomModal>
    </div>
  );
};

export default Transactions;
