import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SidebarItem from "./components/ItemSideBar";
import { sidebarItems as initialSidebarItems } from "./data/sidebarConfig";
import useAuthStore from "@/stores/userStore";
import { FaUser, FaSignOutAlt, FaChevronDown, FaFileInvoiceDollar, FaChevronUp } from "react-icons/fa";
import { MdGroup } from "react-icons/md"; 
import logo from '../../assets/logo.png';
import './Sidebar.css';

  const Sidebar: React.FC = () => {
  const { userData, clearUserData } = useAuthStore();
  const [selectedPage, setSelectedPage] = useState<string>("dashboard");
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter sidebar items based on user role
  const sidebarItems = initialSidebarItems.filter(
    (item) =>
      (item.type !== "Account" && item.type !== "Permission") ||
      userData?.role === "ADMIN"
  );

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    navigate(`/${page}`);
  };

  const handleSignOut = () => {
    clearUserData();
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleChangePass = () => {
    navigate("/Changepass");
  };
   // Toggle expand/collapse for a large item
   const toggleExpand = (type: string) => {
    setExpandedItems(prev => prev.includes(type)
      ? prev.filter(item => item !== type)
      : [...prev, type]
    );
  };

  return (
    <div className="flex flex-col h-full w-full border-2">
      <div className="h-[5%] flex items-center justify-start px-10">
        <img className="h-10 w-10 " src={logo} />
      </div>

      <div className="h-[95%] flex-col flex items-center justify-start">
        <div className="w-[80%] h-[8%] flex items-center justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row gap-8 ml-2 items-center">
            <img
              src={userData?.avata || 'https://i.ibb.co/CmYyjRt/453178253-471506465671661-2781666950760530985-n.png'}
              className="h-10 w-10 object-cover rounded-full bg-red-400"
            />

              <div className="flex flex-col text-left">
                <span className="font-bold text-sm">{userData?.lastName}</span>

              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-white rounded-xl border border-themeColor font-semibold text-gray-800">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="itemDropDown-Profile" onClick={handleProfile}>
                <FaUser className="mr-2" />
                <span className="text-[13px]">Thông tin tài khoản</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="itemDropDown-Profile">
                <FaFileInvoiceDollar className="mr-2" />
                <span className="text-[13px]">Tài liệu hướng dẫn</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="itemDropDown-Profile" onClick={handleChangePass}>
                <MdGroup className="mr-2" />
                <span className="text-[13px]">Đổi mật khẩu</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="itemDropDown-Profile" onClick={handleSignOut} >
              <FaSignOutAlt className="size-6" />
              <span className="text-sm font-semibold">Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-[86%] w-full justify-center py-5">
          <div className="flex flex-col w-[70%] gap-4 justify-start items-start">
            {sidebarItems.map((item) => (
              <div key={item.type} className="w-full">
                {/* Nếu có mục con thì sẽ hiển thị Collapsible */}
                {item.children ? (
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer py-2"
                      onClick={() => toggleExpand(item.type)}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span>
                        {expandedItems.includes(item.type) ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>

                    {/* Hiển thị mục con nếu mục lớn được mở rộng */}
                  {expandedItems.includes(item.type) && (
                    <div className="ml-2 mt-2">
                      {item.children.map((child) => (
                        <SidebarItem
                          key={child.type}
                          type={child.type}
                          label={child.label}
                          selectedPage={selectedPage}
                          handlePageChange={handlePageChange}
                          Icon={child.icon}
                          className="gap-12" // Thêm margin-bottom cho mục con
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <SidebarItem
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  selectedPage={selectedPage}
                  handlePageChange={handlePageChange}
                  Icon={item.icon}
                  className=""
                />
              )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;