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
  return (
    <div className="item-sidebar" onClick={() => handlePageChange(type)}>
      <div className="w-10">
        <Icon size={20} color={selectedPage === type ? "#22c55e" : "#4b5563"} />
      </div>
      <span className={`${selectedPage === type ? "sideBarItemTextAct" : "sideBarItemText"}`}>
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;
