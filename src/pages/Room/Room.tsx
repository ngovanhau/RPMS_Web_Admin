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
  getBuildingByUserId,
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
import { Building, Contract, Room } from "@/types/types";
import { formatNumber, sortBuildingsByName } from "@/config/config";
import RoomCard from "@/components/RoomCard/RoomCard";
import { getRoomById } from "@/services/buildingApi/buildingApi";
import EditRoomForm from "./components/EditRoomForm";
import { FaBuilding, FaDollarSign, FaHome, FaUser } from "react-icons/fa";
import useAuthStore from "@/stores/userStore";
import {
  getPermissionById,
  getUserByBuildingId,
} from "@/services/accountApi/accountApi";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons from react-icons
import { getContractByBuildingId } from "@/services/contractApi/contractApi";
import useContractStore from "@/stores/contractStore";
import ContractItem from "./components/DetailContractComponent";
import Viewer from "react-viewer";
import { MdApartment, MdAddBox, MdArrowForward } from "react-icons/md"; // Import biểu tượng từ React Icons
import RoomDetails from "./components/RoomDetails";

const DashBoardRoom: React.FC = () => {
  const userInfo = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const building = useBuildingStore((state) => state.building);
  const roomList = useBuildingStore((state) => state.roomList);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const room = useBuildingStore((state) => state.room);
  const contractList = useContractStore((state) => state.contracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [isOpenRoomForm, setIsOpenRoomForm] = useState(false);
  const [isOpenCreateRoomForm, setIsOpenCreateRoomForm] = useState(false);
  const [visible, setVisible] = useState(false); // Xử lý trạng thái hiển thị ảnh lớn
  const [currentIndex, setCurrentIndex] = useState(0); // Lưu chỉ số ảnh hiện tại

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
      await getContractByBuildingId(id);
      setOpen(false);
    } catch (err) {
      setError("Failed to fetch building details");
    }
  };

  const handleClickRoomCard = async (roomId: string) => {
    try {
      setSelectedContract(null);
      setSelectedRoomId(roomId);
      await getRoomById(roomId);

      const foundContract = contractList.find(
        (contract) => contract.roomId === roomId
      );

      if (foundContract) {
        setSelectedContract(foundContract);
      } else {
        console.log("No contract found for this room");
      }
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
        if (userInfo?.role === "ADMIN") {
          await getAllBuildings();
          setSelectedBuildingId(buildings[0].id);
          await getBuildingById(buildings[0].id);
          await getRoomByBuildingId(buildings[0].id);
        } else {
          if (userInfo) {
            await getBuildingByUserId(userInfo.id);
          }
        }
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
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b-b bg-white w-full"></div>
      <div className="flex h-[95%] flex-row justify-between bg-gray-200 p-4 ">
        <div className="w-[24%] h-full rounded-[8px] overflow-hidden flex flex-col bg-white">
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
                    <span className="text-themeColor">
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
              className="h-12 rounded-xl w-[90%] cursor-pointer bg-themeColor flex justify-center items-center"
            >
              <span className="text-sm text-white font-semibold">
                Thêm phòng
              </span>
            </div>
          </div>
        </div>

        <div className="w-[75%] h-full flex-col rounded-[8px]  overflow-hidden">
          {error ? (
            // <div className="text-red-500">{error}</div>
            <></>
          ) : (
            <div className="h-[75px] items-center flex flex-row rounded-[8px] w-full px-3 bg-white">
              <div className="w-[5%]">
                <MdApartment className="text-[#001eb4] text-4xl" />{" "}
              </div>
              <div className="w-[75%] flex flex-col h-full justify-center">
                <span className="text-global-size font-bold text-themeColor">
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
                  className="bg-themeColor hover:bg-themeColor text-white text-[14px] w-24 py-2 rounded"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          )}
          <div className="h-[70px] items-center justify-between flex flex-row w-full  mt-2 rounded-[8px] overflow-hidden">
            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <FaHome size={30} color="#001eb4" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                {/* <span className="text-themeColor font-bold">Phòng</span> */}
                <span className="text-global font-semibold">
                  {room?.room_name}
                </span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <FaUser className="text-[#001eb4] text-3xl" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-themeColor font-bold">Người thuê</span>
                <span className="text-global">
                  {room?.status == 0 ? room?.renter : "1"}
                </span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center  ">
                <MdApartment className="text-[#001eb4] text-3xl" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-themeColor font-bold">Diện tích</span>
                <span className="text-global ">{room?.acreage} m²</span>
              </div>
              <div className="w-1/4 "></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center">
                <FaDollarSign size={24} color="#001eb4" />
              </div>
              <div className="w-2/4 flex justify-center pl-4 items-start flex-col h-full">
                <span className="text-themeColor font-bold">Chi phí thuê</span>
                <span className="text-global text-sm">{room?.room_price}</span>
              </div>
              <div className="w-1/4"></div>
            </div>

            <div className="h-full w-[18%] bg-white flex flex-row justify-center items-center rounded-[8px] overflow-hidden">
              <div className="w-1/4 h-full flex justify-center items-center">
                <FaHome size={30} color="#001eb4" />
              </div>
              <div className="w-3/4 flex justify-center pl-4 items-start flex-col h-full ">
                <span className="text-themeColor font-bold">Tầng</span>
                <span className="text-global">{room?.floor}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-row justify-between h-full  mt-2 rounded-[8px]  overflow-hidden">
            {room ? <RoomDetails room={room} /> :     <div className="h-[900px] w-full md:w-[59%] flex-col overflow-scroll p-4 flex justify-center items-center pb-[20%] bg-white rounded-lg">
              Chưa có thông tin</div>}

            <div className="h-[850px] w-[38.5%] flex-col bg-white rounded-[8px] overflow-scroll">
              {selectedContract ? (
                <ContractItem contract={selectedContract} />
              ) : (
                <div className="p-2 w-full">
                  <div className="h-full py-4 border-2 flex justify-center items-center rounded-[8px] border-themeColor hover:border-blue-200 transition-all duration-200">
                    <p>Phòng này chưa có hợp đồng.</p>
                  </div>
                </div>
              )}

              {/* Kiểm tra và hiển thị ảnh của phòng */}
              {room && room.imageUrls && room.imageUrls.length > 0 ? (
                <>
                  {/* Hiển thị Viewer nếu ảnh được chọn */}
                  <Viewer
                    visible={visible}
                    onClose={() => setVisible(false)}
                    images={room.imageUrls.map((url) => ({
                      src: url,
                      alt: "",
                    }))}
                    activeIndex={currentIndex}
                  />

                  {/* Grid ảnh: mỗi hàng 2 ảnh */}
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {room.imageUrls.map((url, index) => (
                      <div key={index} className="overflow-hidden rounded-lg">
                        <img
                          src={url}
                          alt={`room-image-${index}`}
                          onClick={() => {
                            setCurrentIndex(index);
                            setVisible(true);
                          }}
                          className="w-full cursor-pointer transition-transform transform hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="h-[100px]"></div>
                </>
              ) : (
                <div className="p-2 w-full">
                  <div className="h-full py-4 border-2 flex justify-center items-center rounded-[8px] border-themeColor hover:border-blue-200 transition-all duration-200">
                    <p>Phòng này chưa có ảnh.</p>
                  </div>
                </div>
              )}
            </div>
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
        onSubmit={handleCreateRoom}
        isOpen={isOpenCreateRoomForm}
        onClose={() => setIsOpenCreateRoomForm(false)}
      />
    </div>
  );
};

export default DashBoardRoom;
