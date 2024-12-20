import React, { useEffect, useState } from "react";
import { Transaction } from "@/types/types";
import { useBuildingStore } from "@/stores/buildingStore";
import { getRoomByBuildingId } from "@/services/buildingApi/buildingApi";
import useContractStore from "@/stores/contractStore";
import { CalendarDays } from "lucide-react";

interface ViewTransactionProps {
  transaction: Partial<Transaction>;
  onClose: () => void;
}

const ViewTransaction: React.FC<ViewTransactionProps> = ({
  transaction,
  onClose,
}) => {
  const buildingList = useBuildingStore((state) => state.buildings);
  const roomList = useBuildingStore((state) => state.roomList);
  const contractList = useContractStore((state) => state.contracts);
  const [customerName, setCustomerName] = useState<string>("");

  useEffect(() => {
    if (transaction.roomid) {
      const contract = contractList.find(
        (item) => item.roomId === transaction.roomid
      );
      if (contract && contract.customerName) {
        setCustomerName(contract.customerName);
      }
    }
  }, [transaction.roomid, contractList]);

  return (
    <div className="space-y-6 overflow-hidden">
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Tòa nhà</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {buildingList.find((b) => b.id === transaction.buildingid)?.building_name ||
              "Không rõ"}
          </div>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Phòng</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {roomList.find((r) => r.id === transaction.roomid)?.room_name ||
              "Không rõ"}
          </div>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Tên khách hàng</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {customerName || "Không rõ"}
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Tên giao dịch</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {transaction.namereason || "Không rõ"}
          </div>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Nhóm giao dịch</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {transaction.transactiongroupid || "Không rõ"}
          </div>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Phương thức thanh toán</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {transaction.paymentmethod || "Không rõ"}
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Ngày thanh toán</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {transaction.date
              ? new Date(transaction.date).toLocaleDateString("vi-VN")
              : "Không rõ"}
          </div>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Số tiền</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {transaction.amount?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) || "Không rõ"}
          </div>
        </div>
        <div className="flex flex-col w-[30%] gap-2">
          <span className="font-semibold">Ghi chú</span>
          <div className="p-2 border border-gray-300 rounded-[8px] bg-gray-50">
            {transaction.note || "Không rõ"}
          </div>
        </div>
      </div>

      {transaction.image && (
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Hình ảnh</span>
          <img
            src={transaction.image}
            alt="Transaction"
            className="max-w-sm border border-gray-300 rounded-[8px]"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ViewTransaction;
