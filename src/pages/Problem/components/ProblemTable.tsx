import React from "react";
import { Problem } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { IoEye } from "react-icons/io5";
import {
  CheckCircle,
  CheckSquare,
  XCircle,
  Edit,
  Trash,
  Eye,
} from "lucide-react";
interface ProblemTableProps {
  problems: Problem[];
  fatalLevelMap: { [key: number]: string };
  statusMap: { [key: number]: string };
  onStatusChange: (updatedProblem: Problem) => void;
  onProblemSelect: (problem: Problem) => void;
  ondelete: (problemId: string) => void;
  onConfirm: (problem: Problem) => void;
  onComplete: (problem: Problem) => void;
  onCancel: (problem: Problem) => void;
  onFix: (problem: Problem) => void;
}

const ProblemTable: React.FC<ProblemTableProps> = ({
  problems,
  fatalLevelMap,
  statusMap,
  onStatusChange,
  onProblemSelect,
  ondelete,
  onConfirm,
  onComplete,
  onCancel,
  onFix,
}) => {
  const handleRowClick = (problem: Problem) => {
    onProblemSelect(problem);
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
                <th className="px-4 py-2 text-left sticky border-2 border-gray-300 top-0 bg-themeColor z-10">
                  Thao tác
                </th>
                <th className="px-4 py-2 text-left sticky border-2 border-gray-300 top-0 bg-themeColor z-10">
                  Tên Phòng
                </th>
                <th className="px-4 py-2 text-left sticky border-2 border-gray-300 top-0 bg-themeColor z-10">
                  Vấn đề
                </th>
                <th className="px-4 py-2 text-left sticky border-2 border-gray-300 top-0 bg-themeColor z-10">
                  Mô tả
                </th>
                <th className="px-4 py-2 text-left sticky border-2 border-gray-300 top-0 bg-themeColor z-10">
                  Mức độ nghiêm trọng
                </th>
                <th className="px-4 py-2 text-left sticky border-2 border-gray-300 top-0 bg-themeColor z-10">
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
                >
                  <td className="px-4 py-2 w-32 text-left sticky border-2 border-gray-300 top-0 z-10 space-x-4">
                    <div className="inline-block">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 focus:outline-none">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white">
                          {item.status === 0 && (
                            <DropdownMenuItem onClick={() => onConfirm(item)}>
                              <CheckCircle className="mr-2 h-4 w-4 " />
                              Xác nhận xử lý
                            </DropdownMenuItem>
                          )}
                          {(item.status === 1) && (
                            <DropdownMenuItem onClick={() => onComplete(item)}>
                              <CheckSquare className="mr-2 h-4 w-4 " />
                              Xác nhận hoàn thành
                            </DropdownMenuItem>
                          )}

                          {(item.status === 2 ||
                            item.status === 1 ||
                            item.status === 0) && (
                            <DropdownMenuItem onClick={() => onCancel(item)}>
                              <XCircle className="mr-2 h-4 w-4 " />
                              Hủy
                            </DropdownMenuItem>
                          )}
                          {/* <DropdownMenuItem onClick={()=> onFix(item)}>
                            <Edit className="mr-2 h-4 w-4 " />
                            Sửa
                          </DropdownMenuItem> */}
                          <DropdownMenuItem onClick={() => ondelete(item.id)}>
                            <Trash className="mr-2 h-4 w-4 " />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div
                      onClick={() => handleRowClick(item)}
                      className="inline-block"
                    >
                      <IoEye className="w-5 h-5 text-themeColor" />
                    </div>
                  </td>

                  <td className="px-4 py-2 border-2 border-gray-300">
                    {item.room_name}
                  </td>
                  <td className="px-4 py-2 border-2 border-gray-300 max-w-xs break-words">
                    {item.problem}
                  </td>
                  <td className="px-4 py-2 border-2 border-gray-300 max-w-sm break-words">
                    {item.decription}
                  </td>
                  <td className="px-4 py-2 border-2 border-gray-300">
                    <span className="block w-full rounded px-3 py-2 text-gray-700 ">
                      {fatalLevelMap[item.fatal_level ?? 0]}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-2 border-gray-300">
                    <span className="block w-full rounded px-3 py-2 text-gray-700 ">
                      {statusMap[item.status ?? 0]}
                    </span>
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
