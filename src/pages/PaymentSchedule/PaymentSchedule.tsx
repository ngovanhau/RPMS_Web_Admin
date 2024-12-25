import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import moment from "moment";
import {
  getAllBuildings,
  getBuildingByUserId,
  getRoomByBuildingId,
} from "@/services/buildingApi/buildingApi";
import { Building, Room, PaymentScheduleType } from "@/types/types";
import {
  getAllBillByStatus,
  getBillByBuildingIdAndStatus,
  getBillByRoomIdAndStatus,
} from "@/services/transactionApi/transactionApi";
import useBillStore from "@/stores/invoiceStore";
import TextField from "@mui/material/TextField"; // Import TextField
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getAllPaymentSchedule,
  getPaymentScheduleByBuildingId,
  getPaymentScheduleByRoomId,
} from "@/services/paymentScheduleApi/paymentScheduleApi";
import usePaymentScheduleStore from "@/stores/paymentSchedule";

const PaymentSchedule: React.FC = () => {
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const bills = useBillStore((state) => state.bills);
  const paymentScheduleList = usePaymentScheduleStore(
    (state) => state.schedules
  );
  const [selectedBuildingId, setSelectedBuildingId] = useState<
    string | undefined
  >(undefined);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredSchedules = paymentScheduleList.filter((schedule) =>
    schedule.roomname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSchedules.slice(startIndex, endIndex);
  const emptyRows = itemsPerPage - currentItems.length;

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await getAllPaymentSchedule();
      } else if (userData?.role === "MANAGEMENT") {
        const response = await getBuildingByUserId(userData?.id);
        if (response.data.isSuccess && response.data.data.length > 0) {
          const firstBuilding = response.data.data[0];
          setSelectedBuildingId(firstBuilding.id);
          await handleChangeBuilding({
            target: { value: firstBuilding.id },
          } as SelectChangeEvent);
        }
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleChangeBuilding = async (event: SelectChangeEvent) => {
    setSelectedBuildingId(event.target.value as string);
    await getRoomByBuildingId(event.target.value);
    // await getBillByBuildingIdAndStatus(event.target.value, 0)
  };

  const handleChangeRoom = async (event: SelectChangeEvent) => {
    setSelectedRoomId(event.target.value as string);
    // await getBillByRoomIdAndStatus(event.target.value, 0)
  };

  useEffect(() => {
    if (selectedBuildingId) getPaymentScheduleByBuildingId(selectedBuildingId);
  }, [selectedBuildingId]);
  useEffect(() => {
    if (selectedRoomId) getPaymentScheduleByRoomId(selectedRoomId, 0);
  }, [selectedRoomId]);
  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="flex flex-col h-[100%] bg-gray-100  w-full overflow-y-hidden">
      <div className="flex h-[100%] p-6 overflow-hidden">
        <div className="flex flex-1 rounded-[8px] flex-col py-8 px-8 w-full bg-white gap-6">
          <div className="w-full flex-row flex">
            <span className="text-themeColor font-semibold">
              Lịch thanh toán
            </span>
          </div>
          <div className="w-full flex-row flex justify-between">
            <div className="w-[30%]">
              <FormControl fullWidth>
                <InputLabel id="select-building">Chọn tòa nhà</InputLabel>
                <Select
                  labelId="select-building"
                  id="select-building"
                  value={selectedBuildingId || ""}
                  label="Chọn tòa nhà"
                  onChange={handleChangeBuilding}
                >
                  {buildings && buildings.length > 0 ? (
                    buildings.map((building: Building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.building_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      Không có tòa nhà
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>
            {/* Tìm kiếm theo roomname */}

            <div className="w-[30%]">
              <TextField
                fullWidth
                variant="outlined"
                label="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          {/* table */}
          <div className="flex h-[75%] w-full">
            <table className="w-full">
              <thead className="h-[10%] bg-themeColor text-white">
                <tr>
                  <th className="border-2 border-gray-300">Tên phòng</th>
                  {/* <th className="border-2 border-gray-300">Tòa nhà</th> */}
                  <th className="border-2 border-gray-300">Ngày thanh toán</th>
                  <th className="border-2 border-gray-300">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((schedule) => (
                    <tr key={schedule.roomId} className="h-[10%]">
                      <td className="border-2 text-black border-gray-300 text-center">
                        {schedule.roomname}
                      </td>
                      <td className="border-2 text-black border-gray-300 text-center">
                        {moment(schedule.billingStartDate).format("DD/MM/YYYY")}
                      </td>
                      <td className="border-2 text-black border-gray-300 text-center">
                        {schedule.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      Không tìm thấy kết quả
                    </td>
                  </tr>
                )}
                {emptyRows > 0 &&
                  Array.from({ length: emptyRows }).map((_, index) => (
                    <tr key={`empty-${index}`} className="h-[10%] ">
                      <td className="">&nbsp;</td>
                      <td className="">&nbsp;</td>
                      <td className="">&nbsp;</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex h-[10%] w-full">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
