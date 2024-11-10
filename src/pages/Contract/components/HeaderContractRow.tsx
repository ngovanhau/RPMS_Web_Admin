import React from "react";

type HeaderContractRowProps = {};

export const HeaderContractRow: React.FC<HeaderContractRowProps> = () => {
  return (
    <div className="flex flex-row w-full h-16 cursor-pointer">
      <div className="w-[5%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
         
        </span>
      </div>
      <div className="w-[20%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Tên người thuê
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Phòng
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Ngày bắt đầu
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Ngày kết thúc
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Giá thuê phòng
        </span>
      </div>
      <div className="w-[15%] flex items-center justify-start">
        <span className="text-green-400 font-semibold text-base text-left">
          Tiền cọc
        </span>
      </div>
    </div>
  );
};

export default HeaderContractRow;
