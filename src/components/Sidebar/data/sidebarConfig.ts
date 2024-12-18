import { FaClipboardList, FaPiggyBank, FaMoneyBill, FaBolt, FaFileInvoiceDollar, FaRegCreditCard ,FaLock, FaBuilding, FaDoorOpen, FaConciergeBell, FaUserFriends, FaFileContract, FaUser, FaCalendarAlt, FaRegBuilding } from 'react-icons/fa';
import { TbBrandDatabricks } from "react-icons/tb";
import { MdHomeRepairService, MdOutlineContactPage, MdOutlineDashboard, MdOutlineReportProblem } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { FaUserLock } from "react-icons/fa6";

export const sidebarItems = [
  {
    type: "dashboard",
    label: "Dashboard",
    icon: MdOutlineDashboard,
  },
  {
    type: "data-categories",
    label: "Danh mục dữ liệu",
    icon: TbBrandDatabricks, 
    children: [
      { type: "building", 
        label: "Tòa nhà", 
        icon: FaRegBuilding 
      },
      { 
        type: "room",
        label: "Phòng",
        icon: FaDoorOpen },
      { 
        type: "service",
        label: "Dịch vụ",
        icon: MdHomeRepairService  
      },
    ],
  },

  {
    type: "data-customer",
    label: "Khách hàng",
    icon: MdOutlineContactPage , 
    children: [
      {
        type: "Booking",
        label: "Khách hẹn xem",
        icon: FaCalendarAlt, 
      },
      {
        type: "deposit",
        label: "Đặt cọc",
        icon: FaMoneyBill,
      },
      {
        type: "Contract",
        label: "Hợp đồng thuê",
        icon: FaFileContract,
      },
      {
        type: "Tenant",
        label: "Khách hàng",
        icon: FaUserFriends,
      },
    ],
  },
  {
    type: "data-cost",
    label: "Tài chính",
    icon: BsCurrencyDollar, 
    children: [
      {
        type: "roomstatement",
        label: "Chốt điện nước",
        icon: FaClipboardList,
      },
      {
        type: "invoice",
        label: "Hóa đơn",
        icon: FaFileInvoiceDollar,
      },
      {
        type: "income-expense",
        label: "Thu chi",
        icon: FaPiggyBank, 
      },
      {
        type: "transaction-group",
        label: "Nhóm giao dịch",
        icon: FaRegCreditCard
      }
    ],
  },
  
  {
    type: "problem",
    label: "Sự cố/Công việc",
    icon: MdOutlineReportProblem,
  },
  
  {
    type: "Permission",
    label: "Phân quyền",
    icon: FaUserLock, 
  },
  {
    type: "Account",
    label: "Tài khoản",
    icon: FaUser, 
  },
];



