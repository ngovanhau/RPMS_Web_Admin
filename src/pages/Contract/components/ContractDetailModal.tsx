import React from 'react';
import { Contract } from "@/types/types";
import CustomModal from '@/components/Modal/Modal';

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
  return (
    <CustomModal
      header="Chi tiết Hợp đồng Thuê Nhà"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl rounded-lg overflow-hidden"
      modalWrapperClassName="bg-black bg-opacity-70 flex items-center justify-center transition-opacity duration-500"
      contentClassName="bg-white shadow-xl transform transition-all duration-500 overflow-y-auto p-10 border-2 border-gray-200"
    >
      <div className="text-gray-800 leading-relaxed">
        
        {/* Quốc hiệu - Tiêu ngữ */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
          <p className="text-base font-semibold mt-1">Độc lập - Tự do - Hạnh phúc</p>
          <div className="w-24 h-0.5 bg-black mx-auto my-2"></div> {/* Horizontal line for separation */}
        </div>

        {/* Thời gian và tiêu đề */}
        <p className="text-right mb-4">………., ngày .... tháng .... năm ....</p>
        <h3 className="text-center text-xl font-bold mb-6 underline">HỢP ĐỒNG THUÊ NHÀ</h3>

        {/* Phần căn cứ */}
        <div className="mb-6">
          <p className="mb-2">- Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015;</p>
          <p className="mb-2">- Căn cứ vào Luật Thương mại số 36/2005/QH11 ngày 14 tháng 06 năm 2005;</p>
          <p>- Căn cứ vào nhu cầu và sự thỏa thuận của các bên tham gia Hợp đồng;</p>
        </div>

        {/* Phần giới thiệu hai bên */}
        <p className="font-semibold mb-4">Hôm nay, ngày {new Date(contract.start_day).toLocaleDateString()}, các Bên gồm:</p>

        {/* Bên A */}
        <div className="border border-gray-300 rounded-md p-4 mb-4">
          <h4 className="font-bold">BÊN CHO THUÊ (Bên A):</h4>
          <p>Ông/Bà: ………………………………</p>
          <p>CMND số: …………………... Ngày cấp: ……………… Nơi cấp: ………………………</p>
          <p>Nơi ĐKTT: …………………………………………………………………</p>
        </div>

        {/* Bên B */}
        <div className="border border-gray-300 rounded-md p-4 mb-8">
          <h4 className="font-bold">BÊN THUÊ (Bên B):</h4>
          <p>Ông/Bà: {contract.customerName}</p>
          <p>CMND số: …………………... Ngày cấp: ……………… Nơi cấp: ………………………</p>
          <p>Nơi ĐKTT: …………………………………………………………………</p>
        </div>

        {/* Nội dung hợp đồng */}
        <div className="mb-8">
          <h4 className="font-bold text-lg mb-2">Điều 1. Nhà ở và các tài sản cho thuê kèm theo nhà ở:</h4>
          <p>1.1. Bên A đồng ý cho Bên B thuê quyền sử dụng đất và một căn nhà tại địa chỉ {contract.room} để làm nơi ở.</p>
          <p>1.2. Diện tích quyền sử dụng đất: {contract.room_fee.toLocaleString()} m²</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg mb-2">Điều 2. Thời hạn thuê</h4>
          <p>2.1. Thời hạn thuê: {contract.payment_term} năm kể từ ngày bàn giao tài sản.</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg mb-2">Điều 3. Đặt cọc và thanh toán</h4>
          <p>3.1. Tiền đặt cọc: {contract.deposit.toLocaleString()} VNĐ.</p>
          <p>3.2. Tiền thuê nhà hàng tháng: {contract.room_fee.toLocaleString()} VNĐ.</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg mb-2">Điều 4. Quyền và nghĩa vụ của Bên A</h4>
          <p>4.1. Bên A phải bàn giao nhà đúng thời hạn và điều kiện hợp đồng.</p>
          <p>4.2. Đảm bảo quyền sử dụng độc lập cho Bên B trong thời gian thuê.</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg mb-2">Điều 5. Quyền và nghĩa vụ của Bên B</h4>
          <p>5.1. Sử dụng nhà đúng mục đích và giữ gìn nhà ở.</p>
          <p>5.2. Thanh toán đầy đủ tiền thuê và chi phí khác.</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg mb-2">Điều 6. Chấm dứt hợp đồng</h4>
          <p>6.1. Bên nào muốn đơn phương chấm dứt hợp đồng phải thông báo trước 30 ngày.</p>
        </div>

        {/* Phần ký tên */}
        <div className="mt-12 flex justify-between">
          <div className="text-center">
            <p className="font-semibold">BÊN CHO THUÊ</p>
            <p>(Ký và ghi rõ họ tên)</p>
            <div className="mt-16"> {/* Khoảng trống cho chữ ký */}</div>
          </div>
          <div className="text-center">
            <p className="font-semibold">BÊN THUÊ</p>
            <p>(Ký và ghi rõ họ tên)</p>
            <div className="mt-16"> {/* Khoảng trống cho chữ ký */}</div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ContractDetailsModal;
