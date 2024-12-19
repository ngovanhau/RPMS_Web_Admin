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

// Icons from React Icons
import { BiSearch } from "react-icons/bi";
import { BiPlus } from "react-icons/bi";
import { BiBell } from "react-icons/bi";
import { Bell } from "lucide-react";

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
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden relative">
      <div className="flex h-[100%] p-4 overflow-hidden">
        <div className="flex h-[72%] flex-col rounded-[8px] py-4 px-4 w-full bg-white">
          <div className="flex flex-row justify-between items-center pb-4 border-b">
            <div className="flex flex-row items-center gap-6">
              <div className="py-1 px-2 rounded-[6px] flex justify-center items-center ">
                <span className="text-base text-themeColor font-bold">
                  Danh sách khách hàng
                </span>
              </div>
              <span className="text-base"></span>
            </div>
            <div>
              <div
                className="bg-themeColor flex flex-row justify-center items-center gap-2 text-base h-12 text-white py-2 w-44 rounded-[6px] shadow hover:bg-themeColor transition duration-300"
                title="Thêm Mới"
                onClick={() => {
                  setSelectedTenant(null);
                  setIsAddModalOpen(true);
                }}
              >
                <BiPlus className="size-6" />
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
