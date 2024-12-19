import React from "react";

type HeaderServiceRowProps = {};

export const HeaderServiceRow: React.FC<HeaderServiceRowProps> = () => {
  return (
    <div className="flex flex-row w-full  h-12 cursor-pointer"
    style={{ backgroundColor: "#004392" }}
    >
      <div className="w-[7%] border-2 border-gray-300 px-4 py-2 text-white justify-start font-semibold text-base border-r ">
        Thao tác
      </div>
      <div className="w-[30%] border-2 border-gray-300 px-4 flex items-center justify-start font-semibold text-base border-r  text-white ">
          Tên dịch vụ
      </div>
      <div className="w-[35%] border-2 border-gray-300 px-4 flex items-center justify-start font-semibold text-base border-r  text-white ">
          Giá tiền
      </div>
      <div className="w-[30%] border-2 border-gray-300 px-4 flex items-center justify-start font-semibold text-base border-r   text-white ">
          Mô tả
      </div>
    </div>
  );
};

export default HeaderServiceRow;
