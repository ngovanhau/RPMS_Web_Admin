import React, { useEffect, useState } from "react";
import { getAllBuildings } from "@/services/buildingApi/buildingApi";
import { useBuildingStore } from "@/stores/buildingStore";
import { FaSearch, FaBell } from "react-icons/fa";
import { Building, User } from "@/types/types";
import { getUserByBuildingId } from "@/services/accountApi/accountApi";
import useAccountStore from "@/stores/accountStore";
import CustomModal from "@/components/Modal/Modal";
import AddManagerForm from "./components/AddManagerForm";
import { createPermissionByBuildingId } from "@/services/buildingApi/buildingApi";
import { getAllAccount } from "@/services/accountApi/accountApi";

const DashBoardPermission: React.FC = () => {
  const listBuilding: Building[] = useBuildingStore((state) => state.buildings);
  const accountManageByBuilding = useAccountStore(
    (state) => state.accountManageByBuilding
  );
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  useEffect(() => {
    const inittialData = async () => {
      await getAllBuildings();
      await getAllAccount();
    };
    inittialData();
  }, []);

  useEffect(() => {
    const fetchManageList = async () => {
      if (selectedBuilding) {
        await getUserByBuildingId(selectedBuilding.id);
      }
    };
    fetchManageList();
  }, [selectedBuilding]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const building = listBuilding.find((b) => b.id === selectedId) || null;
    setSelectedBuilding(building);
  };

  const handleAddManager = async (manager: User) => {
    if (!selectedBuilding) {
      console.error("Không có tòa nhà được chọn.");
      return;
    }

    if (!manager) {
      console.error("Không có quản lý được chọn.");
      return;
    }

    try {
      await updateRoleInDatabase(selectedBuilding.id, manager);
      await getUserByBuildingId(selectedBuilding.id);
      setSelectedManager(manager);
      console.log("Quản lý đã được thêm thành công.");

      setIsModalOpen(false); // Đóng modal sau khi chọn quản lý
    } catch (error) {
      console.error("Đã xảy ra lỗi khi thêm quản lý:", error);
      alert("Đã xảy ra lỗi khi thêm quản lý. Vui lòng thử lại.");
    }
  };

  const updateRoleInDatabase = async (buildingId: string, account: User) => {
    try {
      await createPermissionByBuildingId({
        id: account.id, // Ensure the account ID is properly passed here
        username: account.username,
        userId: account.id,
        buildingId,
      });
      // Refresh building and user data
      await getAllBuildings();
      if (selectedBuilding) {
        await getUserByBuildingId(selectedBuilding.id);
      }
    } catch (error) {
      console.error("Error during role update or permission creation:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b-b bg-white w-full">
        <FaSearch className="text-gray-500" size={20} />
        <input
          className="w-full border-none focus:outline-none"
          placeholder="Tìm kiếm bằng tên tòa nhà"
        />
        <FaBell className="text-gray-500" size={20} />
      </div>

      <div className="flex h-[95%] p-6 overflow-hidden">
        <div className="flex flex-1 rounded-[8px] flex-col py-4 px-4 w-full bg-white">
          <div className="flex flex-row items-center gap-4 mb-4">
            <label className="text-base font-semibold text-themeColor">
              Chọn tòa nhà:
            </label>
            <select
              value={selectedBuilding?.id || ""}
              onChange={handleSelectChange}
              className="border p-2 rounded-md"
            >
              <option value="" disabled>
                Chọn tòa nhà
              </option>
              {listBuilding.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.building_name}
                </option>
              ))}
            </select>
          </div>

          {selectedBuilding && (
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 mt-5 rounded-md">
                <div className="flex flex-row justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-themeColor">
                    Danh sách quản lý
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-themeColor text-md rounded-[8px] text-white px-4 py-2 hover:bg-themeColor transition-all"
                  >
                    Thêm quản lý
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-scroll">
                  {accountManageByBuilding.length === 0 ? (
                    <div className="h-[50vh] flex justify-center items-center">
                      <p className="text-gray-500 text-center">
                        Chưa có quản lý nào được thêm
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse gap-16">
                      <thead className="sticky top-0 bg-white">
                        <tr>
                          <th className="border-b p-2 text-themeColor h-16">
                            Tên đăng nhập
                          </th>
                          <th className="border-b p-2 text-themeColor h-16">
                            Họ
                          </th>
                          <th className="border-b p-2 text-themeColor h-16">
                            Tên
                          </th>
                          <th className="border-b p-2 text-themeColor h-16">
                            Vai trò
                          </th>
                          <th className="border-b p-2 text-themeColor h-16">
                            Email
                          </th>
                          <th className="border-b p-2 text-themeColor h-16">
                            Số điện thoại
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountManageByBuilding.map((user) => (
                          <tr key={user.id}>
                            <td className="border-b p-2 h-16">
                              {user.username}
                            </td>
                            <td className="border-b p-2 h-16">
                              {user.firstName}
                            </td>
                            <td className="border-b p-2 h-16">
                              {user.lastName}
                            </td>
                            <td className="border-b p-2 h-16">
                              {user.role || "N/A"}
                            </td>
                            <td className="border-b p-2 h-16">
                              {user.email || "N/A"}
                            </td>
                            <td className="border-b p-2 h-16">
                              {user.phone || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedBuilding && (
        <CustomModal
          header="Thêm Quản Lý"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <AddManagerForm
            onSubmit={handleAddManager}
            onCancel={() => setIsModalOpen(false)}
            selectedBuilding={selectedBuilding}
          />
        </CustomModal>
      )}
    </div>
  );
};

export default DashBoardPermission;
