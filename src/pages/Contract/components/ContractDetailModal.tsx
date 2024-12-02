import React, { useState } from 'react';
import { Contract } from "@/types/types";
import CustomModal from '@/components/Modal/Modal';
import { formatDateTime } from '@/config/config';
import Viewer from 'react-viewer';

interface ContractDetailsModalProps {
  contract: Contract;
  isOpen: boolean;
  onClose: () => void;
}

const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({
  contract,
  isOpen,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle image click to open viewer
  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setVisible(true);
  };

  return (
    <CustomModal
      header="Chi tiết Hợp đồng Thuê Nhà"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-7xl rounded-lg overflow-hidden"
      modalWrapperClassName="bg-black bg-opacity-70 flex items-center justify-center transition-opacity duration-500"
      contentClassName="bg-white shadow-xl transform transition-all duration-500 p-10 border-2 border-gray-300 rounded-lg"
    >
      <div>
        {/* Tên hợp đồng */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">{contract.contract_name}</h2>

        {/* Bảng chi tiết hợp đồng */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="text-left py-3 px-6 bg-gray-100 text-gray-700 font-medium">Tiêu đề</th>
                <th className="text-left py-3 px-6 bg-gray-100 text-gray-700 font-medium">Dữ liệu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 px-6 border-b text-gray-700 font-medium">Phòng</td>
                <td className="py-4 px-6 border-b text-gray-700">{contract.room}</td>
              </tr>
              <tr>
                <td className="py-4 px-6 border-b text-gray-700 font-medium">Ngày bắt đầu</td>
                <td className="py-4 px-6 border-b text-gray-700">{formatDateTime(contract.start_day)}</td>
              </tr>
              <tr>
                <td className="py-4 px-6 border-b text-gray-700 font-medium">Ngày kết thúc</td>
                <td className="py-4 px-6 border-b text-gray-700">{formatDateTime(contract.end_day)}</td>
              </tr>
              <tr>
                <td className="py-4 px-6 border-b text-gray-700 font-medium">Ngày bắt đầu thanh toán</td>
                <td className="py-4 px-6 border-b text-gray-700">{formatDateTime(contract.billing_start_date)}</td>
              </tr>
              <tr>
                <td className="py-4 px-6 border-b text-gray-700 font-medium">Điều khoản thanh toán</td>
                <td className="py-4 px-6 border-b text-gray-700">{contract.payment_term} tháng</td>
              </tr>
              <tr>
                <td className="py-4 px-6 border-b text-gray-700 font-medium">Phí phòng</td>
                <td className="py-4 px-6 border-b text-gray-700">{contract.room_fee.toLocaleString()} VNĐ</td>
              </tr>
              <tr>
                <td className="py-4 px-6 border-b text-gray-700 font-medium">Tiền đặt cọc</td>
                <td className="py-4 px-6 border-b text-gray-700">{contract.deposit.toLocaleString()} VNĐ</td>
              </tr>
              {contract.customerName && (
                <tr>
                  <td className="py-4 px-6 border-b text-gray-700 font-medium">Khách hàng</td>
                  <td className="py-4 px-6 border-b text-gray-700">{contract.customerName}</td>
                </tr>
              )}
              {contract.clause && (
                <tr>
                  <td className="py-4 px-6 border-b text-gray-700 font-medium">Điều khoản đặc biệt</td>
                  <td className="py-4 px-6 border-b text-gray-700">{contract.clause}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
              
        {/* Hình ảnh hợp đồng */}
        {contract.image && contract.image.length > 0 && (
          <div className="flex max-h-64 justify-center mt-8">
            {contract.image.map((imageUrl, index) => (
              <div key={index} className="cursor-pointer mx-2">
                <img
                  src={imageUrl}
                  alt={`Hình ảnh hợp đồng ${index + 1}`}
                  className="max-w-md rounded-lg shadow-lg object-contain"
                  onClick={() => handleImageClick(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* React Viewer Modal */}
      {contract.image && contract.image.length > 0 && (
        <Viewer
          visible={visible}
          onClose={() => setVisible(false)}
          images={contract.image.map((image) => ({ src: image }))}
          activeIndex={activeIndex}
        />
      )}
    </CustomModal>
  );
};

export default ContractDetailsModal;
