import React from 'react';
import { IconType } from 'react-icons';

type SidebarItemProps = {
  type: string;
  label: string;
  selectedPage: string;
  Icon: IconType;
  handlePageChange: (page: string) => void;
  className?: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, selectedPage, handlePageChange, Icon, className }) => {
  const isSelected = selectedPage === type;

  return (
    <div
      className={`item-sidebar flex items-center cursor-pointer ${isSelected ? "text-themeColor" : "text-gray-600 hover:text-themeColor "}${className}`}
      onClick={() => handlePageChange(type)}
    >
      <div className="w-10 mt-4">
        <Icon size={20} color={isSelected ? "#001eb4" : "#4b5563"} />
      </div>
      <span className={`${isSelected ? "sideBarItemTextAct mt-4 text-themeColor" : "sideBarItemText mt-4"}`}>
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;
