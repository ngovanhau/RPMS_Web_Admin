// src/components/CreateAccountModal.tsx
import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaIdBadge } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/types";

interface CreateAccountFormProps {
  onSubmit: (account: User) => void;
  isOpen: boolean;
  onClose: () => void;
}

const CreateAccountModal: React.FC<CreateAccountFormProps> = ({
  onSubmit,
  isOpen,
  onClose,
}) => {
  const initialFormData = {
    id: "", // Bạn có thể tạo ID mới tại đây hoặc từ phía server
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "MANAGEMENT",
    email: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prevData) => ({ ...prevData, role }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-[8px] shadow-xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition duration-150"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Tạo tài khoản
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tên đăng nhập */}
          <div className="relative">
            <label className="block text-gray-500 mb-1 text-md">
              Tên đăng nhập
            </label>
            <div className="relative">
              <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[8px] pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="relative">
            <label className="block text-gray-500 mb-1 text-md">Mật khẩu</label>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[8px] pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          {/* Họ */}
          <div className="relative">
            <label className="block text-gray-500 mb-1 text-md">Họ</label>
            <div className="relative">
              <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[8px] pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                placeholder="Nhập họ"
                required
              />
            </div>
          </div>

          {/* Tên */}
          <div className="relative">
            <label className="block text-gray-500 mb-1 text-md">Tên</label>
            <div className="relative">
              <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[8px] pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                placeholder="Nhập tên"
                required
              />
            </div>
          </div>

          {/* Vai trò */}
          <div className="relative">
            <label className="block text-gray-500 mb-1 text-md">Vai trò</label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full border border-gray-300 rounded-[8px] h-12 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem
                  value="MANAGEMENT"
                  className={`flex h-12 items-center ${
                    formData.role === "MANAGEMENT"
                      ? "bg-blue-100 text-blue-500"
                      : "text-gray-800"
                  }`}
                >
                  <div className="flex items-center flex-row w-full">
                    <FaIdBadge className="mr-2" />
                    <span>MANAGEMENT</span>
                  </div>
                </SelectItem>
                {/* Bạn có thể thêm các vai trò khác tại đây */}
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-gray-500 mb-1 text-md">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[8px] pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="relative">
            <label className="block text-gray-500 mb-1 text-md">
              Số điện thoại
            </label>
            <div className="relative">
              <FaPhone className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-[8px] pl-10 pr-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-[8px] bg-themeColor text-white py-3 font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;
