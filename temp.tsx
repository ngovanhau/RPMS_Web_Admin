import React from 'react';

const DashBoardBuidling: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 bg-gray-100  w-full overflow-y-hidden">
        <div className="h-[5%] flex flex-row px-6 gap-4 items-center justify-start border-b-b bg-white w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          className="w-full border-none focus:outline-none"
          placeholder="Tìm kiếm bằng tên tòa nhà"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
      </div>

      <div className="flex h-[95%] p-6 overflow-hidden">
        <div className="flex flex-1 flex-col py-4 px-4 w-full bg-white">
aaa
      </div>
      </div>

    </div>
  );
};

export default DashBoardBuidling;
