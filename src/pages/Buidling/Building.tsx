// DashBoardBuilding.tsx
import BuildingInfo from "./Components/BuildingInfo";
import {
  getAllBuildings,
  getBuildingById,
  deleteBuilding,
  editBuilding,
  addBuilding
  // createBuilding, // Import the createBuilding function
} from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import React, { useEffect, useState } from "react";
import BuildingForm from "./Components/BuildingForm";
import CreateBuildingForm from "./Components/CreateBuildingForm"; // Import the new component
import Spinner from "@/components/Spinner/Spinner";
import { Building } from "@/types/types";

const DashBoardBuilding: React.FC = () => {
  const buildings = useBuildingStore((state) => state.buildings);
  const building = useBuildingStore((state) => state.building);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpenBuildingForm, setIsOpenBuildingForm] = useState(false);
  const [isOpenCreateBuildingForm, setIsOpenCreateBuildingForm] = useState(
    false
  ); // New state for create form

  const handleOpenUpdateBuildingForm = () => {
    setIsOpenBuildingForm(true);
  };

  // Open the create building form
  const handleOpenCreateBuildingForm = () => {
    setIsOpenCreateBuildingForm(true);
  };

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

  const handleSubmitBuilding = async (building: Building) => {
    await editBuilding(building);
    await getAllBuildings();
    setIsOpenBuildingForm(false); // Close the form after submission
  };

  // Handle submission of new building
  const handleCreateBuilding = async (building: Building) => {
    try {
      setLoading(true);
      // console.log(building);
      const response = await addBuilding(building)
      await getAllBuildings();
      setIsOpenCreateBuildingForm(false);
    } catch (err) {
      setError("Failed to create building");
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
          <div className="h-[90%]  w-full overflow-y-scroll scrollbar-hide border-b">
            {buildings.map((building) => (
              <BuildingInfo
                onSelect={() => handleSelectBuilding(building.id)}
                isSelected={selectedBuildingId === building.id}
                key={building.id}
                building={building}
              />
            ))}
          </div>
          <div className="h-[10%] w-full flex justify-center items-center">
            <div
              onClick={handleOpenCreateBuildingForm}
              className="h-12 rounded-xl w-[90%] cursor-pointer bg-green-400 flex justify-center items-center"
            >
              <span className="text-sm text-white font-semibold">
                Thêm tòa nhà
              </span>
            </div>
          </div>
        </div>

        <div className="w-[75%] h-full flex-col rounded-[8px] bg-white overflow-hidden">
          {loading ? (
            <div className="h-full w-full flex  justify-center items-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="h-[75px] items-center flex flex-row w-full px-3">
              <div className="w-[5%]">
                {/* SVG Icon */}
              </div>
              <div className="w-[75%] flex flex-col h-full justify-center">
                <span className="text-global-size font-bold text-green-400">
                  {
                    buildings.find((b) => b.id === selectedBuildingId)
                      ?.building_name
                  }
                </span>
                <span className="text-[14px] font-semibold">
                  {
                    buildings.find((b) => b.id === selectedBuildingId)
                      ?.address
                  }
                </span>
              </div>
              <div className="w-[20%]  flex flex-row justify-evenly ">
                <button
                  onClick={handleDeleteBuilding}
                  className="bg-red-500 hover:bg-red-600 text-white text-[14px] w-24 py-2 rounded"
                >
                  Xóa
                </button>
                <button
                  onClick={handleOpenUpdateBuildingForm}
                  className="bg-green-500 hover:bg-green-600 text-white text-[14px] w-24 py-2 rounded"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <BuildingForm
        onSubmit={handleSubmitBuilding}
        building={building}
        isOpen={isOpenBuildingForm}
        onClose={() => setIsOpenBuildingForm(false)}
      />
      <CreateBuildingForm
        onSubmit={handleCreateBuilding}
        isOpen={isOpenCreateBuildingForm}
        onClose={() => setIsOpenCreateBuildingForm(false)}
      />
    </div>
  );
};

export default DashBoardBuilding;
