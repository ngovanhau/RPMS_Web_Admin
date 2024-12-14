import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaBell } from "react-icons/fa"; // Import icon từ react-icons
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
import { Bell } from "lucide-react";

const DashBoardAccount: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<User | null>(null); // Thêm state cho account được chọn

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
        await getAllAccount();
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Error deleting account. Please try again.");
      }
    }
  };

  const handleRowClick = async (account: User) => {
    setSelectedAccount(account);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-100 w-full overflow-y-hidden">

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
                <FaPlus size={20} />
                <span>Thêm</span>
              </button>
            </div>
          </div>
          <HeaderAccountRow />

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
