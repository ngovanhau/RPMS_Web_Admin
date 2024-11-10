import React, { useEffect, useState } from "react";
import { useBuildingStore } from "@/stores/buildingStore";
import { User } from "@/types/types";
import { getAllBuildings, getBuildingByUserId, createPermissionByBuildingId } from "@/services/buildingApi/buildingApi";

interface CreateAccountFormProps {
  account: User;
}

const AccountAuthoziationModal: React.FC<CreateAccountFormProps> = ({ account }) => {
  const [buildingListWithRoles, setBuildingListWithRoles] = useState<any[]>([]);

  const buildingList = useBuildingStore((state) => state.buildings);
  const buildingListByUser = useBuildingStore((state) => state.buildingByUserId);

  useEffect(() => {
    const fetchBuilding = async () => {
      await getAllBuildings();
      await getBuildingByUserId(account?.id);

      // Tạo danh sách building với vai trò
      setBuildingListWithRoles(() => {
        return buildingList.map((building) => {
          const isManaged = buildingListByUser.some((userBuilding) => userBuilding.id === building.id);
          return {
            ...building,
            role: isManaged ? "manage" : "none",
          };
        });
      });
    };

    fetchBuilding();
  }, [account?.id]); // Chỉ phụ thuộc vào account.id để tránh vòng lặp vô hạn

  const handleRoleChange = (buildingId: string, newRole: string) => {

    // Cập nhật vai trò trong mảng buildingListWithRoles
    setBuildingListWithRoles((prevList) =>
      prevList.map((building) =>
        building.id === buildingId ? { ...building, role: newRole } : building
      )
    );

    // Gọi hàm truyền id, username và vai trò
    updateRoleInDatabase(buildingId, account.id, newRole);
  };

  const updateRoleInDatabase = async (buildingId: string, userId: string, role: string) => {
    console.log(`Cập nhật trong database: Building ID: ${buildingId}, User ID: ${userId}, Role: ${role}`);
    if (role === "manage") {
      try {
        await createPermissionByBuildingId({ 
          id: account.id, // Sử dụng UUID mới hoặc đặt ID cố định ở đây
          username: account.username, 
          userId: account.id, 
          buildingId 
        });
        await getAllBuildings();
        await getBuildingByUserId(account?.id);
      } catch (error) {
        console.error("Error creating permission:", error);
      }
    }
  };
  

  return (
    <div className="w-full h-[60vh] flex flex-col rounded-lg">
      <div className="h-12 w-full flex flex-row items-center border-b border-gray-300 px-4 rounded-t-lg">
        <div className="w-[30%] flex items-center">
          <span className="text-base text-green-600 font-semibold">Tên khu vực</span>
        </div>

        <div className="w-[30%] flex items-center">
          <span className="text-base text-green-600 font-semibold">Địa chỉ</span>
        </div>

        <div className="w-[20%] flex items-center">
          <span className="text-base text-green-600 font-semibold">Thành phố</span>
        </div>

        <div className="w-[20%] flex items-center justify-end">
          <span className="text-base text-green-600 font-semibold">Vai trò</span>
        </div>
      </div>

      {/* Danh sách khu vực */}
      <div className="overflow-y-auto max-h-[50vh]">
        {buildingListWithRoles.map((building) => (
          <div
            key={building.id}
            className="h-12 w-full flex flex-row items-center border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 px-4"
          >
            <div className="w-[30%] flex items-center">
              <span className="text-gray-800 text-sm font-medium">
                {building.building_name}
              </span>
            </div>
            <div className="w-[30%] flex items-center">
              <span className="text-gray-700 text-sm">{building.address}</span>
            </div>
            <div className="w-[20%] flex items-center">
              <span className="text-gray-700 text-sm">{building.city}</span>
            </div>
            <div className="w-[20%] flex items-center justify-end">
              <select
                className="bg-white border border-gray-300 text-gray-800 text-sm rounded px-2 py-1 shadow-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition duration-200"
                value={building.role}
                onChange={(e) => handleRoleChange(building.id, e.target.value)}
              >
                <option value="none">None</option>
                <option value="manage">Quản lý</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountAuthoziationModal;
