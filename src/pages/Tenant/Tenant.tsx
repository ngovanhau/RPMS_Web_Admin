import React, { useEffect, useState } from "react";

//internal
import HeaderTenantRow from "./components/HeaderTenantRow";
import { getallTenant } from "@/services/tenantApi/tenant";
import useTenantStore from "@/stores/tenantStore";
import useAuthStore from "@/stores/userStore";
import TenantForm from "./components/TenantForm";
import TenantRow from "./components/TenantsRow";
import CustomModal from "@/components/Modal/Modal";
import type { Tenant } from "@/types/types";
import EditTenantForm from "./components/EditTenantForm";

const Tenant: React.FC = () => {
  const { userData } = useAuthStore();
  const { tenants, setTenants } = useTenantStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Fetch all tenants
  const fetchAllTenants = async () => {
    try {
      const response = await getallTenant();
      setTenants(response.data);
      return response;
    } catch (error) {
      console.log("Có lỗi xảy ra khi lấy dữ liệu.");
    }
  };

  const handleDeleteSuccess = async () => {
    await fetchAllTenants();
  };

  const handleSuccess = async () => {
    await fetchAllTenants();
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchAllTenants();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b bg-white w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          className="w-full border-none focus:outline-none"
          placeholder="Tìm kiếm bằng tên tenant"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
      </div>

      <div className="flex h-[95%] p-4  overflow-hidden">
        <div className="flex flex-1 flex-col rounded-[8px] py-4 px-4 w-full bg-white">
          <div className="flex flex-row justify-between items-center pb-4 border-b">
            <div className="flex flex-row items-center gap-6">
              <div className="py-1 px-2 rounded-[6px] flex justify-center items-center bg-green-500">
                <span className="text-base text-white font-bold">0</span>
              </div>
              <span className="text-base">0 Đã chọn</span>
            </div>
            <div>
              <div
                className="bg-green-400 flex flex-row justify-center items-center gap-2 text-base h-12 text-white py-2 w-44 rounded-[6px] shadow hover:bg-green-500 transition duration-300"
                title="Thêm Mới"
                onClick={() => {
                  setSelectedTenant(null);
                  setIsAddModalOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span>Thêm</span>
              </div>
            </div>
          </div>

          {/* Header of the tenant table */}
          <HeaderTenantRow />

          {/* Display list of tenants */}
          <div className="flex-1 w-full flex-col overflow-y-auto">
            {tenants.length > 0 ? (
              tenants.map((tenant) => (
                <TenantRow
                  key={tenant.id}
                  tenant={tenant}
                  onDeleteSuccess={handleDeleteSuccess}
                  handleEdit={handleEdit}
                />
              ))
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                <p className="text-sm mb-10 text-gray-500">
                  Chưa có khách hàng nào.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for adding a new Tenant */}
      <CustomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        header="Thêm mới Tenant"
      >
        <TenantForm
          onSuccess={handleSuccess}
          onClose={() => setIsAddModalOpen(false)}
        />
      </CustomModal>

      {/* Modal for editing an existing Tenant */}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        header="Chỉnh sửa Tenant"
      >
        {selectedTenant && (
          <EditTenantForm
            onSuccess={handleSuccess}
            onClose={() => setIsEditModalOpen(false)}
            tenant={selectedTenant}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default Tenant;
