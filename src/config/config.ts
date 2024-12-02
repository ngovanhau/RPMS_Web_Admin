import { Building } from "@/types/types";

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
export const sortBuildingsByName = (buildings: Building[]): Building[] => {
  return [...buildings].sort((a, b) => {
    // Chuyển tên về chữ thường để so sánh không phân biệt hoa thường
    const nameA = a.building_name.toLowerCase();
    const nameB = b.building_name.toLowerCase();
    
    // So sánh theo thứ tự từ điển
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
};

export const formatDateTime = (date: string | Date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0'); // Lấy ngày và thêm 0 nếu chỉ có 1 chữ số
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng (bắt đầu từ 0, nên cần cộng thêm 1)
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};