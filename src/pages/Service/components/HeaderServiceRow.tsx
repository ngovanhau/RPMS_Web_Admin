import React from "react";

type HeaderServiceRowProps = {};

export const HeaderServiceRow: React.FC<HeaderServiceRowProps> = () => {
  return (
    <div className="flex flex-row w-full h-16 cursor-pointer">
      <div className="w-[4%] flex items-center justify-start">
        
      </div>
      <div className="w-[25%]  flex items-center justify-start">
        <span className="text-themeColor font-semibold text-base text-left">
          Tên dịch vụ
        </span>
      </div>
      <div className="w-[15%]  flex items-center justify-start">
        <span className="text-themeColor font-semibold text-base text-left">
          Đơn vị
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-themeColor font-semibold text-base text-left">
          Phí dịch vụ
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-themeColor font-semibold text-base text-left">
          Cập nhật
        </span>
      </div>
      <div className="w-[24%] flex items-center justify-start">
        <span className="text-themeColor font-semibold text-base text-left">
          Ghi chú
        </span>
      </div>
    </div>
  );
};

export default HeaderServiceRow;
