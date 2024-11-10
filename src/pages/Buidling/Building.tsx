// DashBoardBuilding.tsx
import BuildingInfo from "./Components/BuildingInfo";
import {
  getAllBuildings,
  getBuildingById,
  deleteBuilding,
  editBuilding,
  addBuilding,
  getRoomByBuildingId,
} from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import React, { useEffect, useState } from "react";
import BuildingForm from "./Components/BuildingForm";
import CreateBuildingForm from "./Components/CreateBuildingForm";
import { Building, User } from "@/types/types";
import { sortBuildingsByName } from "@/config/config";
import RoomCard from "@/components/RoomCard/RoomCard";
import useServiceStore from "@/stores/servicesStore";
import { getallService } from "@/services/servicesApi/servicesApi";
import { getBuildingByUserId } from "@/services/buildingApi/buildingApi";
import {
  FaHome,
  FaBuilding,
  FaTrash,
  FaEdit,
  FaBed,
  FaDollarSign,
  FaUserTie,
  FaMapMarkerAlt,
  FaLayerGroup,
} from "react-icons/fa";
import useAccountStore from "@/stores/accountStore";
import useAuthStore from "@/stores/userStore";
import { information } from "@/services/userApi/userApi";

const DashBoardBuilding: React.FC = () => {
  const buildings = useBuildingStore((state) => state.buildings);
  const building = useBuildingStore((state) => state.building);
  const serviceList = useServiceStore((state) => state.services);
  const roomList = useBuildingStore((state) => state.roomList);
  const userData = useAuthStore((state) => state.userData);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isOpenBuildingForm, setIsOpenBuildingForm] = useState(false);
  const [isOpenCreateBuildingForm, setIsOpenCreateBuildingForm] =
    useState(false);


  const fetchBuildings = async () => {
    try {
      if (userData?.username) {
        const response =
          userData?.role === "ADMIN"
            ? await getAllBuildings()
            : await getBuildingByUserId(userData?.id || ""); // Ensure userId is not undefined

        const buildingsData = sortBuildingsByName(response.data.data);
        setSelectedBuildingId(buildingsData[0].id);

        await getBuildingById(buildingsData[0].id);
        await getRoomByBuildingId(buildingsData[0].id);
        await getallService();
      } else {
        throw new Error("User data or username is missing");
      }
    } catch (err) {
      setError("Failed to load buildings");
    }
  };

  
  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleOpenUpdateBuildingForm = () => {
    setIsOpenBuildingForm(true);
  };

  const handleOpenCreateBuildingForm = () => {
    setIsOpenCreateBuildingForm(true);
  };

  const handleSelectBuilding = async (id: string) => {
    try {
      setSelectedBuildingId(id);
      await getBuildingById(id);
      await getRoomByBuildingId(id);
    } catch (err) {
      setError("Failed to fetch building details");
    }
  };

  const handleSubmitBuilding = async (building: Building) => {
    try {
      await editBuilding(building);
      await fetchBuildings();
      await getBuildingById(building.id);
      await getRoomByBuildingId(building.id);
      setIsOpenBuildingForm(false);
    } catch (err) {
      setError("Failed to update building");
    }
  };

  const handleCreateBuilding = async (building: Building) => {
    try {
      await addBuilding(building);
      await fetchBuildings();
      setIsOpenCreateBuildingForm(false);
    } catch (err) {
      setError("Failed to create building");
    }
  };

  const handleDeleteBuilding = async () => {
    if (!selectedBuildingId) return;
    try {
      const response = await deleteBuilding(selectedBuildingId);
      if (response.data.isSuccess) {
        await fetchBuildings();
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

        <div className="w-[75%] h-full flex-col rounded-[8px]  overflow-hidden">
          <div className="h-[75px] items-center flex flex-row rounded-[8px] w-full px-3 bg-white">
            <div className="w-[5%]">
              <FaBuilding size={30} color="#04c45c" />
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
              <button
                onClick={handleOpenUpdateBuildingForm}
                className="bg-green-500 hover:bg-green-600 text-white text-[14px] w-24 py-2 rounded"
              >
                Cập nhật
              </button>
            </div>
          </div>

          <div className="h-[70px] items-center justify-between flex flex-row w-full  mt-2 rounded-[8px] overflow-hidden">
            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <FaHome size={30} color="#22c55e" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Phòng</span>
                <span className="text-global font-semibold">
                  {roomList.length}
                </span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <FaMapMarkerAlt size={30} color="#04c45c" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Địa chỉ</span>
                <span className="text-global ">
                  {buildings.find((b) => b.id === selectedBuildingId)?.address}
                </span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <FaLayerGroup size={30} color="#22c55e" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Số tầng</span>
                <span className="text-global ">
                  {building?.number_of_floors}
                </span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <FaDollarSign size={30} color="#22c55e" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">
                  Chi phí thuê
                </span>
                <span className="text-global ">
                  {building?.rental_costs} VND
                </span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <FaUserTie size={30} color="#22c55e" />
              </div>
              <div className="w-3/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Quản lý</span>
                <span className="text-global">Phạm Văn Hoàng</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-row justify-between h-full  mt-2 rounded-[8px]  overflow-hidden">
            <div className="h-full w-[59%] p-3 pt-4 rounded-[8px] flex flex-col  overflow-hidden bg-white">
              <span className="text-global font-semibold">Dịch vụ có phí</span>
              <div className="flex flex-row rounded-[8px] flex-wrap overflow-hidden mt-2">
                {building?.fee_based_service &&
                building.fee_based_service.length > 0 ? (
                  building.fee_based_service.map((service) => {
                    // Find the matching service in serviceList by comparing IDs
                    const matchedService = serviceList.find(
                      (s) => s.id === service.serviceId
                    );

                    return (
                      <div
                        key={service.serviceId}
                        className="flex items-center mr-4 justify-center h-[70px] rounded-[8px] border-2 border-green-400 px-4 bg-white shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10">
                            <img
                              className="h-8 w-8"
                              src="https://as1.ftcdn.net/jpg/01/40/62/16/500_F_140621690_lCjpTdvOoqdovvUlh89F5FM1gODHMIdx.jpg"
                              alt="Service icon"
                            />
                          </div>
                          <div>
                            <div className="text-gray-700 font-semibold text-sm">
                              {matchedService
                                ? matchedService.service_name
                                : "Unknown Service"}
                            </div>
                            <div className="text-red-500 text-sm">
                              {matchedService
                                ? `${matchedService.service_cost} / ${matchedService.unitMeasure}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-10 w-full flex justify-center items-center">
                    <span className="text-sm text-gray-500">
                      Không có dịch vụ
                    </span>
                  </div>
                )}
              </div>
              <span className="text-global mt-4 font-semibold">
                Tiện ích tòa nhà
              </span>
              <div className="flex flex-row rounded-[8px] flex-wrap overflow-hidden mt-2">
                <button className="px-4 py-1 text-white bg-gray-400 rounded-full text-sm font-medium">
                  Thang máy
                </button>
              </div>

              <span className="text-global mt-4 font-semibold">Mô tả</span>
              <span className="text-gray-700 text-sm mt-2">
                {building?.description}
              </span>

              <span className="text-global mt-4 font-semibold">Lưu ý</span>
              <span className="text-gray-700 text-sm mt-2">
                {building?.advance_notice}
              </span>
            </div>

            <div className="h-full w-[38.5%] bg-white rounded-[8px]  overflow-hidden ">
              {roomList.length > 0 ? (
                roomList.map((room, index) => (
                  <RoomCard key={index} room={room} />
                ))
              ) : (
                <div className="flex h-1/3 justify-center items-end  w-full ">
                  <span className="text-sm font-semibold text-gray-700">
                    Chưa có room nào
                  </span>
                </div>
              )}
            </div>
          </div>
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
