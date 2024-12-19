import React, { useEffect, useState } from "react";

// Internal imports
import { deleteTenant, getallTenant } from "@/services/tenantApi/tenant";
import useTenantStore from "@/stores/tenantStore";
import useAuthStore from "@/stores/userStore";
import TenantForm from "./components/TenantForm";
import CustomModal from "@/components/Modal/Modal";
import type { Tenant } from "@/types/types";
import EditTenantForm from "./components/EditTenantForm";

// Icons from React Icons
import { BiPlus } from "react-icons/bi";

// Import các component phân trang từ shadcn ui
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ITEMS_PER_PAGE = 8; // Số phần tử mỗi trang

const Tenant: React.FC = () => {
  const { userData } = useAuthStore();
  const { tenants, setTenants } = useTenantStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Thêm state để quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(tenants.length / ITEMS_PER_PAGE);

  // Lấy phần tử của trang hiện tại
  const currentTenants = tenants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Hàm xử lý xóa tenant
  const handleDelete = async (tenant: Tenant) => {
    console.log("Xóa tenant:", tenant); // In ra thông tin tenant
    if (confirm("Bạn có chắc muốn xóa khách hàng này không?")) {
      if (tenant.id) {
        try {
          await deleteTenant(tenant.id);
          handleDeleteSuccess();
          alert("Xóa thành công!");
        } catch (error) {
          console.log("Có lỗi xảy ra khi xóa tenant:", error);
          alert("Xóa không thành công!");
        }
      }
    }
  };

  // Hàm xử lý mở modal chỉnh sửa tenant
  const handleEditClick = (tenant: Tenant) => {
    console.log("Chỉnh sửa tenant:", tenant); // In ra thông tin tenant
    setSelectedTenant(tenant);
    setIsEditModalOpen(true);
  };

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
    setCurrentPage(1); // Quay về trang đầu tiên sau khi thêm/chỉnh sửa
  };

  useEffect(() => {
    fetchAllTenants();
  }, []);

  // Hàm để chuyển trang
  const handlePageChange = (page: number) => {
    // Đảm bảo trang nằm trong phạm vi hợp lệ
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden relative">
      <div className="flex h-full p-4 overflow-hidden">
        <div className="flex flex-col rounded-[8px] py-4 px-4 w-full bg-white">
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
                className="bg-themeColor flex flex-row justify-center items-center gap-2 text-base h-12 text-white py-2 w-44 rounded-[6px] shadow hover:bg-themeColor transition duration-300 cursor-pointer"
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

          {/* Tenant Table */}
          <div className="w-full rounded-[8px] h-[750px] overflow-hidden">
            <table className="w-full h-full">
              <thead>
                <tr className="bg-themeColor text-white">
                  <th className="w-16 p-4 border-2 border-gray-300 "></th>
                  <th className="p-4 border-2 border-gray-300 text-left">
                    Tên khách thuê
                  </th>
                  <th className="p-4 border-2 border-gray-300 text-left">
                    Phòng
                  </th>
                  <th className="p-4 border-2 border-gray-300 text-left">
                    Số điện thoại
                  </th>
                  <th className="p-4 border-2 border-gray-300 text-left">
                    CMND/CCCD
                  </th>
                  <th className="p-4 border-2 border-gray-300 text-left">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 h-14">
                    <td className="p-4 h-14 border border-gray-300">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <MoreHorizontal />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white ml-32">
                          <DropdownMenuItem
                            onSelect={() => handleDelete(tenant)}
                          >
                            <FaTrash className="w-4 h-4 text-gray-600 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleEditClick(tenant)}
                          >
                            <FaEdit className="w-4 h-4 text-gray-600 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="p-4 h-14 border border-gray-300">
                      {tenant.customer_name}
                    </td>
                    <td className="p-4 h-14 border border-gray-300">
                      {tenant.roomName}
                    </td>
                    <td className="p-4 h-14 border border-gray-300">
                      {tenant.phone_number}
                    </td>
                    <td className="p-4 h-14 border border-gray-300">
                      {tenant.cccd}
                    </td>
                    <td className="p-4 h-14 border border-gray-300">
                      {tenant.email}
                    </td>
                  </tr>
                ))}
                {/* Thêm các hàng trống nếu cần */}
                {currentTenants.length < ITEMS_PER_PAGE &&
                  Array.from({
                    length: ITEMS_PER_PAGE - currentTenants.length,
                  }).map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className="border-none h-14 shadow-none"
                    >
                      <td className="border-none shadow-none bg-white h-14"></td>
                      <td className="border-none shadow-none bg-white h-14"></td>
                      <td className="border-none shadow-none bg-white h-14"></td>
                      <td className="border-none shadow-none bg-white h-14"></td>
                      <td className="border-none shadow-none bg-white h-14"></td>
                      <td className="border-none shadow-none bg-white h-14"></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Phần hiển thị phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trước
                </PaginationPrevious>
                <PaginationContent>
                  {Array.from(
                    { length: totalPages },
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

      {/* Modal cho việc thêm mới Tenant */}
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

      {/* Modal cho việc chỉnh sửa Tenant */}
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
