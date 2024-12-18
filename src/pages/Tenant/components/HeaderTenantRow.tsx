import React from "react";

type HeaderTenantRowProps = {};

export const HeaderTenantRow: React.FC<HeaderTenantRowProps> = () => {
  return (
    <div className="flex flex-row w-full h-12 bg-themeColor cursor-pointer">
      <div className="w-[4%] border border-gray-300 px-4  flex items-center justify-start">
      </div>
      <div className="w-[25%] border border-gray-300 px-4   flex items-center justify-start">
        <span className="text-white font-semibold text-base text-left">
          Tên người thuê
        </span>
      </div>
      <div className="w-[15%]  border border-gray-300 px-4  flex items-center justify-start">
        <span className="text-white font-semibold text-base text-left">
          Phòng
        </span>
      </div>
      <div className="w-[15%] border border-gray-300 px-4  flex items-center justify-start">
        <span className="text-white font-semibold text-base text-left">
          Số điện thoại
        </span>
      </div>
      <div className="w-[15%] border border-gray-300 px-4  flex items-center justify-start">
        <span className="text-white font-semibold text-base text-left">
          CMND/CCCD
        </span>
      </div>
      <div className="w-[26%] border border-gray-300 px-4  flex items-center justify-start">
        <span className="text-white font-semibold text-base text-left">
          Email
        </span>
      </div>
    </div>
  );
};

export default HeaderTenantRow;
