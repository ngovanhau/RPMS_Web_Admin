import React, { useState, useEffect } from "react";
import HeaderAccountRow from "./components/HeaderAccountRow";
import AccountRow from "./components/AccountRow";
import CreateAccountModal from "./components/CreateAccountForm";
import CustomModal from "@/components/Modal/Modal";
import { getPermissionById } from "@/services/accountApi/accountApi";
import { Account, User } from "@/types/types";
import {
  getAllAccount,
  deleteAccount,
  createAccount,
} from "@/services/accountApi/accountApi";
import useAccountStore from "@/stores/accountStore";
import AccountAuthoziationModal from "./components/AccountAuthorization";
const DashBoardAccount: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<User | null>(null); // Thêm state cho account được chọn

  // Gọi `listAccount` từ `zustand` store

  const accountList = useAccountStore((state) => state.accounts);

  useEffect(() => {
    getAllAccount();
  }, []);

  const handleAddAccount = async (newAccount: User) => {
    try {
      const response = await createAccount(newAccount);
      await getAllAccount();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create account:", error);
      alert("Error creating account. Please try again.");
    }
  };
  const handleDeleteAccount = async (accountId: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này?"
    );
    if (confirmed) {
      try {
        await deleteAccount(accountId);
        await getAllAccount(); // Cập nhật lại danh sách sau khi xóa
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Error deleting account. Please try again.");
      }
    }
  };

  const handleRowClick = async (account: User) => {
    // Lấy quyền của tài khoản nếu cần
    setSelectedAccount(account);
    setIsAuthModalOpen(true);
  };

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
          placeholder="Tìm kiếm bằng tên tòa nhà"
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

      <div className="flex h-[95%] p-4 overflow-hidden">
        <div className="flex flex-1 flex-col rounded-[8px] py-4 px-4 w-full bg-white">
          <div className="flex flex-row justify-between items-center pb-4 border-b">
            <div className="flex flex-row items-center gap-6">
              <div className="py-1 px-2 rounded-[6px] flex justify-center items-center bg-themeColor">
                <span className="text-base text-white font-bold">
                  {accountList.length}
                </span>
              </div>
              <span className="text-base">{accountList.length} Tài khoản</span>
            </div>
            <div>
              <button
                className="bg-themeColor flex flex-row justify-center items-center gap-2 text-base h-12 text-white py-2 w-44 rounded-[6px] shadow hover:bg-themeColor transition duration-300"
                title="Thêm Mới"
                onClick={() => setIsModalOpen(true)}
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
              </button>
            </div>
          </div>
          <HeaderAccountRow />
          {/* Account Rows */}
          {accountList.map((account, index) => (
            <AccountRow
              key={index}
              username={account.username}
              firstName={account.firstName || ""}
              lastName={account.lastName || ""}
              role={account.role || ""}
              email={account.email || ""}
              phone={account.phone || ""}
              onDelete={() => handleDeleteAccount(account.id || "")}
              onClick={() => handleRowClick(account)}
            />
          ))}

          {/* Create Account Modal */}
          <CreateAccountModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddAccount}
          />
          {/* Account Authorization Modal */}
          {selectedAccount && (
            <CustomModal
              header="Chỉnh sửa quyền hạn"
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              children={<AccountAuthoziationModal account={selectedAccount} />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoardAccount;
