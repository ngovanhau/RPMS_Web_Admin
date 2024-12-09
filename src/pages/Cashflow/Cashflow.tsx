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
import { getAllTransaction, getTransactionByBuildingId } from "@/services/transactionApi/transactionApi";
import { Bell } from "lucide-react";

const DashBoardCashFlow: React.FC = () => {
  const buildings = useBuildingStore((state) => state.buildings);

  // Options for selector
  const options = ["Giao dịch", "Nhóm giao dịch"];
  const [selectedOption, setSelectedOption] = useState(options[0]);


  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      {/* Header */}
      <div className="h-[5%] flex flex-row px-10 gap-4 items-center justify-end border-b bg-white w-full">
      <Bell className="w-6 h-6 text-themeColor cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex h-[95%] p-4 overflow-hidden">
        <div className="flex flex-col w-full rounded-[8px] bg-white p-4 pt-4 space-y-4">
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
