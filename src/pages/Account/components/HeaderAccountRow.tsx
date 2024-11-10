import React from "react";

type HeaderAccountRowProps = {};

export const HeaderAccountRow: React.FC<HeaderAccountRowProps> = () => {
  return (
    <div className="flex flex-row w-full h-16 cursor-pointer">
      {/* Empty space for margin */}
      <div className="w-[4%]"></div>
      
      <div className="w-[25%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Tên đăng nhập
        </span>
      </div>
      <div className="w-[12%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Họ
        </span>
      </div>
      <div className="w-[12%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Tên
        </span>
      </div>
      <div className="w-[10%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Vai trò
        </span>
      </div>
      <div className="w-[23%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Email
        </span>
      </div>
      <div className="w-[14%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Số điện thoại
        </span>
      </div>
    </div>
  );
};

export default HeaderAccountRow;
