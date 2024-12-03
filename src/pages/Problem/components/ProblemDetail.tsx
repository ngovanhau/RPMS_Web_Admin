import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Image,
  Info,
} from "lucide-react";
import { Problem } from "@/types/types";
import { updateProblemById } from "@/services/problemApi/problemApi";
import Viewer from "react-viewer"; // Import React Viewer

interface ProblemCardProps {
  problem: Problem | null;
  onClose: () => void; // Hàm đóng modal
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onClose }) => {
  const [problemState, setProblemState] = useState(problem?.problem || "");
  const [descriptionState, setDescriptionState] = useState(
    problem?.decription || ""
  );
  const [isEdited, setIsEdited] = useState(false);
  const [visible, setVisible] = useState(false); // Trạng thái hiển thị Viewer
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Vị trí ảnh đang xem

  if (!problem) {
    return <div className="text-center text-gray-500">Không có dữ liệu</div>;
  }

  const getFatalLevelBadge = (level?: number) => {
    switch (level) {
      case 0:
        return <Badge className="bg-green-500 text-white">Thấp</Badge>;
      case 1:
        return <Badge className="bg-yellow-500 text-white">Trung bình</Badge>;
      case 2:
        return <Badge className="bg-red-500 text-white">Cao</Badge>;
      default:
        return <Badge className="bg-gray-400 text-white">Không rõ</Badge>;
    }
  };

  const getStatusIcon = (status?: number) => {
    switch (status) {
      case 0:
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 1:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "Không xác định";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
    if (!problem) return;

    const updatedProblem = {
      ...problem,
      problem: problemState,
      decription: descriptionState,
    };

    try {
      // Gửi dữ liệu cập nhật lên API
      await updateProblemById(updatedProblem.id, updatedProblem);

      // Reset trạng thái chỉnh sửa sau khi lưu thành công
      setIsEdited(false);

      // Đóng modal
      onClose();
    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  return (
    <Card className="border-none shadow-none rounded-none transition-shadow duration-200">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {problem.room_name || "Phòng không xác định"}
            </h2>
            <div className="flex items-center space-x-2">
              {getFatalLevelBadge(problem.fatal_level)}
              {getStatusIcon(problem.status)}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-700">Sự cố:</h3>
              <textarea
                className="w-full p-2 border rounded-md text-gray-600"
                value={problemState}
                onChange={(e) => {
                  setProblemState(e.target.value);
                  setIsEdited(true);
                }}
              />
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-700">Mô tả chi tiết:</h3>
              <textarea
                className="w-full p-2 border rounded-md text-gray-600"
                value={descriptionState}
                onChange={(e) => {
                  setDescriptionState(e.target.value);
                  setIsEdited(true);
                }}
              />
            </div>
          </div>
          {problem.image &&
            Array.isArray(problem.image) &&
            problem.image.length > 0 && (
              <div className="flex items-start space-x-2">
                <Image className="w-5 h-5 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-700">Hình ảnh:</h3>
                  <div className="flex flex-row mt-4">
                    {problem.image.map((item, index) => (
                      <img
                        key={index} // Sử dụng index nếu không có giá trị duy nhất
                        src={item} // Đường dẫn ảnh
                        alt="Sự cố"
                        className="rounded-lg max-h-48 object-cover mx-auto mr-4 cursor-pointer"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setVisible(true);
                        }} // Mở Viewer khi click vào ảnh
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

          <Viewer
            visible={visible}
            onClose={() => setVisible(false)}
            images={problem.image?.map((src) => ({ src })) || []}
            activeIndex={currentImageIndex}
            className="h-[80vh] w-[80vw]"
          />

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            {/* <div>
              <h4 className="text-sm text-gray-500">Ngày tạo:</h4>
              <p className="text-sm text-gray-600">
                {formatDate(problem.createdAt)}
              </p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Cập nhật lần cuối:</h4>
              <p className="text-sm text-gray-600">
                {formatDate(problem.updatedAt)}
              </p>
            </div> */}
          </div>
          {isEdited && (
            <div className="text-right">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
