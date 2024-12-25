import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import OptionSelector from "../Deposit/components/OptionSelector";
import useAuthStore from "@/stores/userStore";
import { useBuildingStore } from "@/stores/buildingStore";
import useTenantStore from "@/stores/tenantStore";
import {
  getAllBuildings,
  getBuildingByUserId,
  getRoomByBuildingId,
} from "@/services/buildingApi/buildingApi";
import ProblemTable from "./components/ProblemTable";
import { Problem } from "@/types/types";
import {
  deleteProblemById,
  fetchAllProblems,
  fetchProblemByBuildingId,
  fetchProblemsByRoomId,
  updateProblemById,
} from "@/services/problemApi/problemApi";
import { useProblemStore } from "@/stores/problemStore";
import ProblemCard from "./components/ProblemDetail";
import CustomModal from "@/components/Modal/Modal";
import { Bell } from "lucide-react";
import { TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import ProblemView from "./components/ProblemView";

const DashBoardProblem: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("Đang yêu cầu");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null); // Lưu Problem được chọn
  const [confirmModal, setConfirmModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false)
  const [fixModal, setFixModal] = useState(false)
  // Fetching data from stores and APIs
  const userData = useAuthStore((state) => state.userData);
  const buildings = useBuildingStore((state) => state.buildings);
  const roomList = useBuildingStore((state) => state.roomList);
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const building = useBuildingStore((state) => state.building);
  const customerList = useTenantStore((state) => state.allTenants);
  const problems = useProblemStore((state) => state.problems);
  const currentProblem = useProblemStore((state) => state.currentProblem);

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem); // Cập nhật Problem được chọn
    setIsModalOpen(true); // Mở modal
  };

  const handleModalClose = () => {
    setSelectedProblem(null); // Reset Problem
    setIsModalOpen(false); // Đóng modal
  };

  const options = ["Đang yêu cầu", "Đang xử lý", "Hoàn thành", "Đã hủy"];

  const statusMap = {
    0: "Đang yêu cầu",
    1: "Đang xử lý",
    2: "Hoàn thành",
    3: "Đã hủy",
  };

  const fatalLevelMap = {
    0: "thấp",
    1: "vừa",
    2: "cao",
  };

  const fetchInitialData = async () => {
    try {
      if (userData?.role === "ADMIN") {
        const buildingsData = (await getAllBuildings()).data.data;
        useBuildingStore.getState().setBuildings(buildingsData);
        setSelectedBuildingId(buildingsData[0]?.id || null);
        setBuilding(buildingsData[0] || null);
        await fetchAllProblems();
      } else if (userData?.role === "MANAGEMENT") {
        const buildingsData = (await getBuildingByUserId(userData?.id || ""))
          .data.data;
        useBuildingStore.getState().setBuildings(buildingsData);
        if (buildingsData.length > 0) {
          await fetchProblemByBuildingId(buildingsData[0].id);
          setSelectedBuildingId(buildingsData[0].id);
          setBuilding(buildingsData[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleBuildingSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedBuilding = buildings.find(
      (building) => building.building_name === event.target.value
    );
    if (selectedBuilding) {
      await getRoomByBuildingId(selectedBuilding.id);
      await fetchProblemByBuildingId(selectedBuilding.id);
      setBuilding(selectedBuilding);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSubmitConfirm = async () => {
    if (selectedProblem) {
      const updatedProblem: Problem = {
        ...selectedProblem,
        status: 1,
      };
  
      try {
        const response = await updateProblemById(updatedProblem.id, updatedProblem);
        if (response.isSuccess) {
          setConfirmModal(false);
          setSelectedProblem(null);
          fetchInitialData();
        } else {
          console.error("Cập nhật vấn đề không thành công:", response.message);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật vấn đề:", error);
      }
    } else {
      console.error("Không có vấn đề nào được chọn để cập nhật");
    }
  };
  const handleSubmitComplete = async () => {
    if (selectedProblem) {
      const updatedProblem: Problem = {
        ...selectedProblem,
        status: 2,
      };
  
      try {
        const response = await updateProblemById(updatedProblem.id, updatedProblem);
        if (response.isSuccess) {
          setCompleteModal(false);
          setSelectedProblem(null);
          fetchInitialData();
        } else {
          console.error("Cập nhật vấn đề không thành công:", response.message);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật vấn đề:", error);
      }
    } else {
      console.error("Không có vấn đề nào được chọn để cập nhật");
    }
  };
  const handleSubmitCancel = async () => {
    if (selectedProblem) {
      const updatedProblem: Problem = {
        ...selectedProblem,
        status: 3,
      };
  
      try {
        const response = await updateProblemById(updatedProblem.id, updatedProblem);
        if (response.isSuccess) {
          setCancelModal(false);
          setSelectedProblem(null);
          fetchInitialData();
        } else {
          console.error("Cập nhật vấn đề không thành công:", response.message);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật vấn đề:", error);
      }
    } else {
      console.error("Không có vấn đề nào được chọn để cập nhật");
    }
  };
  


  const handleOpenModalComplete = async (updatedProblem: Problem) => {
    setCompleteModal(true);
    setSelectedProblem(updatedProblem);
  };
  const handleOpenModalConfirm = async (updatedProblem: Problem) => {
    setConfirmModal(true);
    setSelectedProblem(updatedProblem);
  };
  const handleOpenModalCancel = async (updatedProblem: Problem) => {
    setCancelModal(true);
    setSelectedProblem(updatedProblem);
  };
  const handleOpenModalFix = async (updatedProblem: Problem) => {
    setFixModal(true);
    setSelectedProblem(updatedProblem);
  };


  const handleStatusChange = async (updatedProblem: Problem) => {
    try {
      // Gọi API để cập nhật toàn bộ vấn đề
      const response = await updateProblemById(
        updatedProblem.id,
        updatedProblem
      );
    } catch (error) {
      console.error(
        `Lỗi khi thay đổi trạng thái cho ID: ${updatedProblem.id}`,
        error
      );
    }
  };

  const handleDelete = async (problemId: string) => {
    const response = await deleteProblemById(problemId);
    if (response.isSuccess) {
      fetchInitialData();
    }
  };

  // Map selectedOption to status value
  const selectedStatus = useMemo(() => {
    const entries = Object.entries(statusMap);
    const found = entries.find(([key, value]) => value === selectedOption);
    return found ? parseInt(found[0], 10) : null;
  }, [selectedOption]);

  // Filter problems by selected status
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => problem.status === selectedStatus);
  }, [problems, selectedStatus]);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <div className="flex h-[100%] p-4 overflow-hidden">
        <div className="flex flex-1 rounded-[8px] flex-col py-4 px-4 w-full bg-white">
          <OptionSelector
            options={options}
            selectedOption={selectedOption}
            buildings={buildings}
            onOptionChange={setSelectedOption}
            onBuildingChange={handleBuildingSelect}
          />
          <ProblemTable
            onFix={handleOpenModalFix}
            onCancel={handleOpenModalCancel}
            onComplete={handleOpenModalComplete}
            onConfirm={handleOpenModalConfirm}
            ondelete={handleDelete}
            problems={filteredProblems} // Use filtered problems here
            fatalLevelMap={fatalLevelMap}
            statusMap={statusMap}
            onStatusChange={handleStatusChange}
            onProblemSelect={handleProblemSelect}
          />
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        header="Chi tiết vấn đề"
        className="max-w-2xl"
      >
        <ProblemCard onClose={handleModalClose} problem={selectedProblem} />
      </CustomModal>

      <CustomModal
        header="Xác nhận xử lý"
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        className="max-w-[30%]"
        children={
          <div className="w-full pt-4 gap-4 flex flex-col">
            <ProblemView problem={selectedProblem!}/>
            <TextField
              value={selectedProblem?.solution || ''}
              label="Ghi chú"
              fullWidth
              variant="outlined"
              onChange={(e) =>
                setSelectedProblem((prev) =>
                  prev ? { ...prev, solution: e.target.value } : prev
                )
              }
            />
            <div className="flex justify-end space-x-4">
              <Button 
              onClick={()=> setConfirmModal(false)}  
              className="w-24 rounded">
                Hủy
              </Button>
              <Button
                onClick={handleSubmitConfirm}
                className="w-24 rounded bg-themeColor hover:bg-blue-700 text-white"
              >
                Lưu
              </Button>
            </div>
          </div>
        }
      />

<CustomModal
        header="Xác nhận thành công"
        isOpen={completeModal}
        onClose={() => setCompleteModal(false)}
        className="max-w-[30%]"
        children={
          <div className="w-full pt-4 gap-4 flex flex-col">
            <ProblemView problem={selectedProblem!}/>
            <TextField
              value={selectedProblem?.solution || ''}
              label="Ghi chú"
              fullWidth
              variant="outlined"
              onChange={(e) =>
                setSelectedProblem((prev) =>
                  prev ? { ...prev, solution: e.target.value } : prev
                )
              }
            />
            <div className="flex justify-end space-x-4">
              <Button 
              onClick={()=> setCompleteModal(false)}  
              className="w-24 rounded">
                Hủy
              </Button>
              <Button
                onClick={handleSubmitComplete}
                className="w-24 rounded bg-themeColor hover:bg-blue-700 text-white"
              >
                Lưu
              </Button>
            </div>
          </div>
        }
      />

<CustomModal
        header="Hủy"
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}
        className="max-w-[30%]"
        children={
          <div className="w-full pt-4 gap-4 flex flex-col">
            <ProblemView problem={selectedProblem!}/>
            <TextField
              value={selectedProblem?.solution || ''}
              label="Lý do hủy"
              fullWidth
              variant="outlined"
              onChange={(e) =>
                setSelectedProblem((prev) =>
                  prev ? { ...prev, solution: e.target.value } : prev
                )
              }
            />
            <div className="flex justify-end space-x-4">
              <Button 
              onClick={()=> setCancelModal(false)}  
              className="w-24 rounded">
                Hủy
              </Button>
              <Button
                onClick={handleSubmitCancel}
                className="w-24 rounded bg-themeColor hover:bg-blue-700 text-white"
              >
                Lưu
              </Button>
            </div>
          </div>
        }
      />

    </div>
  );
};

export default DashBoardProblem;
