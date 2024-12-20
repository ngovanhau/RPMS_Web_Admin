// src/components/AccountRow.tsx
import React, { useState, useEffect } from "react";
import { Switch, Spin } from "antd"; // Import Switch và Spin từ Ant Design
import { updateStatus } from "@/services/userApi/userApi"; // Đảm bảo bạn có hàm updateStatus
import 'antd/dist/reset.css'; // Import styles của Ant Design

type AccountRowProps = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  status: string; // Trạng thái người dùng
  onStatusChange?: () => void; // Handler khi trạng thái thay đổi
};

const AccountRow: React.FC<AccountRowProps> = ({
  id,
  username,
  firstName,
  lastName,
  role,
  email,
  phone,
  status,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(status === "Active");

  useEffect(() => {
    setChecked(status === "Active");
  }, [status]);

  const handleToggleStatus = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await updateStatus(id); // Gọi API để cập nhật trạng thái
      setChecked(checked);
      onStatusChange && onStatusChange(); // Gọi handler để cập nhật danh sách
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
      // Đảo ngược trạng thái nếu cập nhật thất bại
      setChecked(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row w-full h-16 items-center border-b border-gray-200 hover:bg-blue-50 transition duration-200 ease-in-out">
      {/* Tên đăng nhập */}
      <div className="w-[20%] flex items-center justify-start border-r border-gray-600 px-4">
        <span className="text-gray-800 text-sm font-medium">{username}</span>
      </div>

      {/* Họ */}
      <div className="w-[12%] flex items-center justify-start border-r border-gray-600 px-4">
        <span className="text-gray-800 text-sm font-medium">{firstName}</span>
      </div>

      {/* Tên */}
      <div className="w-[12%] flex items-center justify-start border-r border-gray-600 px-4">
        <span className="text-gray-800 text-sm font-medium">{lastName}</span>
      </div>

      {/* Vai trò */}
      <div className="w-[10%] flex items-center justify-start border-r border-gray-600 px-4">
        <span className="text-gray-800 text-sm font-medium">{role}</span>
      </div>

      {/* Email */}
      <div className="w-[23%] flex items-center justify-start border-r border-gray-600 px-4">
        <span className="text-gray-800 text-sm truncate font-medium">{email}</span>
      </div>

      {/* Số điện thoại */}
      <div className="w-[14%] flex items-center justify-start border-r border-gray-600 px-4">
        <span className="text-gray-800 text-sm font-medium">{phone}</span>
      </div>

      {/* Thao tác */}
      <div className="w-[14%] flex items-center justify-center px-4">
        {isLoading ? (
          <Spin size="small" />
        ) : (
          <Switch
            checked={checked}
            onChange={handleToggleStatus}
            checkedChildren="Active"
            unCheckedChildren="Deleted"
            className="mt-1"
          />
        )}
      </div>
    </div>
  );
};

export default AccountRow;
