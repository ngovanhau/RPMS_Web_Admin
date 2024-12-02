import React, { useState, useEffect } from "react";
import { Building, Room, Transaction } from "@/types/types";
import {
  getAllBuildings,
  getBuildingByUserId,
  getRoomByBuildingId,
} from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import TransactionsTable from "./TransactionTable"; // Import TransactionsTable
import useTransactionStore from "@/stores/transactionStore";
import useAuthStore from "@/stores/userStore";
import {
  createTransaction,
  deleteTransaction,
  getAllTransaction,
  getTransactionByBuildingId,
  updateTransaction,
} from "@/services/transactionApi/transactionApi";
import CustomModal from "@/components/Modal/Modal";
import NewTransactionForm from "./TransactionCreateForm";
import { getContractByBuildingId } from "@/services/contractApi/contractApi";
import useContractStore from "@/stores/contractStore";

interface TransactionsProps {}

const Transactions: React.FC<TransactionsProps> = () => {
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const setRooms = useBuildingStore((state) => state.setRooms);
  const transactionList = useTransactionStore((state) => state.transactions);
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const contractList = useContractStore((state) => state.contracts);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [loading, setLoading] = useState<boolean>(false); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch initial data based on user role
  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (userData?.role === "ADMIN") {
        console.log('Role : ', userData?.role)
        await getAllBuildings();
        await getAllTransaction();
      } else {
        if(userData){
        console.log('Role : ', userData?.role)
        await getBuildingByUserId(userData?.id);
        }
      }
    } catch (error: any) {
      console.error("Error fetching initial data:", error);
      setError("Failed to fetch initial data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions based on user role and selected building
  const fetchTransactions = async (buildingId: string | null = selectedBuildingId) => {
    if (!buildingId) return;
    setLoading(true);
    setError(null);
    try {
      if (userData?.role === "ADMIN") {
        await getAllTransaction();
      } else if (userData?.role === "MANAGEMENT") {
        await getTransactionByBuildingId(buildingId);
      }
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically select the first building when buildings are updated
  useEffect(() => {
    if (
      userData?.role === "MANAGEMENT" &&
      buildings.length > 0 &&
      !selectedBuildingId
    ) {
      const firstBuilding = buildings[0];
      setSelectedBuildingId(firstBuilding.id);
      fetchRooms(firstBuilding.id);
      fetchTransactions(firstBuilding.id);
      getContractByBuildingId(firstBuilding.id)
        .then(() => {
          // Assuming getContractByBuildingId updates the store
        })
        .catch((error) => {
          console.error("Error fetching contracts:", error);
          setError("Failed to fetch contracts.");
        });
    }
  }, [buildings, userData?.role, selectedBuildingId]);

  // Fetch rooms by building ID
  const fetchRooms = async (buildingId: string) => {
    setLoading(true);
    setError(null);
    try {
      await getRoomByBuildingId(buildingId);
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      setError("Failed to fetch rooms.");
    } finally {
      setLoading(false);
    }
  };

  // Handle building selection
  const handleBuildingSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const buildingId = event.target.value;
    setSelectedBuildingId(buildingId);
    setSelectedRoom(null); // Reset selected room when building changes
    try {
      await fetchRooms(buildingId);
      await fetchTransactions(buildingId);
      await getContractByBuildingId(buildingId);
    } catch (error: any) {
      console.error("Error handling building selection:", error);
      setError("Failed to select building.");
    }
  };

  // Open and close modal
  const handleCreateTransaction = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleFormSubmit = async (transaction: Partial<Transaction>) => {
    setLoading(true);
    setError(null);
    try {
      await createTransaction(transaction);
      await fetchTransactions(); // Refresh transactions after creation
      // If contracts need to be updated as well:
      if (selectedBuildingId) {
        await getContractByBuildingId(selectedBuildingId);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      setError("Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    await updateTransaction(updatedTransaction)
    if(selectedBuildingId){
    await getTransactionByBuildingId(selectedBuildingId)
    }
  };
  const handleDeleteTransaction = async ( transactionId : string ) => {
    await deleteTransaction(transactionId)
    if(selectedBuildingId){
      await getTransactionByBuildingId(selectedBuildingId)
      }
  }

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="">
      {/* Display Loading Indicator */}
      {/* {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="loader"></div>
        </div>
      )} */}

      {/* Display Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 5.652a.5.5 0 10-.707-.707L10 8.586 6.36 4.945a.5.5 0 10-.707.707L9.293 10l-4.647 4.648a.5.5 0 00.707.707L10 11.414l3.64 3.64a.5.5 0 00.707-.707L10.707 10l3.64-3.648z" />
            </svg>
          </span>
        </div>
      )}

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

{ rooms.length > 0 && <select
            className="p-2 border rounded w-48"
            value={selectedRoom?.id || ""}
            onChange={(event) => {
              const roomId = event.target.value;
              const room = rooms.find((r) => r.id === roomId) || null;
              setSelectedRoom(room);
            }}
            disabled={!selectedBuildingId || rooms.length === 0}
          >
            <option value="">Phòng</option>
            {rooms?.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room_name}
              </option>
            ))}
          </select>}
        </div>

        {/* Other Filters */}
        <select className="p-2 border rounded w-48">
          <option value="">Loại thu/chi</option>
          {/* Add options as needed */}
        </select>
      </div>

      {/* Transactions Table */}
      <TransactionsTable onDeleteTransaction={handleDeleteTransaction} onUpdateTransaction={handleUpdateTransaction} transactions={transactionList} />

      {/* Fixed Button */}
      <div
        onClick={handleCreateTransaction}
        className="fixed bottom-[10%] right-[6%] h-14 w-14 bg-themeColor flex justify-center items-center rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
      >
        <span className="text-white text-2xl font-bold">+</span>
      </div>

      {/* Custom Modal */}
      <CustomModal header="Tạo giao dịch" isOpen={isModalOpen} onClose={handleModalClose}>
        <NewTransactionForm
          contractList={contractList}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
        />
      </CustomModal>
    </div>
  );
};

export default Transactions;
