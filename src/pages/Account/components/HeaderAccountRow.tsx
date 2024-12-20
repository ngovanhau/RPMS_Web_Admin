import React from "react";

type HeaderAccountRowProps = {};

export const HeaderAccountRow: React.FC<HeaderAccountRowProps> = () => {
  return (
    <div className="flex flex-row w-full h-12 bg-themeColor text-white cursor-pointer">
      
      <div className="w-[20%] border border-gray-300 px-4 flex items-center justify-center">
        <span className="  text-white font-semibold text-base text-left">
          Tên đăng nhập
        </span>
      </div>
      <div className="w-[12%] border border-gray-300 px-4 flex items-center justify-center">
        <span className="  text-white font-semibold text-base text-left">
          Họ
        </span>
      </div>
      <div className="w-[12%] border border-gray-300 px-4 flex items-center justify-center">
        <span className="  text-white font-semibold text-base text-left">
          Tên
        </span>
      </div>
      <div className="w-[10%] border border-gray-300 px-4 flex items-center justify-center">
        <span className="  text-white font-semibold text-base text-left">
          Vai trò
        </span>
      </div>
      <div className="w-[23%] border border-gray-300 px-4 flex items-center justify-center">
        <span className="  text-white font-semibold text-base text-left">
          Email
        </span>
      </div>
      <div className="w-[14%] border border-gray-300 px-4 flex items-center justify-center">
        <span className="  text-white font-semibold text-base text-left">
          Số điện thoại
        </span>
      </div>
      <div className="w-[14%] border border-gray-300 px-4 flex items-center justify-center">
        <span className="text-white font-semibold text-base text-left">
          Thao tác
        </span>
      </div>
    </div>
  );
};

export default HeaderAccountRow;
