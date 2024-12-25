import React from "react";
import Viewer from "react-viewer";
import { Card, CardContent } from "@/components/ui/card";
import { Problem } from "@/types/types";

interface ProblemViewProps {
  problem: Problem;
}

const ProblemView: React.FC<ProblemViewProps> = ({ problem }) => {
  const [visible, setVisible] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const fields = [
    { label: "Tên phòng", value: problem.room_name },
    { label: "Sự cố", value: problem.problem },
    { label: "Mô tả", value: problem.decription },
    { label: "Giải quyết" , value: problem.solution}
  ];

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        {fields.map(({ label, value }) => (
          <div key={label} className="mb-6 last:mb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              {label}:
            </label>
            <p className="text-gray-800 text-base">
              {value || ""}
            </p>
          </div>
        ))}

        {problem.image && problem.image.length > 0 && problem.image?.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-600 mb-3">
              Ảnh:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {problem.image.map((imgSrc, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setVisible(true);
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`Problem image ${index + 1}`}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                </div>
              ))}
            </div>

            <Viewer
              visible={visible}
              onClose={() => setVisible(false)}
              images={problem.image.map((imgSrc) => ({ 
                src: imgSrc, 
                alt: "Problem image" 
              }))}
              activeIndex={currentImageIndex}
              zoomable={false}
              rotatable={false}
              scalable={false}
              noClose={false}
              drag={false}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemView;