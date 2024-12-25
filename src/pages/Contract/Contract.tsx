import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa"; // Import các icon từ react-icons
import HeaderContractRow from "./components/HeaderContractRow";
import ContractDetailsModal from "./components/ContractDetailModal";
import CustomModal from "@/components/Modal/Modal";
import CreateContractForm from "./components/ContractCreateForm";
import ContractRow from "./components/ContractRow";
import { Contract } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import {
  createContract,
  getAllContract,
  deleteContract,
  getCustomerNoRoom,
  updateContract,
  downloadContractPDF,
  getContractByBuildingId,
  extendContract,
} from "@/services/contractApi/contractApi";
import useContractStore from "@/stores/contractStore";
import EditContractForm from "./components/ContractEditForm";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import {
  getAllBuildings,
  getBuildingByUserId,
} from "@/services/buildingApi/buildingApi";
import { Bell, PlusCircle } from "lucide-react";
import dayjs, { Dayjs } from "dayjs"; // Import dayjs
import Input from "@mui/material/Input";
// Thêm các import cho phân trang và dropdown-menu
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import ExtendContractModal from "./components/ExtendContractModal";
import LiquidationModal from "./components/ContractLiquidation";

const DashBoardContract: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isExtendContractModal, setIsExtendContractModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false); // Separate state for Edit Modal
  const [isContractLiquidationModal, setIsContractLiquidationModal] =
    useState(false);
  const [priceExtendContract, setPriceExtendContract] = useState<number>(0);
  const [endDateExtendContract, setEndDateExtendContract] =
    useState<Date | null>(null);
  const [errorDateExtendContract, setErrorDateExtendContract] =
    useState<string>("");
  const [errorNoteExtendContract, setErrorNoteExtendContract] =
    useState<string>("");
  const [errorPriceExtendContract, setErrorPriceExtendContract] =
    useState<string>("");
  const [noteExtendContract, setNoteExtendContract] = useState<string>("");
  const [editContract, setEditContract] = useState<Contract | null>(null); // Store the contract to be edited
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const contractData = useContractStore((state) => state.contracts);
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const roomList = useBuildingStore((state) => state.roomList);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // Số phần tử mỗi trang

  useEffect(() => {
    fetchInitialData();
  }, []);
  const handleDateChange = (newValue: Date | null) => {
    setEndDateExtendContract(newValue);
  };
  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        await getAllBuildings();
        await getAllContract();
      } else if (userData?.role === "MANAGEMENT") {
        const buildingsData = (await getBuildingByUserId(userData?.id || ""))
          .data.data;
        if (buildingsData.length > 0) {
          setSelectedBuildingId(buildingsData[0].id);
          setBuilding(buildingsData[0]);
          // await getContractByBuildingId(buildingsData[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleSuccessLiquidation = (contract : Contract) => {
    fetchInitialData();
  }

  useEffect(() => {
    if (selectedBuildingId) {
      getContractByBuildingId(selectedBuildingId);
    }
  }, [selectedBuildingId]);

  const handleRowClick = (contract: Contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  const handleCreateContract = async (contract: Contract) => {
    await createContract(contract);
    await getAllContract();
    setIsOpenCreateModal(false);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    setPriceExtendContract(rawValue ? parseInt(rawValue, 10) : 0); // Lưu giá trị dạng số
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?");
    if (confirmed) {
      await deleteContract(id);
      await getAllContract();
    }
  };

  const handlePrint = async (contractId: string) => {
    try {
      const response = await downloadContractPDF(contractId);
      const fileUrl = response.data.downloadLink;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank"; // Mở trong tab mới
      link.rel = "noopener noreferrer"; // Bảo mật cho liên kết mở trong tab mới
      link.click();
    } catch (error) {
      console.error("Error downloading the contract:", error);
    }
  };

  const handleLiquidationContract = async (contract: Contract) => {
    setIsContractLiquidationModal(true);
    setSelectedContract(contract);
  };

  const handleExtendContract = async () => {
    // Reset lỗi trước khi kiểm tra
    setErrorDateExtendContract("");
    setErrorPriceExtendContract("");
    setErrorNoteExtendContract("");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasError = false;

    // Kiểm tra ngày kết thúc hợp đồng
    if (!endDateExtendContract || endDateExtendContract < today) {
      setErrorDateExtendContract(
        "Ngày kết thúc hợp đồng không được nhỏ hơn ngày hiện tại."
      );
      hasError = true;
    }

    // Kiểm tra giá trị tiền thuê
    if (priceExtendContract === 0) {
      setErrorPriceExtendContract(
        "Tiền thuê mới không được để trống hoặc bằng 0."
      );
      hasError = true;
    }

    // Kiểm tra ghi chú
    if (!noteExtendContract.trim()) {
      setErrorNoteExtendContract("Ghi chú không được để trống.");
      hasError = true;
    }

    // Nếu có lỗi, dừng xử lý
    if (hasError) return;

    // Gọi API để gia hạn hợp đồng
    if (selectedContract && endDateExtendContract) {
      const response = await extendContract(
        selectedContract.id,
        priceExtendContract,
        endDateExtendContract,
        noteExtendContract
      );
      if (response.isSuccess) {
        setIsExtendContractModal(false);
        setSelectedContract(null);
        setPriceExtendContract(0);
        setEndDateExtendContract(null);
        setNoteExtendContract("");
        setErrorDateExtendContract("");
        setErrorPriceExtendContract("");
        setErrorNoteExtendContract("");
        fetchInitialData();
      }
    }
  };

  const handleOpenModalExtendContract = async (contractData: Contract) => {
    setIsExtendContractModal(true);
    setSelectedContract(contractData);
  };

  const handleEdit = (contract: Contract) => {
    setEditContract(contract); // Set the contract to be edited
    setIsOpenEditModal(true); // Open the edit modal
  };

  const handleEditContract = async (contract: Contract) => {
    await updateContract(contract);
    await getAllContract(); // Refresh the contract list after saving
    setIsOpenEditModal(false); // Close the modal
  };

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBuildingId(e.target.value);
    const selectedBuilding = buildings.find(
      (building) => building.id === e.target.value
    );
    if (selectedBuilding) {
      setBuilding(selectedBuilding);
    }
  };

  // Xử lý tìm kiếm và phân trang
  const filteredContracts = contractData.filter((contract: Contract) =>
    (contract.customerName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);

  const currentContracts = filteredContracts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Đặt lại trang khi searchTerm hoặc selectedBuildingId thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBuildingId]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
        <div className="flex h-[100%] p-4 overflow-hidden">
          <div className="flex flex-1 rounded-[8px] flex-col py-6 px-4 w-full bg-white">
            <div className="flex flex-row justify-between items-center h-12 mb-4">
              <div className="flex flex-row items-center gap-6">
                <div className="py-1 px-2 rounded-[6px] flex justify-center items-center bg-themeColor">
                  <span className="text-base text-white font-bold">
                    {filteredContracts.length}
                  </span>
                </div>
                <span className="text-sm">
                  {filteredContracts.length} Hợp đồng
                </span>
                {/* Building Selector */}
                <div className="flex items-center gap-4">
                  <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={selectedBuildingId || ""}
                    onChange={handleBuildingChange}
                  >
                    <option value="">Chọn tòa nhà</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.building_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border border-gray-300 rounded shadow w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div
                  onClick={() => setIsOpenCreateModal(true)}
                  className="bg-themeColor flex items-center justify-center gap-2 text-base h-11 text-white py-2 px-4 rounded-[6px] shadow hover:bg-opacity-90 transition duration-300 cursor-pointer"
                  title="Thêm Mới"
                >
                  <PlusCircle className="w-6 h-6 text-white cursor-pointer" />
                  <span>Thêm</span>
                </div>
              </div>
            </div>

            {/* Bảng hiển thị hợp đồng */}
            <div className="w-full rounded-[8px] h-[750px] overflow-hidden">
              <table className="w-full table-fixed border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-themeColor text-white h-12 border-2 border-gray-300">
                    <th className="w-[7%] py-2  px-4 text-left border border-gray-300">
                      Thao tác
                    </th>
                    <th className="w-[20%] py-2 px-4 text-left border border-gray-300">
                      Tên người thuê
                    </th>
                    <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                      Phòng
                    </th>
                    <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                      Ngày bắt đầu
                    </th>
                    <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                      Ngày kết thúc
                    </th>
                    <th className="w-[13%] py-2 px-4 text-left border border-gray-300">
                      Giá thuê phòng
                    </th>
                    <th className="w-[15%] py-2 px-4 text-left border border-gray-300">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentContracts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center text-gray-500 py-4"
                      >
                        Chưa có hợp đồng nào
                      </td>
                    </tr>
                  ) : (
                    currentContracts.map((contract, index) => (
                      <ContractRow
                        key={contract.id}
                        contract={contract}
                        onClick={() => handleRowClick(contract)}
                        onDelete={() => handleDelete(contract.id)}
                        onEdit={() => handleEdit(contract)}
                        onPrint={() => handlePrint(contract.id)}
                        onLiquidationContract={() =>
                          handleLiquidationContract(contract)
                        }
                        onExtendContract={() =>
                          handleOpenModalExtendContract(contract)
                        }
                        index={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Phần hiển thị phân trang */}
            {totalPages && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Trước
                  </PaginationPrevious>
                  <PaginationContent>
                    {Array.from(
                      { length: Math.max(totalPages, 1) },
                      (_, index) => index + 1
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded ${
                            currentPage === page
                              ? "bg-themeColor text-white"
                              : "bg-white text-themeColor border border-themeColor"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Tiếp
                  </PaginationNext>
                </Pagination>
              </div>
            )}
          </div>
        </div>

        {selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}

        <CustomModal
          header="Thêm mới"
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          className="max-w-[50vw]"
        >
          <CreateContractForm onSubmit={handleCreateContract} />
        </CustomModal>

        {/* Edit Contract Modal */}
        <CustomModal
          header="Chỉnh sửa"
          isOpen={isOpenEditModal} // Use separate modal state for editing
          onClose={() => setIsOpenEditModal(false)}
          className="max-w-[50vw]"
        >
          {editContract && (
            <EditContractForm
              contract={editContract}
              onSubmit={handleEditContract}
            />
          )}
        </CustomModal>

        <ExtendContractModal
          isOpen={isExtendContractModal}
          onClose={() => {
            setIsExtendContractModal(false);
            setSelectedContract(null);
          }}
          selectedContract={selectedContract}
          endDateExtendContract={endDateExtendContract}
          setEndDateExtendContract={setEndDateExtendContract}
          priceExtendContract={priceExtendContract}
          setPriceExtendContract={setPriceExtendContract}
          noteExtendContract={noteExtendContract}
          setNoteExtendContract={setNoteExtendContract}
          errorDateExtendContract={errorDateExtendContract}
          errorPriceExtendContract={errorPriceExtendContract}
          errorNoteExtendContract={errorNoteExtendContract}
          handleExtendContract={handleExtendContract}
        />

        <LiquidationModal isSuccess={handleSuccessLiquidation} contract={selectedContract} isOpen={isContractLiquidationModal} onClose={()=> setIsContractLiquidationModal(false)}/>
      </div>
        

    </LocalizationProvider>
  );
};

export default DashBoardContract;
