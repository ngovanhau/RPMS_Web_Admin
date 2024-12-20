// src/pages/Account/DashBoardAccount.tsx
import React, { useEffect, useState, useCallback } from "react";
import HeaderAccountRow from "./components/HeaderAccountRow";
import AccountRow from "./components/AccountRow";
import CreateAccountModal from "./components/CreateAccountForm";
import { User } from "@/types/types";
import {
  getAllAccount,
  createAccount,
  // deleteAccount, // Nếu bạn không cần nút xóa trong AccountRow, hãy bỏ dòng này
} from "@/services/accountApi/accountApi";
import useAccountStore from "@/stores/accountStore";
import { PlusCircle } from "lucide-react";
import { Input } from "antd"; // Import Input từ Ant Design
import { debounce } from "lodash"; // Import debounce từ lodash
import 'antd/dist/reset.css'; // Import styles của Ant Design

const { Search } = Input;

const DashBoardAccount: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State cho giá trị tìm kiếm

  const accountList = useAccountStore((state) => state.accounts);

  useEffect(() => {
    getAllAccount();
  }, []);

  const handleAddAccount = async (newAccount: User) => {
    try {
      await createAccount(newAccount);
      await getAllAccount();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create account:", error);
      alert("Error creating account. Please try again.");
    }
  };

  const handleStatusChange = () => {
    // Gọi lại API để lấy danh sách mới sau khi thay đổi trạng thái
    getAllAccount();
  };

  // Hàm xử lý thay đổi giá trị tìm kiếm với debounce
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Lọc danh sách tài khoản dựa trên giá trị tìm kiếm
  const filteredAccountList = accountList.filter((account) =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">
      <div className="flex h-[95%] p-4 overflow-hidden">
        <div className="flex flex-1 flex-col rounded-[8px] py-4 px-4 w-full bg-white">
          {/* Header với số lượng tài khoản và nút thêm */}
          <div className="flex flex-row justify-between items-center pb-4 border-b">
            <div className="flex flex-row items-center gap-6">
              <div className="py-1 px-2 rounded-[6px] flex justify-center items-center bg-themeColor">
                <span className="text-base text-white font-bold">
                  {accountList.length}
                </span>
              </div>
              <span className="text-base">{accountList.length} Tài khoản</span>
            </div>
            <div className="flex flex-row justify-end mb-4 gap-4">
              {/* Search bar */}
              <Search
              placeholder="Tìm kiếm"
              allowClear
              onSearch={(value) => setSearchTerm(value)}
              onChange={(e) => handleSearch(e.target.value)}
              className="mt-2"
            />


              {/* Add button */}
              <div
                className="bg-themeColor flex items-center justify-center gap-2 text-base h-11 text-white py-2 px-4 rounded-[6px] shadow hover:bg-opacity-90 transition duration-300 cursor-pointer"
                style={{ backgroundColor: "#004392" }}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <PlusCircle className="w-6 h-6 text-white cursor-pointer" />
                Thêm
              </div>
            </div>
          </div>
          <HeaderAccountRow />

          {/* Danh sách tài khoản đã lọc */}
          {filteredAccountList.length > 0 ? (
            <div className="overflow-y-auto max-h-[70vh] border border-gray-200 rounded-md mt-4">
              {filteredAccountList.map((account) => (
                <AccountRow
                  key={account.id} // Sử dụng id làm key thay vì index
                  id={account.id}
                  username={account.username}
                  firstName={account.firstName || ""}
                  lastName={account.lastName || ""}
                  role={account.role || ""}
                  email={account.email || ""}
                  phone={account.phone || ""}
                  status={account.status || ""}
                  onStatusChange={handleStatusChange} // Truyền hàm thay đổi trạng thái
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 text-center text-gray-500">
              Không có tài khoản phù hợp với tìm kiếm.
            </div>
          )}

          {/* Create Account Modal */}
          <CreateAccountModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddAccount}
          />
        </div>
      </div>
    </div>
  );
};

export default DashBoardAccount;
