import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import CustomModal from "@/components/Modal/Modal";

interface ExtendContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContract: any;
  endDateExtendContract: Date | null;
  setEndDateExtendContract: (date: Date | null) => void;
  priceExtendContract: number;
  setPriceExtendContract: (value: number) => void;
  noteExtendContract: string;
  setNoteExtendContract: (value: string) => void;
  errorDateExtendContract: string;
  errorPriceExtendContract: string;
  errorNoteExtendContract: string;
  handleExtendContract: () => void;
}

const ExtendContractModal: React.FC<ExtendContractModalProps> = ({
  isOpen,
  onClose,
  selectedContract,
  endDateExtendContract,
  setEndDateExtendContract,
  priceExtendContract,
  setPriceExtendContract,
  noteExtendContract,
  setNoteExtendContract,
  errorDateExtendContract,
  errorPriceExtendContract,
  errorNoteExtendContract,
  handleExtendContract,
}) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
    setPriceExtendContract(rawValue ? parseInt(rawValue, 10) : 0); // Lưu giá trị dạng số
  };

  return (
    <CustomModal
      header="Gia hạn"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[50%]"
    >
      <div className="h-full w-full">
        <div className="w-full p-4 flex flex-col bg-[#D9EAFD] rounded-[8px] text-themeColor gap-2">
          <span>{`Hợp đồng hiện tại có ngày hết hạn là: ${
            selectedContract?.end_day
              ? new Date(selectedContract.end_day).toLocaleDateString("vi-VN")
              : "Chưa có ngày hết hạn"
          }`}</span>
          <span>{`Giá phòng 1 tháng của hợp đồng cũ là : ${selectedContract?.room_fee.toLocaleString()} đ`}</span>
        </div>
        <div className="flex w-full flex-col mt-6">
          <div className="flex flex-row w-full justify-between gap-6">
            {/* DatePicker */}
            <div className="w-[48%]">
              <DatePicker
                label="Ngày kết thúc hợp đồng"
                value={endDateExtendContract}
                onChange={(newValue) => setEndDateExtendContract(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    helperText: errorDateExtendContract,
                    error: !!errorDateExtendContract,
                  },
                }}
                format="DD/MM/YYYY"
              />
            </div>

            {/* TextField */}
            <div className="w-[48%]">
              <TextField
                value={
                  priceExtendContract !== 0
                    ? priceExtendContract.toLocaleString("vi-VN")
                    : ""
                }
                onChange={handlePriceChange}
                label="Tiền thuê mới"
                variant="outlined"
                fullWidth
                InputProps={{
                  inputProps: { min: 0 }, // Giới hạn giá trị >= 0
                }}
                error={!!errorPriceExtendContract} // Hiển thị lỗi nếu có
                helperText={errorPriceExtendContract} // Thông báo lỗi
              />
            </div>
          </div>
          <div className="w-full mt-6">
            <TextField
              value={noteExtendContract}
              onChange={(e) => setNoteExtendContract(e.target.value)}
              label="Ghi chú"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              error={!!errorNoteExtendContract}
              helperText={errorNoteExtendContract}
            />
          </div>
          <div className="w-full flex flex-row justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleExtendContract}
              className="px-4 py-2 text-white rounded hover:bg-blue-700 bg-themeColor"
            >
              Lưu
            </button>
          </div>
        </div>
        <div className="h-[50px]"></div>
      </div>
    </CustomModal>
  );
};

export default ExtendContractModal;
