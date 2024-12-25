import React, { useEffect, useMemo, useState } from "react";
import CustomModal from "@/components/Modal/Modal";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Contract, DebtType, LiquidationData } from "@/types/types";
import { getBillByRoomIdAndStatus } from "@/services/transactionApi/transactionApi";
import { liquidationContract } from "@/services/contractApi/contractApi";

interface LiquidationModalProps {
  isOpen: boolean;
  contract: Contract | null;
  isSuccess: (contract : Contract)=> void;
  onClose: () => void;
}

const LiquidationModal: React.FC<LiquidationModalProps> = ({
  isOpen,
  contract,
  isSuccess,
  onClose,
}) => {
  const [customerLeavesDeposit, setCustomerLeavesDeposit] = useState<number>(0);
  const [moveOutDate, setMoveOutDate] = useState<dayjs.Dayjs | null>(null);
  const [depositCancelledDate, setDepositCancelledDate] =
    useState<dayjs.Dayjs | null>(null);
  const [depositRefund, setDepositRefund] = useState(0); // Hoàn trả cọc
  const [excessRefund, setExcessRefund] = useState(0); // Hoàn trả tiền thừa
  const [penaltyFee, setPenaltyFee] = useState(0); // Phí phạt
  const [debtList, setDebtList] = useState<DebtType[]>([]);
  const [totalDebtAmount, setTotalDebtAmount] = useState<number>(0);
  const fetchInitialData = async () => {
    if (contract) {
      try {
        const response = await getBillByRoomIdAndStatus(contract.roomId, 0);
        const data = Array.isArray(response.data) ? response.data : [];
        // Optionally, filter out invalid debt items
        const validData = data.filter(
          (debt: { total_amount: number }) =>
            typeof debt.total_amount === "number"
        );
        setDebtList(validData);
        setDepositRefund(contract.deposit);
      } catch (error) {
        console.error("Error fetching debt data:", error);
        setDebtList([]);
      }
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [contract]);
  useEffect(() => {
    const totalDebt = debtList.reduce((sum, debt) => {
      const amount = Number(debt.total_amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    setTotalDebtAmount(totalDebt);
  }, [debtList]);

  if (!contract) {
    return null; // Không hiển thị modal nếu contract là null
  }

  const handleCancel = () => {
    setCustomerLeavesDeposit(0); // Đặt lại trạng thái rời phòng
    setMoveOutDate(null); // Xóa ngày chuyển đi
    setDepositCancelledDate(null); // Xóa ngày bỏ cọc
    setDepositRefund(0); // Reset hoàn trả cọc
    setExcessRefund(0); // Reset tiền thừa
    setPenaltyFee(0); // Reset phí phạt
    setDebtList([]); // Xóa danh sách công nợ
    setTotalDebtAmount(0); // Reset tổng công nợ
    onClose(); // Đóng modal
  };

  const handleSubmit = async () => {
    const dataLiquidation: LiquidationData = {
      debtmoney: totalDebtAmount, // Tổng tiền khách nợ từ state
      penalty_fee: penaltyFee, // Phí phạt từ state
      deposit_amount: depositRefund, // Tiền đặt cọc từ state
      end_day: moveOutDate ? moveOutDate.toDate() : new Date(), // Chuyển moveOutDate từ Dayjs sang Date
      amount: totalDebtAmount + penaltyFee - depositRefund, // Tổng tiền thanh lý
    };
    const response = await liquidationContract(
      contract.id,
      customerLeavesDeposit,
      dataLiquidation
    );
    if(response.isSuccess) {
      isSuccess(contract)
      handleCancel()
    }
  };

  // Helper function to format number to locale string
  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  // Helper function to parse input string to number
  const parseNumber = (value: string): number => {
    const parsed = value.replace(/,/g, "").replace(/\D/g, "");
    return parsed ? Number(parsed) : 0;
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      header="Thanh lý"
      className="max-w-[50vw]"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-col w-full py-4 gap-6">
          <span className="text-md font-semibold text-themeColor">
            1. Thông tin hợp đồng
          </span>
          <div className="w-full border border-gray-300 rounded-[8px] p-4 ">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="w-1/2 text-left px-4 py-3 text-gray-700 font-semibold">
                    Đại diện:
                  </td>
                  <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                    {contract.customerName}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="w-1/2 text-left px-4 py-3 text-gray-700 font-semibold">
                    Ngày khách vào:
                  </td>
                  <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                    {contract.start_day
                      ? new Date(contract.start_day).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="w-1/2 text-left px-4 py-3 text-gray-700 font-semibold">
                    Hạn hợp đồng:
                  </td>
                  <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                    {contract.end_day
                      ? new Date(contract.end_day).toLocaleDateString("en-GB") // Định dạng dd/MM/yyyy
                      : "N/A"}{" "}
                    {/* Hiển thị N/A nếu end_day không có giá trị */}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/2 text-left px-4 py-3 text-gray-700 font-semibold">
                    Tiền đặt cọc:
                  </td>
                  <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                    {contract.deposit.toLocaleString()} đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-row w-full justify-between">
            <div
              onClick={() => setCustomerLeavesDeposit(0)}
              className={`flex justify-center items-center w-[45%] py-4 rounded-[8px] border border-gray-300 cursor-pointer ${
                customerLeavesDeposit === 0 ? "bg-themeColor text-white" : ""
              }`}
            >
              <span>Khách rời phòng</span>
            </div>
            <div
              onClick={() => setCustomerLeavesDeposit(1)}
              className={`flex justify-center items-center w-[45%] py-4 rounded-[8px] border border-gray-300 cursor-pointer ${
                customerLeavesDeposit === 1 ? "bg-themeColor text-white" : ""
              }`}
            >
              <span>Khách bỏ cọc</span>
            </div>
          </div>

          {customerLeavesDeposit === 1 ? (
            <div className="flex flex-col w-full">
              <DatePicker
                label="Ngày bỏ cọc"
                value={depositCancelledDate}
                onChange={(newValue) => setDepositCancelledDate(newValue)}
                format="DD/MM/YYYY"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-col w-full">
                <DatePicker
                  label="Ngày chuyển đi"
                  value={moveOutDate}
                  onChange={(newValue) => setMoveOutDate(newValue)}
                  format="DD/MM/YYYY"
                />
              </div>
              <span className="text-md font-semibold text-themeColor">
                2. Công nợ khách hàng
              </span>

              {debtList && debtList.length > 0 ? (
                <table className="border-1 border-black rounded-[8px] w-full">
                  <thead className="bg-themeColor rounded-[8px]">
                    <tr>
                      <th className="px-6 py-4 text-white font-semibold border-2 border-gray-300 text-center">
                        Khách hàng
                      </th>
                      <th className="px-6 py-4 text-white font-semibold border-2 border-gray-300 text-center">
                        Số tiền
                      </th>

                      <th className="px-6 py-4 text-white font-semibold border-2 border-gray-300 text-center">
                        Còn nợ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtList.map((debt) => (
                      <tr key={debt.id}>
                        <td className="px-6 py-4 text-black border-2 border-gray-300 text-center align-middle">
                          {debt.customer_name}
                        </td>
                        <td className="px-6 py-4 text-black border-2 border-gray-300 text-center align-middle">
                          {debt.final_amount.toLocaleString()} đ
                        </td>

                        <td className="px-6 py-4 text-black border-2 border-gray-300 text-center align-middle">
                          {debt.final_amount.toLocaleString()} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full p-4 bg-blue-100 rounded-[8px]">
                  <span className="text-themeColor font-semibold">
                    Khách hàng không còn nợ khoản tiền nào
                  </span>
                </div>
              )}

              <span className="text-md font-semibold text-themeColor">
                3. Hoàn cọc và tiền thừa
              </span>
              <div className="flex flex-row justify-start gap-[3%]">
                {/* Hoàn trả cọc */}
                <div className="w-[30%]">
                  <TextField
                    label={
                      <span>
                        Hoàn trả cọc <span className="text-red-500">*</span>
                      </span>
                    }
                    type="text"
                    value={depositRefund ? formatNumber(depositRefund) : ""}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>

                {/* Hoàn trả tiền thừa */}
                {/* <div className="w-[30%]">
              <TextField
                label={
                  <span>
                    Hoàn trả tiền thừa <span className="text-red-500">*</span>
                  </span>
                }
                type="text" 
                value={excessRefund ? formatNumber(excessRefund) : ''}
                onChange={(e) => setExcessRefund(parseNumber(e.target.value))}
                fullWidth
                variant="outlined"
              />
            </div> */}

                {/* Phí phạt */}
                <div className="w-[30%]">
                  <TextField
                    label={<span>Phí phạt</span>}
                    type="text"
                    value={penaltyFee ? formatNumber(penaltyFee) : ""}
                    onChange={(e) => setPenaltyFee(parseNumber(e.target.value))}
                    fullWidth
                    variant="outlined"
                  />
                </div>
              </div>
              <span className="text-md font-semibold text-themeColor">
                4. Tổng hợp
              </span>

              <div className="w-full border border-gray-300 rounded-[8px] p-4 ">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="w-1/2 text-left px-4 py-3 text-gray-700 font-semibold">
                        Tổng tiền khách nợ: (1)
                      </td>
                      <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                        {typeof totalDebtAmount === "number"
                          ? totalDebtAmount.toLocaleString()
                          : "0"}{" "}
                        đ
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="w-1/2 text-left px-4 py-3 text-gray-700 font-semibold">
                        Tổng phí phạt: (2)
                      </td>
                      <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                        {penaltyFee.toLocaleString()} đ
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="w-1/2 text-left px-4 py-3 text-gray-700 font-semibold">
                        Hoàn cọc: (3)
                      </td>
                      <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                        {contract.deposit.toLocaleString()} đ
                      </td>
                    </tr>
                    <tr className="">
                      <td className="w-1/2 text-left px-4 py-3 text-red-500 font-semibold">
                        Tổng cộng: (4)=(1)+(2)-(3)
                      </td>
                      <td className="w-1/2 text-right px-4 py-3 text-gray-900">
                        {(
                          totalDebtAmount +
                          penaltyFee -
                          depositRefund
                        ).toLocaleString()}{" "}
                        đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="w-full flex flex-row justify-end gap-[3%] mt-6">
            <span
              onClick={handleCancel}
              className="px-4 py-2 border border-themeColor rounded-[8px] cursor-pointer"
            >
              Hủy
            </span>
            <span
              onClick={handleSubmit}
              className="px-4 py-2 border border-themeColor bg-themeColor text-white rounded-[8px] cursor-pointer"
            >
              Lập hóa đơn & thanh lý
            </span>
          </div>

        </div>
      </LocalizationProvider>
    </CustomModal>
  );
};

export default LiquidationModal;
