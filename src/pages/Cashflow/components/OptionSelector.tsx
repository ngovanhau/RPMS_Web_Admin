// components/OptionSelector.tsx
import React from "react";

interface OptionSelectorProps {
  options: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedOption,
  onOptionChange,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      {options.map((option) => (
        <button
          key={option}
          className={`px-4 py-2 rounded text-white ${
            selectedOption === option
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => onOptionChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default OptionSelector;
