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
import { Minus, Plus, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
  const fetchTransactions = async (
    buildingId: string | null = selectedBuildingId
  ) => {
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

  const handleBuildingSelect = async (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    try {
      // Fetch contracts for the selected building
      await getContractByBuildingId(buildingId);
      fetchTransactions(buildingId); // Trigger transaction fetch for this building
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
    <div className="flex flex-1 flex-col gap-[2%]">
      <div className="flex flex-row w-full justify-between items-center gap-[2%]">
        <div className="flex flex-row w-1/3 bg-white justify-between items-center p-4 rounded-[8px]">
          <div className="flex flex-col ">
            <span className="font-semibold text-xl text-themeColor">
              4,762,000
            </span>
            <span className="text-sm">Tổng thu</span>
          </div>
          <div className="p-2 bg-gray-200 rounded-full">
            <Plus className="text-themeColor" />
          </div>
        </div>
        <div className="flex flex-row w-1/3 bg-white justify-between items-center p-4 rounded-[8px]">
          <div className="flex flex-col ">
            <span className="font-semibold text-xl text-themeColor">
              4,762,000
            </span>
            <span className="text-sm">Tổng chi</span>
          </div>
          <div className="p-2 bg-gray-200 rounded-full">
            <Minus className="text-themeColor" />
          </div>
        </div>
        <div className="flex flex-row w-1/3 bg-white justify-between items-center p-4 rounded-[8px]">
          <div className="flex flex-col ">
            <span className="font-semibold text-xl text-themeColor">
              4,762,000
            </span>
            <span className="text-sm">Thu - chi</span>
          </div>
          <div className="p-2 bg-gray-200 rounded-full">
            <Wallet className="text-themeColor" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 w-full flex-col bg-white rounded-[8px] p-4 gap-4">
        <div className="w-full flex flex-row mt-2 font-semibold text-themeColor">
          <span className="text-xl">Thu chi</span>
        </div>
       <div className="w-full flex flex-row gap-[4%]">
          <div className="w-1/4 flex gap-2 flex-col">
            {/* Building Select */}
            <label htmlFor="buildingSelect" className="text-sm text-gray-600 font-semibold">
              Tòa nhà
            </label>
            <Select
              value={selectedBuildingId || ""}
              onValueChange={(value) => handleBuildingSelect(value)}
            >
              <SelectTrigger className="p-2 border h-10 rounded w-full border-gray-200">
                <SelectValue placeholder="Chọn tòa nhà" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.building_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          <div className="w-1/4 flex gap-2 flex-col">
            {/* Transaction Type Select */}
            <label
              htmlFor="transactionTypeSelect"
              className="text-sm text-gray-600 font-semibold"
            >
              Loại (thu/chi)
            </label>
            <Select
              value={transactionType || ""}
              onValueChange={setTransactionType}
            >
              <SelectTrigger className="p-2 border h-10 rounded w-full border-gray-200">
                <SelectValue placeholder="Chọn loại thu chi" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="income">Thu</SelectItem>
                <SelectItem value="expense">Chi</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <div className="w-1/4 flex gap-2 flex-col">
            {/* Start Date */}
            <label htmlFor="startDate" className="text-sm text-gray-600 font-semibold">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              id="startDate"
              className="p-2 border h-10 rounded w-full"
              placeholder="Ngày bắt đầu"
            />
          </div>
  
          <div className="w-1/4 flex gap-2 flex-col">
            {/* End Date */}
            <label htmlFor="endDate" className="text-sm text-gray-600 font-semibold">
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              id="endDate"
              className="p-2 border h-10 rounded w-full"
              placeholder="Ngày kết thúc"
            />
          </div>
       </div>
             {/* Transactions Table */}
      <TransactionsTable
        onDeleteTransaction={handleDeleteTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        transactions={transactionList}
      />
      </div>



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
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
        />
      </CustomModal>
    </div>
  );
};

export default Transactions;
