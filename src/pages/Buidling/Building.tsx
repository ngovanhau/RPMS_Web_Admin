import BuildingInfo from "./Components/BuildingInfo";
import {
  getAllBuildings,
  getBuildingById,
  deleteBuilding,
} from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import React, { useEffect, useState, useCallback } from "react";

const DashBoardBuilding: React.FC = () => {
  const buildings = useBuildingStore((state) => state.buildings);
  const setBuilding = useBuildingStore((state) => state.setBuilding);

  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectBuilding = async (id: string) => {
    try {
      setLoading(true);
      await getBuildingById(id);
      setSelectedBuildingId(id);
    } catch (err) {
      setError("Failed to fetch building details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialBuilding = async () => {
      if (selectedBuildingId === null && buildings.length > 0) {
        try {
          setLoading(true);
          const firstBuildingId = buildings[0].id;
          await getBuildingById(firstBuildingId);
          setSelectedBuildingId(firstBuildingId);
        } catch (err) {
          setError("Failed to fetch initial building");
        } finally {
          setLoading(false);
        }
      }
    };
    loadInitialBuilding();
  }, [buildings, selectedBuildingId, setBuilding]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        await getAllBuildings();
      } catch (err) {
        setError("Failed to load buildings");
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  const handleDeleteBuilding = async () => {
    if (!selectedBuildingId) return;
    try {
      setLoading(true);
      const response = await deleteBuilding(selectedBuildingId);
      if (response.data.isSuccess) {
        await getAllBuildings();
        if (buildings.length > 1) {
          const firstBuildingId = buildings[0].id;
          setSelectedBuildingId(firstBuildingId);
          await handleSelectBuilding(firstBuildingId);
        } else {
          setSelectedBuildingId(null);
          useBuildingStore.getState().clearBuilding();
        }
      }
    } catch (err) {
      setError("Failed to delete building");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-200 w-full overflow-y-hidden">
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b-b bg-white w-full">
        {/* Search bar with placeholder */}
        <input
          className="w-full border-none focus:outline-none text-sm"
          placeholder="Tìm kiếm bằng tên tòa nhà"
        />
      </div>

      <div className="flex h-[95%] flex-row justify-between bg-gray-200 p-4">
        <div className="w-[24%] h-full rounded-l-[8px] flex flex-col bg-white">
          <div className="flex-1 w-full h-full overflow-y-scroll scrollbar-hide">
            {buildings.map((building) => (
              <BuildingInfo
                onSelect={() => handleSelectBuilding(building.id)}
                isSelected={selectedBuildingId === building.id}
                key={building.id}
                building={building}
              />
            ))}
          </div>
        </div>

        <div className="w-[75%] h-full flex-col rounded-[8px] bg-white overflow-hidden">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="h-[75px] items-center flex flex-row w-full px-3">
              <div className="w-[5%]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.4537 0.0937251C18.5443 0.149718 18.619 0.227907 18.6709 0.320879C18.7227 0.413851 18.7499 0.518524 18.75 0.624975V19.375C18.75 19.5407 18.6842 19.6997 18.5669 19.8169C18.4497 19.9341 18.2908 20 18.125 20H14.375C14.2092 20 14.0503 19.9341 13.9331 19.8169C13.8158 19.6997 13.75 19.5407 13.75 19.375V17.5H12.5V19.375C12.5 19.5407 12.4342 19.6997 12.3169 19.8169C12.1997 19.9341 12.0408 20 11.875 20H0.625C0.45924 20 0.300269 19.9341 0.183058 19.8169C0.065848 19.6997 0 19.5407 0 19.375V12.5C9.95584e-05 12.3689 0.0414351 12.2411 0.118156 12.1348C0.194877 12.0284 0.303098 11.9489 0.4275 11.9075L7.5 9.54997V5.62497C7.5 5.509 7.53228 5.39532 7.5932 5.29664C7.65413 5.19796 7.74132 5.11818 7.845 5.06622L17.845 0.0662251C17.9404 0.0184824 18.0464 -0.00405469 18.153 0.00075892C18.2595 0.00557253 18.3631 0.0375767 18.4537 0.0937251V0.0937251ZM7.5 10.8675L1.25 12.95V18.75H7.5V10.8675ZM8.75 18.75H11.25V16.875C11.25 16.7092 11.3158 16.5502 11.4331 16.433C11.5503 16.3158 11.7092 16.25 11.875 16.25H14.375C14.5408 16.25 14.6997 16.3158 14.8169 16.433C14.9342 16.5502 15 16.7092 15 16.875V18.75H17.5V1.63623L8.75 6.01122V18.75Z"
                    fill="#c2cfe0"
                  ></path>
                  <path
                    d="M2.5 13.75H3.75V15H2.5V13.75ZM5 13.75H6.25V15H5V13.75ZM2.5 16.25H3.75V17.5H2.5V16.25ZM5 16.25H6.25V17.5H5V16.25ZM10 11.25H11.25V12.5H10V11.25ZM12.5 11.25H13.75V12.5H12.5V11.25ZM10 13.75H11.25V15H10V13.75ZM12.5 13.75H13.75V15H12.5V13.75ZM15 11.25H16.25V12.5H15V11.25ZM15 13.75H16.25V15H15V13.75ZM10 8.75H11.25V10H10V8.75ZM12.5 8.75H13.75V10H12.5V8.75ZM15 8.75H16.25V10H15V8.75ZM10 6.25H11.25V7.5H10V6.25ZM12.5 6.25H13.75V7.5H12.5V6.25ZM15 6.25H16.25V7.5H15V6.25ZM15 3.75H16.25V5H15V3.75Z"
                    fill="#c2cfe0"
                  ></path>
                </svg>
              </div>
              <div className="w-[75%] flex flex-col h-full justify-center">
                <span className="text-global-size font-bold text-green-400">
                  {
                    buildings.find((b) => b.id === selectedBuildingId)
                      ?.building_name
                  }
                </span>
                <span className="text-[14px] font-semibold">
                  {buildings.find((b) => b.id === selectedBuildingId)?.address}
                </span>
              </div>
              <div className="w-[20%]  flex flex-row justify-evenly ">
                <button
                  onClick={handleDeleteBuilding}
                  className="bg-red-500 hover:bg-red-600 text-white text-[14px] w-24 py-2 rounded"
                >
                  Xóa
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white text-[14px] w-24 py-2 rounded">
                  Cập nhật
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoardBuilding;
