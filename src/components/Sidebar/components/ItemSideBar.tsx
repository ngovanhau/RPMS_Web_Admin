import React from 'react';
import { IconType } from 'react-icons'; 

type SidebarItemProps = {
  type: string;
  label: string;
  selectedPage: string;
  Icon: IconType; 
  handlePageChange: (page: string) => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, selectedPage, handlePageChange, Icon }) => {
  const isSelected = selectedPage === type;

  return (
    <div
      className={`item-sidebar flex items-center cursor-pointer ${isSelected ? "text-themeColor" : "text-gray-600 hover:text-themeColor"}`}
      onClick={() => handlePageChange(type)}
    >
      <div className="w-10">
        <Icon size={20} color={isSelected ? "#001eb4" : "#4b5563"} /> {/* You can also replace this with themeColor */}
      </div>
      <span className={`${isSelected ? "sideBarItemTextAct text-themeColor" : "sideBarItemText"}`}>
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;
