import React, { useState, useEffect } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import { Building } from "@/types/types";

// Import the OptionSelector and the two components
import Transactions from "./components/Transactions";
import TransactionGroups from "../TransactionGroup/TransactionGroups";
import OptionSelector from "../Deposit/components/OptionSelector";
import { getAllBuildings, getBuildingByUserId } from "@/services/buildingApi/buildingApi";
import { getAllTransaction, getTransactionByBuildingId } from "@/services/transactionApi/transactionApi";
import { Bell } from "lucide-react";

const DashBoardCashFlow: React.FC = () => {
  const buildings = useBuildingStore((state) => state.buildings);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      {/* Main Content */}
      <div className="flex h-[100%] p-6 overflow-hidden">
        <div className="flex flex-1 flex-col py-4 px-4 rounded-[8px] w-full">
            <Transactions/>
        </div>
      </div>
    </div>
  );
};

export default DashBoardCashFlow;
