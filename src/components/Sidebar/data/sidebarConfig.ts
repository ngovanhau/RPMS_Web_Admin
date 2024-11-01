import { FaTachometerAlt, FaClipboardList, FaMoneyBill, FaBuilding, FaDoorOpen, FaConciergeBell, FaUserFriends, FaFileContract } from 'react-icons/fa';

export const sidebarItems = [
  {
    type: "dashboard",
    label: "Dashboard",
    icon: FaTachometerAlt, // Icon bảng điều khiển
  },
  {
    type: "roomstatement",
    label: "Chốt điện nước",
    icon: FaClipboardList, // Icon cho các báo cáo hoặc danh sách
  },
  {
    type: "deposit",
    label: "Cọc giữ chỗ",
    icon: FaMoneyBill, // Icon đại diện cho cọc tiền
  },
  {
    type: "building",
    label: "Tòa nhà",
    icon: FaBuilding, // Icon cho tòa nhà
  },
  {
    type: "room",
    label: "Phòng",
    icon: FaDoorOpen, // Icon cửa phòng
  },
  {
    type: "service",
    label: "Dịch vụ",
    icon: FaConciergeBell, // Icon đại diện cho dịch vụ
  },
  {
    type: "Tenant",
    label: "Người thuê",
    icon: FaUserFriends, // Icon người thuê
  },
  {
    type: "Contract",
    label: "Hợp đồng",
    icon: FaFileContract, // Icon hợp đồng
  },
];
