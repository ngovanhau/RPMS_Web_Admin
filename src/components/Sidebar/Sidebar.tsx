// Sidebar.tsx
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
import { sidebarItems } from "./data/sidebarConfig";
import useAuthStore from "@/stores/userStore";
const Sidebar: React.FC = () => {
  const {userData, clearUserData} = useAuthStore();
  const [selectedPage, setSelectedPage] = useState<string>("dashboard");
  const navigate = useNavigate();
  // Hàm để thay đổi trang được chọn
  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    navigate(`/${page}`)
  };

  

  const handleSignOut = () => {
    clearUserData();
    localStorage.removeItem("authToken");
    navigate("/");
  }

  const handleProfile = () => {
    navigate("/profile")
  }

  const handleChangePass = () => {
    navigate("/Changepass")
  }
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header hoặc tên sidebar */}
      <div className="h-[5%] flex items-center justify-start  px-10 border-r border-b">
        <img className="h-8 w-8" src="https://i.ibb.co/QbdnKPT/logo.png" />
        <span className="text-xl text-black ml-5 font-bold">RPMS</span>
      </div>
      {/* Nội dung chính của sidebar */}
      <div className="h-[95%] flex-col  flex items-center justify-start">
        <div className="w-[70%] h-[8%]  flex items-center justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex  flex-row gap-4 items-center">
              <img
                src="https://i.ibb.co/sqPnpsZ/hau.jpg"
                className="h-10 w-10 object-cover rounded-full bg-red-400"
              />
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm">{userData?.lastName}</span>
                <span className="text-sm text-gray-400">
                  {userData?.email == null ? "Chưa có email" : userData.email}
                </span>
              </div>
            </DropdownMenuTrigger>
  
            <DropdownMenuContent className="w-[200px] bg-white rounded-xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="itemDropDown-Profile"
              onClick={handleProfile}>
              <span className="text-[13px]">👤 Thông tin tài khoản</span>
                
              </DropdownMenuItem>
              <DropdownMenuItem className="itemDropDown-Profile">
                <span className="text-[13px]">💵 Tài liệu hướng dẫn</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="itemDropDown-Profile"
              onClick={handleChangePass}>
                <span className="text-[13px]">👥 Đổi mật khẩu </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> 
        </div>

        <div className="flex h-[86%]  w-full justify-center py-5">
          <div className="flex flex-col w-[70%] gap-8 justify-start items-start ">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.type}
                type={item.type}
                label={item.label}
                selectedPage={selectedPage}
                handlePageChange={handlePageChange}
                pathIcon={item.pathIcon}
              />
            ))}
            <Collapsible>
              <CollapsibleTrigger className="item-sidebar items-center cursor-pointer">
                <div className="w-10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 10C10.9946 10 11.9484 9.60491 12.6517 8.90165C13.3549 8.19839 13.75 7.24456 13.75 6.25C13.75 5.25544 13.3549 4.30161 12.6517 3.59835C11.9484 2.89509 10.9946 2.5 10 2.5C9.00544 2.5 8.05161 2.89509 7.34835 3.59835C6.64509 4.30161 6.25 5.25544 6.25 6.25C6.25 7.24456 6.64509 8.19839 7.34835 8.90165C8.05161 9.60491 9.00544 10 10 10V10ZM12.5 6.25C12.5 6.91304 12.2366 7.54893 11.7678 8.01777C11.2989 8.48661 10.663 8.75 10 8.75C9.33696 8.75 8.70107 8.48661 8.23223 8.01777C7.76339 7.54893 7.5 6.91304 7.5 6.25C7.5 5.58696 7.76339 4.95107 8.23223 4.48223C8.70107 4.01339 9.33696 3.75 10 3.75C10.663 3.75 11.2989 4.01339 11.7678 4.48223C12.2366 4.95107 12.5 5.58696 12.5 6.25V6.25ZM17.5 16.25C17.5 17.5 16.25 17.5 16.25 17.5H3.75C3.75 17.5 2.5 17.5 2.5 16.25C2.5 15 3.75 11.25 10 11.25C16.25 11.25 17.5 15 17.5 16.25ZM16.25 16.245C16.2487 15.9375 16.0575 15.0125 15.21 14.165C14.395 13.35 12.8613 12.5 10 12.5C7.1375 12.5 5.605 13.35 4.79 14.165C3.9425 15.0125 3.7525 15.9375 3.75 16.245H16.25Z"
                      fill="#4b5563"
                    ></path>
                  </svg>
                </div>
                <span className="sideBarItemText">Người thuê</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transform transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-14 pt-6">
                <ul className="flex flex-col gap-6 ">
                  <li
                    onClick={() => handlePageChange("tenant/assigned_room")}
                    className={`${
                      selectedPage === "tenant/assigned_room"
                        ? "sideBarItemTextAct"
                        : "sideBarItemText"
                    }`}
                  >
                    Đã có phòng
                  </li>
                  <li
                    onClick={() => handlePageChange("tenant/not_assigned_room")}
                    className={`${
                      selectedPage === "tenant/not_assigned_room"
                        ? "sideBarItemTextAct"
                        : "sideBarItemText"
                    }`}
                  >
                    Chưa có phòng
                  </li>
                  <li
                    onClick={() => handlePageChange("tenant/canceled")}
                    className={`${
                      selectedPage === "tenant/canceled"
                        ? "sideBarItemTextAct"
                        : "sideBarItemText"
                    }`}
                  >
                    Đã thanh lý
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="item-sidebar items-center cursor-pointer">
                <div className="w-10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.00004 9.33333H5.33337V10.6667H6.00004V9.33333ZM14 10.6667H14.6667V9.33333H14V10.6667ZM6.00004 5.33333H5.33337V6.66667H6.00004V5.33333ZM8.66671 6.66667H9.33337V5.33333H8.66671V6.66667ZM14 0.666667L14.472 0.194667L14.276 0H14V0.666667ZM18 4.66667H18.6667V4.39067L18.472 4.19467L18 4.66667V4.66667ZM10.6667 14.6667L10.1947 15.1387L10.6667 14.6667ZM10 15.3333L10.2987 15.9293L10.352 15.9027L10.4 15.8667L10 15.3333ZM6.00004 10.6667H14V9.33333H6.00004V10.6667ZM6.00004 6.66667H8.66671V5.33333H6.00004V6.66667ZM16.6667 18.6667H3.33337V20H16.6667V18.6667ZM2.66671 18V2H1.33337V18H2.66671ZM3.33337 1.33333H14V0H3.33337V1.33333ZM17.3334 4.66667V18H18.6667V4.66667H17.3334ZM13.528 1.13867L17.528 5.13867L18.472 4.19467L14.472 0.194667L13.528 1.13867V1.13867ZM3.33337 18.6667C3.15656 18.6667 2.98699 18.5964 2.86197 18.4714C2.73695 18.3464 2.66671 18.1768 2.66671 18H1.33337C1.33337 18.5304 1.54409 19.0391 1.91916 19.4142C2.29423 19.7893 2.80294 20 3.33337 20V18.6667ZM16.6667 20C17.1971 20 17.7058 19.7893 18.0809 19.4142C18.456 19.0391 18.6667 18.5304 18.6667 18H17.3334C17.3334 18.1768 17.2631 18.3464 17.1381 18.4714C17.0131 18.5964 16.8435 18.6667 16.6667 18.6667V20ZM2.66671 2C2.66671 1.82319 2.73695 1.65362 2.86197 1.5286C2.98699 1.40357 3.15656 1.33333 3.33337 1.33333V0C2.80294 0 2.29423 0.210714 1.91916 0.585786C1.54409 0.960859 1.33337 1.46957 1.33337 2H2.66671ZM7.29871 15.544C7.44671 15.1 7.86804 14.688 8.40537 14.544C8.90804 14.4093 9.55471 14.4973 10.1947 15.1387L11.1387 14.1947C10.1787 13.2347 9.04671 12.9907 8.06004 13.256C7.10937 13.512 6.33071 14.2333 6.03337 15.1227L7.30004 15.544H7.29871ZM10.1947 15.1387C10.2322 15.1751 10.2674 15.2138 10.3 15.2547L11.3534 14.436C11.2869 14.3516 11.2152 14.2715 11.1387 14.196L10.1947 15.1387ZM10.3 15.2547C10.404 15.388 10.38 15.4307 10.384 15.4013C10.3867 15.3827 10.392 15.4133 10.312 15.4853C10.1968 15.5817 10.066 15.6579 9.92537 15.7107C9.75637 15.7787 9.5801 15.827 9.40004 15.8547C9.2902 15.8756 9.17787 15.8801 9.06671 15.868C9.04404 15.8627 9.09071 15.868 9.16004 15.9173C9.24506 15.9829 9.30756 16.0734 9.33886 16.1761C9.37016 16.2789 9.36871 16.3888 9.33471 16.4907C9.32715 16.5128 9.31685 16.5338 9.30404 16.5533C9.30137 16.556 9.32404 16.5267 9.40004 16.464C9.55204 16.3413 9.83204 16.1627 10.2987 15.9307L9.70137 14.7373C9.19871 14.988 8.82137 15.2173 8.56271 15.4267C8.43153 15.5291 8.3149 15.6488 8.21604 15.7827C8.0903 15.951 8.02458 16.1566 8.02937 16.3667C8.04271 16.6547 8.19871 16.8667 8.36937 16.9907C8.52004 17.1027 8.68671 17.1507 8.80937 17.176C9.05871 17.2253 9.34271 17.212 9.60004 17.1733C10.1067 17.096 10.7627 16.8773 11.2094 16.472C11.4414 16.26 11.6614 15.956 11.708 15.5573C11.756 15.1493 11.6094 14.7667 11.352 14.4373L10.2987 15.2547H10.3ZM10.4 15.8667C10.6134 15.7035 10.8452 15.5661 11.0907 15.4573L10.5614 14.2333C10.2414 14.372 9.92137 14.56 9.60004 14.8L10.4 15.8667V15.8667ZM11.0907 15.4573C11.9574 15.0827 12.732 15.28 13.5254 15.6573C13.7254 15.7533 13.92 15.8573 14.1174 15.964C14.3094 16.068 14.512 16.1787 14.704 16.2773C15.072 16.4627 15.528 16.6667 16 16.6667V15.3333C15.8747 15.3333 15.6694 15.2707 15.3067 15.088C15.136 15 14.9574 14.9013 14.752 14.7907C14.552 14.6827 14.3307 14.564 14.0987 14.4547C13.168 14.0107 11.9507 13.6333 10.5614 14.2333L11.0907 15.4573V15.4573Z"
                      fill="#4b5563"
                    ></path>
                  </svg>
                </div>
                <span className="sideBarItemText">Thu chi</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transform transition-transform"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-14 pt-6">
                <ul className="flex flex-col gap-6 ">
                  <li
                    onClick={() => handlePageChange("accounting/transaction")}
                    className={`${
                      selectedPage === "accounting/transaction"
                        ? "sideBarItemTextAct"
                        : "sideBarItemText"
                    }`}
                  >
                    Đã thanh lý
                  </li>
                  <li
                    onClick={() =>
                      handlePageChange("accounting/transactionGroup")
                    }
                    className={`${
                      selectedPage === "accounting/transactionGroup"
                        ? "sideBarItemTextAct"
                        : "sideBarItemText"
                    }`}
                  >
                    Nhóm giao dịch
                  </li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        <div className="flex h-[8%] w-[60%] self-center justify-start items-start ">
          <button className="flex items-center text-red-500 gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>

            <span onClick={handleSignOut} className="text-sm font-semibold">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
