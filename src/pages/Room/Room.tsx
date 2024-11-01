// DashBoardRoom.tsx
import BuildingInfo from "../Buidling/Components/BuildingInfo";
import {
  getAllBuildings,
  getBuildingById,
  deleteBuilding,
  editBuilding,
  addBuilding,
  getRoomByBuildingId,
  deleteRoom,
  addRoom,
  editRoom,
} from "@/services/buildingApi/buildingApi";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBuildingStore } from "@/stores/buildingStore";
import React, { useEffect, useState } from "react";
import BuildingForm from "../Buidling/Components/BuildingForm";
import CreateRoomForm from "../Room/components/CreateRoomForm";
import { Building, Room } from "@/types/types";
import { sortBuildingsByName } from "@/config/config";
import RoomCard from "@/components/RoomCard/RoomCard";
import { getRoomById } from "@/services/buildingApi/buildingApi";
import EditRoomForm from "./components/EditRoomForm";

const DashBoardRoom: React.FC = () => {
  const buildings = useBuildingStore((state) => state.buildings);
  const building = useBuildingStore((state) => state.building);
  const roomList = useBuildingStore((state) => state.roomList);
  console.log(roomList);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const room = useBuildingStore((state) => state.room);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [isOpenRoomForm, setIsOpenRoomForm] = useState(false);
  const [isOpenCreateRoomForm, setIsOpenCreateRoomForm] = useState(false);

  const handleOpenUpdateRoomForm = () => {
    setIsOpenRoomForm(true);
  };

  const handleOpenCreateRoomForm = () => {
    setIsOpenCreateRoomForm(true);
  };

  const handleSelectBuilding = async (id: string) => {
    try {
      setSelectedBuildingId(id);
      await getBuildingById(id);
      await getRoomByBuildingId(id);
      setOpen(false);
    } catch (err) {
      setError("Failed to fetch building details");
    }
  };

  const handleClickRoomCard = async (roomId: string) => {
    try {
      setSelectedRoomId(roomId);
      await getRoomById(roomId);
    } catch (error) {
      setError("Failed to fetch room");
    }
  };

  const handleSubmitRoom = async (room: Room) => {
    try {
      await editRoom(room);
      await getRoomByBuildingId(selectedBuildingId);
      setIsOpenRoomForm(false);
    } catch (err) {
      setError("Failed to update building");
    }
  };

  const handleCreateRoom = async (room: Room) => {
    try {
      console.log("Data room tạo nè : ", room);
      await addRoom(room);
      await getRoomByBuildingId(selectedBuildingId);
      setIsOpenCreateRoomForm(false);
    } catch (err) {
      setError("Failed to create room");
    }
  };

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await getAllBuildings();
        const buildingsData = sortBuildingsByName(response.data.data);
        setSelectedBuildingId(buildingsData[0].id);
        await getBuildingById(buildingsData[0].id);
        await getRoomByBuildingId(buildingsData[0].id);
      } catch (err) {
        setError("Failed to load buildings");
      }
    };
    fetchBuildings();
  }, []);

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;
    try {
      const response = await deleteRoom(selectedRoomId);
      if (response.data.isSuccess) {
        await getRoomByBuildingId(selectedBuildingId);
        if (roomList.length > 0) {
          const firstRoomId = roomList[0].id;
          setSelectedRoomId(firstRoomId);
          await handleClickRoomCard(roomList[0].id);
        } else {
          setSelectedRoomId(null);
          useBuildingStore.getState().clearRoom();
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
          <div className="h-[90%] relative  w-full overflow-y-scroll scrollbar-hide border-b">
            <div className="flex absolute top-0 left-0 w-full">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-[60px] border-gray-200 bg-white justify-between"
                  >
                    <span className="text-green-400">
                      {selectedBuildingId
                        ? buildings.find(
                            (building) => building.id === selectedBuildingId
                          )?.building_name
                        : "Select building..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] bg-white p-0">
                  <Command>
                    <CommandInput placeholder="Search building..." />
                    <CommandList>
                      <CommandEmpty>No building found.</CommandEmpty>
                      <CommandGroup>
                        {buildings.map((building) => (
                          <CommandItem
                            className={cn("w-full bg-white")}
                            key={building.id}
                            value={building.id}
                            onSelect={() => handleSelectBuilding(building.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedBuildingId === building.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {building.building_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col w-full mt-[60px]">
              {roomList.length > 0 ? (
                roomList.map((room, index) => (
                  <RoomCard
                    onSelect={() => handleClickRoomCard(room.id)}
                    key={index}
                    room={room}
                  />
                ))
              ) : (
                <div className="flex h-[350px]  justify-center items-end  w-full ">
                  <span className="text-sm font-semibold text-gray-700">
                    Chưa có room nào
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="h-[10%] w-full flex justify-center items-center">
            <div
              onClick={handleOpenCreateRoomForm}
              className="h-12 rounded-xl w-[90%] cursor-pointer bg-green-400 flex justify-center items-center"
            >
              <span className="text-sm text-white font-semibold">
                Thêm phòng
              </span>
            </div>
          </div>
        </div>

        <div className="w-[75%] h-full flex-col rounded-[8px]  overflow-hidden">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="h-[75px] items-center flex flex-row rounded-[8px] w-full px-3 bg-white">
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
                    fill="#04c45c"
                  ></path>
                  <path
                    d="M2.5 13.75H3.75V15H2.5V13.75ZM5 13.75H6.25V15H5V13.75ZM2.5 16.25H3.75V17.5H2.5V16.25ZM5 16.25H6.25V17.5H5V16.25ZM10 11.25H11.25V12.5H10V11.25ZM12.5 11.25H13.75V12.5H12.5V11.25ZM10 13.75H11.25V15H10V13.75ZM12.5 13.75H13.75V15H12.5V13.75ZM15 11.25H16.25V12.5H15V11.25ZM15 13.75H16.25V15H15V13.75ZM10 8.75H11.25V10H10V8.75ZM12.5 8.75H13.75V10H12.5V8.75ZM15 8.75H16.25V10H15V8.75ZM10 6.25H11.25V7.5H10V6.25ZM12.5 6.25H13.75V7.5H12.5V6.25ZM15 6.25H16.25V7.5H15V6.25ZM15 3.75H16.25V5H15V3.75Z"
                    fill="#04c45c"
                  ></path>
                </svg>
              </div>
              <div className="w-[75%] flex flex-col h-full justify-center">
                <span className="text-global-size font-bold text-green-400">
                  {room?.room_name}
                </span>
                <span className="text-[14px] font-semibold">
                  {buildings.find((b) => b.id === selectedBuildingId)?.address}
                </span>
              </div>
              <div className="w-[20%]  flex flex-row justify-evenly ">
                <button
                  onClick={handleDeleteRoom}
                  className="bg-red-500 hover:bg-red-600 text-white text-[14px] w-24 py-2 rounded"
                >
                  Xóa
                </button>
                <button
                  onClick={handleOpenUpdateRoomForm}
                  className="bg-green-500 hover:bg-green-600 text-white text-[14px] w-24 py-2 rounded"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          )}
          <div className="h-[70px] items-center justify-between flex flex-row w-full  mt-2 rounded-[8px] overflow-hidden">
            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#22c55e"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Phòng</span>
                <span className="text-global font-semibold">
                  {room?.room_name}
                </span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#22c55e"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Người thuê</span>
                <span className="text-global ">{room?.renter}</span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#22c55e"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Diện tích</span>
                <span className="text-global ">{room?.acreage} m²</span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#22c55e"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">
                  Chi phí thuê
                </span>
                <span className="text-global ">{room?.room_price} VND</span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#22c55e"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
              <div className="w-3/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-global-green font-bold">Quản lý</span>
                <span className="text-global">Phạm Văn Hoàng</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-row justify-between h-full  mt-2 rounded-[8px]  overflow-hidden">
            <div className=" h-full max-h-[760px] w-[59%] flex-col  overflow-y-scroll p-4  bg-white">
              <span className="text-global font-semibold">Dịch vụ có phí</span>
              <div className="flex flex-row rounded-[8px] flex-wrap overflow-hidden mt-2">
                {room?.roomservice && room.roomservice.length > 0 ? (
                  room.roomservice.map((service) => (
                    <div className="flex items-center mr-4 justify-center h-[70px] rounded-[8px] border-2 border-green-400 px-4 bg-white shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10">
                          <img
                            className="h-8 w-8"
                            src="https://as1.ftcdn.net/jpg/01/40/62/16/500_F_140621690_lCjpTdvOoqdovvUlh89F5FM1gODHMIdx.jpg"
                          />
                        </div>
                        <div>
                          <div className="text-gray-700 font-semibold text-sm">
                            {service.serviceName}
                          </div>
                          <div className="text-red-500 text-sm">3.500/Kwh</div>
                        </div>
                      </div>
                    </div>
                  ))
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
              <div className="flex flex-col">
                <span className="text-global mt-4 font-semibold">Mô tả</span>
                <span className="text-gray-700 text-sm mt-2">
                  {room?.describe}
                </span>

                <span className="text-global mt-4 font-semibold">Lưu ý</span>
                <span className="text-gray-700 text-sm mt-2">
                  {room?.note}
                </span>
              </div>
              <div className="h-[300px]"></div>
            </div>

            <div className="h-full w-[38.5%] bg-white rounded-[8px]  overflow-hidden "></div>
          </div>
        </div>
      </div>
      <EditRoomForm
        room={room}
        onSubmit={handleSubmitRoom}
        building={building}
        isOpen={isOpenRoomForm}
        onClose={() => setIsOpenRoomForm(false)}
      />
      <CreateRoomForm
        building={building}
        onSubmit={handleCreateRoom}
        isOpen={isOpenCreateRoomForm}
        onClose={() => setIsOpenCreateRoomForm(false)}
      />
    </div>
  );
};

export default DashBoardRoom;
