import React from "react";
import { FaPlus } from "react-icons/fa";

interface AddDepositButtonProps {
  onClick: () => void;
}

const AddDepositButton: React.FC<AddDepositButtonProps> = ({ onClick }) => (
  <button
    className="fixed bottom-[15%] right-[5%] w-16 h-16 rounded-full bg-themeColor text-white flex items-center justify-center shadow-lg hover:bg-themeColor-dark"
    onClick={onClick}
  >
    <FaPlus />
  </button>
);

export default AddDepositButton;
