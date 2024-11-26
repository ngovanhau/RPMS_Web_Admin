import React from "react";

type HeaderServiceRowProps = {};

export const HeaderServiceRow: React.FC<HeaderServiceRowProps> = () => {
  return (
    <div className="flex flex-row w-full h-12 cursor-pointer bg-themeColor">
      <div className="w-[4%] border border-gray-300 px-4 py-2">
        
      </div>
      <div className="w-[25%] px-4 flex items-center justify-start border border-gray-300">
        <span className="text-white font-semibold text-base text-left">
          Tên dịch vụ
        </span>
      </div>
      <div className="w-[15%] px-4 flex items-center justify-start border border-gray-300">
        <span className="text-white font-semibold text-base text-left">
          Đơn vị
        </span>
      </div>
      <div className="w-[15%] px-4 flex items-center justify-start border border-gray-300">
        <span className="text-white font-semibold text-base text-left">
          Phí dịch vụ
        </span>
      </div>
      <div className="w-[15%] px-4 flex items-center justify-start border border-gray-300">
        <span className="text-white font-semibold text-base text-left">
          Cập nhật
        </span>
      </div>
      <div className="w-[26%] px-4 flex items-center justify-start border border-gray-300">
        <span className="text-white font-semibold text-base text-left">
          Ghi chú
        </span>
      </div>
    </div>
  );
};

export default HeaderServiceRow;
