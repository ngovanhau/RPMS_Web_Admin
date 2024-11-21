import React, { useState, useEffect } from "react";
import { Room } from "@/types/types";
import { getRoomByBuildingId } from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import TransactionsTable from "./TransactionTable"; // Import TransactionsTable
import useTransactionStore from "@/stores/transactionStore";

interface TransactionsProps {
  selectedBuildingId: string | null;
  setSelectedBuildingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Transactions: React.FC<TransactionsProps> = ({
  selectedBuildingId,
  setSelectedBuildingId,
}) => {
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const setRooms = useBuildingStore((state) => state.setRooms);
  const transactionList = useTransactionStore((state) => state.transactions); // Fetch transactions from store

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchRooms = async (buildingId: string) => {
    try {
      await getRoomByBuildingId(buildingId);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleBuildingSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const buildingId = event.target.value;
    setSelectedBuildingId(buildingId);
    if (buildingId) fetchRooms(buildingId);
  };

  useEffect(() => {
    if (selectedBuildingId) {
      fetchRooms(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  return (
    <div>
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
            {rooms.map((room) => (
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

      {/* Pagination (optional) */}
      {/* <div className="flex items-center gap-2 mt-4">
        <span>Hiển thị tối đa</span>
        <select className="border rounded p-1">
          <option>20</option>
        </select>
        <span>trên tổng số 1 kết quả</span>
      </div> */}
    </div>
  );
};

export default Transactions;
