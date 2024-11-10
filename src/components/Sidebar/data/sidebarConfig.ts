import { FaTachometerAlt, FaClipboardList, FaMoneyBill, FaLock, FaBuilding, FaDoorOpen, FaConciergeBell, FaUserFriends, FaFileContract, FaUser } from 'react-icons/fa';
export const sidebarItems = [
  {
    type: "dashboard",
    label: "Dashboard",
    icon: FaTachometerAlt,
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
    type: "service",
    label: "Dịch vụ",
    icon: FaConciergeBell,
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
    type: "Account",
    label: "Tài khoản",
    icon: FaUser, 
  },
  {
    type: "Permission",
    label: "Phân quyền",
    icon: FaLock, 
  },
];


