import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { FaUser, FaSignOutAlt, FaChevronDown, FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlineReceiptLong, MdGroup } from "react-icons/md"; 
import logo from '../../assets/logo.png'

const Sidebar: React.FC = () => {
  const { userData, clearUserData } = useAuthStore();
  const [selectedPage, setSelectedPage] = useState<string>("dashboard");
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-[5%] flex items-center justify-start px-10 border-r border-b">
        <img className="h-8 w-8" src={logo} />
        <span className="text-xl text-themeColor ml-5 font-bold">RPMS</span>
      </div>

      <div className="h-[95%] flex-col flex items-center justify-start">
        <div className="w-[70%] h-[8%] flex items-center justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row gap-4 items-center">
              <img
                src="https://i.ibb.co/sqPnpsZ/hau.jpg"
                className="h-10 w-10 object-cover rounded-full bg-red-400"
              />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm text-themeColor">{userData?.lastName}</span>

              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[200px] bg-white rounded-xl border border-themeColor">
              <DropdownMenuLabel className="text-themeColor">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="itemDropDown-Profile" onClick={handleProfile}>
                <FaUser className="mr-2 text-themeColor" />
                <span className="text-[13px]">Thông tin tài khoản</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="itemDropDown-Profile">
                <FaFileInvoiceDollar className="mr-2 text-themeColor" />
                <span className="text-[13px]">Tài liệu hướng dẫn</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="itemDropDown-Profile" onClick={handleChangePass}>
                <MdGroup className="mr-2 text-themeColor" />
                <span className="text-[13px]">Đổi mật khẩu</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-[86%] w-full justify-center py-5">
          <div className="flex flex-col w-[70%] gap-8 justify-start items-start">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.type}
                type={item.type}
                label={item.label}
                selectedPage={selectedPage}
                handlePageChange={handlePageChange}
                Icon={item.icon}
              />
            ))}

            {/* <Collapsible>
              <CollapsibleTrigger className="item-sidebar items-center cursor-pointer text-themeColor">
                <div className="w-10">
                  <MdOutlineReceiptLong size={20} className="text-themeColor" />
                </div>
                <span className="sideBarItemText">Thu chi</span>
                <FaChevronDown className="h-4 w-4 transform transition-transform text-themeColor" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-14 pt-6">
                <ul className="flex flex-col gap-6">
                  <li
                    onClick={() => handlePageChange("accounting/transaction")}
                    className={`${
                      selectedPage === "accounting/transaction"
                        ? "sideBarItemTextAct text-themeColor"
                        : "sideBarItemText hover:text-themeColor"
                    }`}
                  >
                    Đã thanh lý
                  </li>
                  <li
                    onClick={() => handlePageChange("accounting/transactionGroup")}
                    className={`${
                      selectedPage === "accounting/transactionGroup"
                        ? "sideBarItemTextAct text-themeColor"
                        : "sideBarItemText hover:text-themeColor"
                    }`}
                  >
                    Nhóm giao dịch
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible> */}
          </div>
        </div>

        <div className="flex h-[8%] w-[60%] self-center justify-start items-start">
          <button className="flex items-center text-red-500 gap-4 hover:text-red-700" onClick={handleSignOut}>
            <FaSignOutAlt className="size-6" />
            <span className="text-sm font-semibold">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
