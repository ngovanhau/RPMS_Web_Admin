import React, {useEffect} from "react";
import { Building, User } from "@/types/types";
import useAccountStore from "@/stores/accountStore";
import { getAllAccount, getUserByBuildingId } from "@/services/accountApi/accountApi";

interface AddManagerFormProps {
  selectedBuilding : Building
  onSubmit: (manager: User) => void;
  onCancel: () => void;
}

const AddManagerForm: React.FC<AddManagerFormProps> = ({
  selectedBuilding,
  onSubmit,
  onCancel,
}) => {


  const accountList = useAccountStore((state) => state.accounts);
  const accountManageByBuilding = useAccountStore((state) => state.accountManageByBuilding);

  useEffect(() => {
    const inittialData = async () => {
      await getAllAccount()
      await getUserByBuildingId(selectedBuilding.id); 
    };
    inittialData();
  }, []);
  

  const availableManagers = accountList.filter(account => {
    // Kiểm tra xem account có trong danh sách accountManageByBuilding không
    const isAlreadyManager = accountManageByBuilding.some(
      managerAccount => managerAccount.userId === account.id
    );
    // Chỉ giữ lại những account chưa được thêm vào building
    return !isAlreadyManager;
  });
  

  return (
    <form className="flex flex-col h-full space-y-4">
      <div className="flex-1 overflow-hidden">
        <div className="h-full rounded-md">
          <div className="h-full max-h-[70vh] overflow-y-auto">
            {availableManagers.length === 0 ? (
              <div className="h-[20vh] flex justify-center items-center">
                <p className="text-gray-500 text-center">
                  Không có quản lý nào
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="border-b p-2 text-green-400 h-16">Tên đăng nhập</th>
                    <th className="border-b p-2 text-green-400 h-16">Họ</th>
                    <th className="border-b p-2 text-green-400 h-16">Tên</th>
                    <th className="border-b p-2 text-green-400 h-16">Vai trò</th>
                    <th className="border-b p-2 text-green-400 h-16">Email</th>
                    <th className="border-b p-2 text-green-400 h-16">Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                  {availableManagers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => onSubmit(user)}
                      className="cursor-pointer hover:bg-gray-100 transition"
                    >
                      <td className="border-b p-2 h-16">{user.username}</td>
                      <td className="border-b p-2 h-16">{user.firstName}</td>
                      <td className="border-b p-2 h-16">{user.lastName}</td>
                      <td className="border-b p-2 h-16">{user.role || "N/A"}</td>
                      <td className="border-b p-2 h-16">{user.email || "N/A"}</td>
                      <td className="border-b p-2 h-16">{user.phone || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddManagerForm;