// ViewTenant.tsx

import React, { useState } from "react";
import { Tenant } from "@/types/types";
import { Image, Button, Descriptions } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface ViewTenantProps {
  tenant: Tenant;
  onClose: () => void;
}

const ViewTenant: React.FC<ViewTenantProps> = ({ tenant, onClose }) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // Function to handle image preview
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  return (
    <div className="w-full p-6 bg-white">
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Họ và Tên">
          {tenant.customer_name}
        </Descriptions.Item>
        <Descriptions.Item label="Số Điện Thoại">
          {tenant.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {tenant.email || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày Sinh">
          {tenant.date_of_birth
            ? new Date(tenant.date_of_birth).toLocaleDateString()
            : "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Phòng Thuê">
          {tenant.choose_room !== "00000000-0000-0000-0000-000000000000"
            ? tenant.roomName
            : "Chưa chọn"}
        </Descriptions.Item>
        <Descriptions.Item label="Số CMND/CCCD">
          {tenant.cccd || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Nơi Cấp">
          {tenant.place_of_issue || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày Cấp">
          {tenant.date_of_issue
            ? new Date(tenant.date_of_issue).toLocaleDateString()
            : "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa Chỉ">
          {tenant.address || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Ảnh CMND/CCCD">
          <div className="flex flex-wrap gap-4">
            {tenant.imageCCCDs && tenant.imageCCCDs.length > 0 ? (
              tenant.imageCCCDs.map((url, index) => (
                <Image
                  key={index}
                  width={100}
                  src={url}
                  alt={`CCCD ${index + 1}`}
                  style={{ cursor: "pointer" }}
                  preview={false} // Disable default preview
                  onClick={() => handlePreview(url)}
                />
              ))
            ) : (
              <span>Không có ảnh</span>
            )}
          </div>
        </Descriptions.Item>
      </Descriptions>
      <div className="flex justify-end items-center mt-6">
        <Button type="default" onClick={onClose}>
          Đóng
        </Button>
      </div>
      {/* Custom Preview Image */}
      <Image
        preview={{
          visible: previewOpen,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
      />
    </div>
  );
};

export default ViewTenant;
