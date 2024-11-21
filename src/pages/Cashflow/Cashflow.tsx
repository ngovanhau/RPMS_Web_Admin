import React, { useState, useEffect } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import { Building } from "@/types/types";

// Import the OptionSelector and the two components
import Transactions from "./components/Transactions";
import TransactionGroups from "./components/TransactionGroups";
import OptionSelector from "../Deposit/components/OptionSelector";
import { getAllBuildings, getBuildingByUserId } from "@/services/buildingApi/buildingApi";
import { getAllTransaction } from "@/services/transactionApi/transactionApi";

const DashBoardCashFlow: React.FC = () => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const setBuildings = useBuildingStore((state) => state.setBuildings);

  // Options for selector
  const options = ["Giao dịch", "Nhóm giao dịch"];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await getAllTransaction()
      } else if (userData?.role === "MANAGEMENT") {
        await getBuildingByUserId(userData?.id);
        await getAllTransaction()
      }

      if (buildings.length > 0) {
        setSelectedBuildingId(buildings[0].id);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      {/* Header */}
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b bg-white w-full">

      </div>

      {/* Main Content */}
      <div className="flex h-[95%] p-4 overflow-hidden">
        <div className="flex flex-col w-full rounded-[8px] bg-white p-4 space-y-4">
          {/* Option Selector */}
          <OptionSelector
            showBuildingSelector={false}
            options={options}
            selectedOption={selectedOption}
            buildings={buildings}
            onOptionChange={setSelectedOption}
          />

          {/* Conditionally render components based on selectedOption */}
          {selectedOption === "Giao dịch" ? (
            <Transactions
              selectedBuildingId={selectedBuildingId}
              setSelectedBuildingId={setSelectedBuildingId}
            />
          ) : (
            <TransactionGroups />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoardCashFlow;
