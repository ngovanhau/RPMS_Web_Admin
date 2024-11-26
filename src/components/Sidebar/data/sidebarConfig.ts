import { FaTachometerAlt, FaClipboardList, FaPiggyBank, FaMoneyBill, FaBolt, FaFileInvoiceDollar ,FaLock, FaBuilding, FaDoorOpen, FaConciergeBell, FaUserFriends, FaFileContract, FaUser, FaCalendarAlt } from 'react-icons/fa';
export const sidebarItems = [
  {
    type: "dashboard",
    label: "Dashboard",
    icon: FaTachometerAlt,
  },
  {
    type: "building",
    label: "Tòa nhà",
    icon: FaBuilding,
  },
  {
    type: "room",
    label: "Phòng",
    icon: FaDoorOpen,
  },
  {
    type: "Booking",
    label: "Khách hẹn xem",
    icon: FaCalendarAlt, 
  },
  {
    type: "Tenant",
    label: "Người thuê",
    icon: FaUserFriends,
  },
  {
    type: "Contract",
    label: "Hợp đồng",
    icon: FaFileContract,
  },
  {
    type: "service",
    label: "Dịch vụ",
    icon: FaConciergeBell,
  },
  {
    type: "problem",
    label: "Sự cố",
    icon: FaBolt,
  },
  {
    type: "roomstatement",
    label: "Chốt điện nước",
    icon: FaClipboardList,
  },
  {
    type: "deposit",
    label: "Cọc giữ chỗ",
    icon: FaMoneyBill,
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
    type: "Permission",
    label: "Phân quyền",
    icon: FaLock, 
  },
  {
    type: "Account",
    label: "Tài khoản",
    icon: FaUser, 
  },
];



