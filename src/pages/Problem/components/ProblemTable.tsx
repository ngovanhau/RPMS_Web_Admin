import React from "react";
import { Problem } from "@/types/types";

interface ProblemTableProps {
  problems: Problem[];
  fatalLevelMap: { [key: number]: string };
  statusMap: { [key: number]: string };
  onFatalLevelChange: (updatedProblem: Problem) => void;
  onStatusChange: (updatedProblem: Problem) => void;
  onProblemSelect: (problem: Problem) => void;
}

const ProblemTable: React.FC<ProblemTableProps> = ({
  problems,
  fatalLevelMap,
  statusMap,
  onFatalLevelChange,
  onStatusChange,
  onProblemSelect,
}) => {
  const handleRowClick = (problem: Problem) => {
    onProblemSelect(problem);
  };

  const handleFatalLevelChange = (
    id: string,
    fatalLevel: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.stopPropagation();
    const updatedProblem = problems.find((problem) => problem.id === id);
    if (updatedProblem) {
      const updatedData = { ...updatedProblem, fatal_level: fatalLevel };
      onFatalLevelChange(updatedData);
    }
  };

  const handleStatusChange = (
    id: string,
    status: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.stopPropagation();
    const updatedProblem = problems.find((problem) => problem.id === id);
    if (updatedProblem) {
      const updatedData = { ...updatedProblem, status };
      onStatusChange(updatedData);
    }
  };

  return (
    <div className="p-4 bg-white">
      {problems.length === 0 ? (
        <div className="text-center h-[30vh] w-full flex justify-center items-end py-4 text-gray-500">
          <span className="text-sm text-gray-500">Không có dữ liệu</span>
        </div>
      ) : (
        <div className="overflow-auto max-h-[750px]">
          {/* Set a max height as per your requirement */}
          <table className="w-full text-sm rounded-lg table-auto">
            <thead className="bg-themeColor text-white">
              <tr className="h-14">
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Tên Phòng
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Vấn đề
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Mô tả
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Mức độ nghiêm trọng
                </th>
                <th className="px-4 py-2 text-left sticky top-0 bg-themeColor z-10">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {problems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-100 h-14`}
                  onClick={() => handleRowClick(item)}
                >
                  <td className="px-4 py-2">{item.room_name}</td>
                  <td className="px-4 py-2 max-w-xs break-words">
                    {item.problem}
                  </td>
                  <td className="px-4 py-2 max-w-sm break-words">
                    {item.decription}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={item.fatal_level ?? 0}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleFatalLevelChange(
                          item.id,
                          parseInt(e.target.value),
                          e
                        )
                      }
                      className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {Object.entries(fatalLevelMap).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={item.status ?? 0}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleStatusChange(
                          item.id,
                          parseInt(e.target.value),
                          e
                        )
                      }
                      className="w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {Object.entries(statusMap).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProblemTable;
