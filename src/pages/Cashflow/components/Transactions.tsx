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
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [loading, setLoading] = useState<boolean>(false); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error messages
  // Fetch initial data based on user role

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        // await getAllTransaction();
      } else {
        if (userData?.role !== "ADMIN" && userData) {
          await getBuildingByUserId(userData.id);
          // Ensure buildings are fetched before setting selectedBuildingId
          if (buildings.length > 0) {
            setSelectedBuildingId(buildings[0].id);
          }
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
    try {
        await getTransactionByBuildingId(buildingId); 
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (
      userData?.role === "MANAGEMENT" &&
      buildings.length > 0 &&
      !selectedBuildingId
    ) {
      const firstBuilding = buildings[0];
      setSelectedBuildingId(firstBuilding.id);
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



  const handleBuildingSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const buildingId = event.target.value;
    setSelectedBuildingId(buildingId);
    try {
      // For selected building, fetch contracts (if needed)
      await getContractByBuildingId(buildingId);
      fetchTransactions(buildingId);  // Trigger transaction fetch for this building
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
      await fetchTransactions(); // Refresh the data after creating transaction
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      setError("Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle updating a transaction
  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    setLoading(true);
    setError(null);
    try {
      await updateTransaction(updatedTransaction);
      await fetchTransactions(); // Refresh the data after updating transaction
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      setError("Failed to update transaction.");
    } finally {
      setLoading(false);
    }
  };
  
    // Handle deleting a transaction
    const handleDeleteTransaction = async (transactionId: string) => {
      setLoading(true);
      setError(null);
      try {
        await deleteTransaction(transactionId);
        await fetchTransactions(); // Refresh the data after deleting transaction
      } catch (error: any) {
        console.error("Error deleting transaction:", error);
        setError("Failed to delete transaction.");
      } finally {
        setLoading(false);
      }
    };
    

    useEffect(() => {
      const initializeBuilding = async () => {
        if (
          userData?.role === "MANAGEMENT" &&
          buildings.length > 0 &&
          !selectedBuildingId
        ) {
          const firstBuilding = buildings[0];
          setSelectedBuildingId(firstBuilding.id);
          // Không gọi fetchTransactions ở đây
          try {
            await getContractByBuildingId(firstBuilding.id);
          } catch (error) {
            console.error("Error fetching contracts:", error);
            setError("Failed to fetch contracts.");
          }
        }
      };
      initializeBuilding();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildings, userData?.role]);
    
  
    // Fetch initial data when component mounts
    useEffect(() => {
      fetchInitialData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    useEffect(() => {
      if (!selectedBuildingId && buildings.length > 0) {
        const firstBuilding = buildings[0];
        setSelectedBuildingId(firstBuilding.id);
        fetchTransactions(firstBuilding.id);
      }
    }, [buildings, selectedBuildingId]); 
    

  return (
    <div className="">
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
        </div>

        {/* Other Filters */}
      </div>

      {/* Transactions Table */}
      <TransactionsTable
        onDeleteTransaction={handleDeleteTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        transactions={transactionList}
      />

      {/* Fixed Button */}
      <div
        onClick={handleCreateTransaction}
        className="fixed bottom-[10%] right-[6%] h-14 w-14 bg-themeColor flex justify-center items-center rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
      >
        <span className="text-white text-2xl font-bold">+</span>
      </div>

      {/* Custom Modal */}
      <CustomModal
        header="Tạo giao dịch"
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
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
