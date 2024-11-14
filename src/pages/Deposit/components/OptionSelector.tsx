import React from "react";
import { Building } from "@/types/types";

interface OptionSelectorProps {
  options: string[];
  selectedOption: string;
  buildings: Building[];
  onOptionChange: (option: string) => void;
  onBuildingChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedOption,
  buildings,
  onOptionChange,
  onBuildingChange,
}) => (
  <div className="flex justify-between items-center border-b pb-4 mb-4">
    <div className="flex gap-4">
      {options.map((option) => (
        <button
          key={option}
          className={`px-4 py-2 font-medium text-sm rounded ${
            selectedOption === option
              ? "text-themeColor border-b-2 border-themeColor"
              : "text-gray-600 hover:text-themeColor hover:border-b-2 hover:border-themeColor"
          }`}
          onClick={() => onOptionChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <label htmlFor="building-select" className="font-medium text-sm">
        Tòa nhà
      </label>
      <select
        id="building-select"
        className="w-64 border border-gray-300 rounded px-2 py-1 focus:outline-none text-sm text-gray-700 hover:bg-gray-100 hover:text-themeColor"
        onChange={onBuildingChange}
      >
        <option value="">Chọn tòa nhà</option>
        {buildings.map((building, index) => (
          <option key={index} value={building.building_name}>
            {building.building_name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default OptionSelector;
