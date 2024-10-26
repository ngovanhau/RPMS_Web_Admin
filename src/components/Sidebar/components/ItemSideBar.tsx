import React from 'react';

type SidebarItemProps = {
  type: string;
  label: string;
  selectedPage: string;
  pathIcon: string;
  handlePageChange: (page: string) => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, selectedPage, handlePageChange, pathIcon }) => {
  return (
    <div className="item-sidebar" onClick={() => handlePageChange(type)}>
      <div className="w-10">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={pathIcon}
            stroke={`${selectedPage === type ? "#22c55e" : "#4b5563"}`} // Thêm màu sắc cho stroke
            strokeWidth="1.4"
          />
        </svg>
      </div>
      <span className={`${selectedPage === type ? "sideBarItemTextAct" : "sideBarItemText"}`}>
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;
