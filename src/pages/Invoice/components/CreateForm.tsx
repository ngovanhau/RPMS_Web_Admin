// src/components/CreateBillForm.tsx

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CustomModal from "@/components/Modal/Modal";
import {
  ServiceMeterReadings,
  Bill,
  Building,
  Room,
  Service,
} from "@/types/types";
import { useBuildingStore } from "@/stores/buildingStore";
import { getRoomByBuildingId } from "@/services/buildingApi/buildingApi";
import { getServiceByRoomId } from "@/services/servicesApi/servicesApi";
import { getServiceMeterReadingByRoomId } from "@/services/invoiceApi/invoiceApi";
import { getContractByBuildingId } from "@/services/contractApi/contractApi";
import useContractStore from "@/stores/contractStore";
import { getServicemeterByRoomId } from "@/services/roomStatementApi/roomStatementApi";

interface CreateBillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bill: Bill) => void;
  serviceMeterReading?: ServiceMeterReadings;
}

const CreateBillForm: React.FC<CreateBillFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  serviceMeterReading,
}) => {
  const buildings = useBuildingStore((state) => state.buildings);
  const rooms = useBuildingStore((state) => state.roomList);
  const contracts = useContractStore((state) => state.contracts);

  const [bill, setBill] = useState<Partial<Bill>>({
    bill_name: "",
    status: 0,
    status_payment: 0,
    building_id: "",
    customer_id: "",
    customer_name: "",
    date: new Date().toISOString().split("T")[0],
    roomid: "",
    roomname: "",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    cost_room: 0,
    cost_service: 0,
    total_amount: 0,
    penalty_amount: 0,
    discount: 0,
    final_amount: 0,
    note: "",
  });

  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customerError, setCustomerError] = useState<string>("");
  const [serviceMeterReadingData, setServiceMeterReadingData] =
    useState<ServiceMeterReadings | null>(null);

  const [serviceCost, setServiceCost] = useState<number | null>(0);
  const [electricityMoney, setElectricityMoney] = useState<number | null>(0);
  const [waterMoney, setWaterMoney] = useState<number | null>(0);

  useEffect(() => {
    if (serviceMeterReading) {
      setBill((prev) => ({
        ...prev,
        building_id: serviceMeterReading.building_id || "",
        roomid: serviceMeterReading.room_id || "",
        roomname: serviceMeterReading.room_name || "",
        date: new Date(serviceMeterReading.record_date)
          .toISOString()
          .split("T")[0],
        cost_service:
          serviceMeterReading.electricity_cost + serviceMeterReading.water_cost,
        note: `Từ chỉ số điện nước ${serviceMeterReading.id}`,
      }));
    }
  }, [serviceMeterReading]);

  useEffect(() => {
    if (bill.building_id) {
      const roomsForBuilding = rooms.filter(
        (room) => room.building_Id === bill.building_id
      );
      setFilteredRooms(roomsForBuilding);
      // Reset room if it doesn't belong to the selected building
      if (!roomsForBuilding.find((room) => room.id === bill.roomid)) {
        setBill((prev) => ({
          ...prev,
          roomid: "",
          roomname: "",
          cost_room: 0,
          customer_id: "",
          customer_name: "",
        }));
        setCustomerError("");
      }
    } else {
      setFilteredRooms([]);
      setBill((prev) => ({
        ...prev,
        roomid: "",
        roomname: "",
        cost_room: 0,
        customer_id: "",
        customer_name: "",
      }));
      setCustomerError("");
    }
  }, [bill.building_id, rooms, bill.roomid]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBill((prev) => ({
      ...prev,
      [name]: ["cost_service", "penalty_amount", "discount"].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
    // Clear errors when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle building selection change
  const handleBuildingChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedBuildingId = e.target.value;

    if (!selectedBuildingId) {
      setBill((prev) => ({
        ...prev,
        building_id: "",
        roomid: "",
        roomname: "",
        cost_room: 0,
        customer_id: "",
        customer_name: "",
      }));
      setSelectedBuilding(null);
      setFilteredRooms([]);
      setCustomerError("");
      return;
    }

    try {
      // Find the selected building from the buildings array
      const building =
        buildings.find((b) => b.id === selectedBuildingId) || null;
      setSelectedBuilding(building);

      // Fetch rooms for the selected building
      await getRoomByBuildingId(selectedBuildingId);
      await getContractByBuildingId(selectedBuildingId);
      setBill((prev) => ({
        ...prev,
        building_id: selectedBuildingId,
        roomid: "",
        roomname: "",
        cost_room: 0,
        customer_id: "",
        customer_name: "",
      }));
      setCustomerError("");
    } catch (error) {
      console.log("Error fetching rooms:", error);
      alert("Đã xảy ra lỗi khi tải phòng cho tòa nhà này.");
      setBill((prev) => ({
        ...prev,
        building_id: "",
        roomid: "",
        roomname: "",
        cost_room: 0,
        customer_id: "",
        customer_name: "",
      }));
      setSelectedBuilding(null);
      setFilteredRooms([]);
      setCustomerError("");
    }
  };

  // Handle room selection change with logging and setting cost_room, customer_id, nameCustomer
  const handleRoomChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Find the selected room based on the selected value
    const selectedRoom = rooms.find((room) => room.id === value);
    const contract = contracts.find(
      (contract) => contract.roomId === selectedRoom?.id
    );

    if (selectedRoom) {
      try {
        // Fetch service meter readings
        const serviceMeterReading = await getServicemeterByRoomId(
          selectedRoom.id
        );
        setServiceMeterReadingData(serviceMeterReading?.data.data);

        // Initialize total service cost
        let totalServiceCost = 0;

        // Fetch services related to the room
        const serviceResponse = await getServiceByRoomId(selectedRoom.id);
        if (serviceResponse.isSuccess) {
          const serviceCost = serviceResponse.data.reduce(
            (total: number, item: Service) => {
              return total + (item.service_cost || 0);
            },
            0
          );
          totalServiceCost += serviceCost;
          setServiceCost(serviceCost);
        }

        // Fetch service meter readings related to the room
        const dataReading = await getServiceMeterReadingByRoomId(
          selectedRoom.id
        );
        if (dataReading.isSuccess) {
          totalServiceCost += Number(dataReading.data.total_amount || 0);
          setElectricityMoney(dataReading?.data?.electricity_cost);
          setWaterMoney(dataReading?.data?.water_cost);
        }
        // Update the bill state with the total service cost and other details
        setBill((prev) => ({
          ...prev,
          [name]: value,
          roomname: selectedRoom.room_name, // Keep the room name
          cost_room: selectedRoom.room_price || 0,
          customer_id: contract?.customerId || "",
          customer_name: contract?.customerName || "",
          cost_service: totalServiceCost, // Set the total service cost
        }));
      } catch (error) {
        // Handle API errors without changing the selected room
        console.error("Error fetching service or meter information:", error);
        setCustomerError("Có lỗi khi tải thông tin dịch vụ và công tơ.");

        // Optionally, you might want to reset some state here if necessary
      }
    } else {
      console.warn("Selected room not found.");
      setCustomerError("");
    }
  };

  // Calculate total amount (cost_room + cost_service)
  const calculateTotalAmount = () => {
    return (bill.cost_room || 0) + (bill.cost_service || 0);
  };

  // Calculate final amount (total_amount + penalty_amount - discount%)
  const calculateFinalAmount = (totalAmount: number) => {
    const penaltyAmount = bill.penalty_amount || 0;
    const discountPercentage = bill.discount || 0;
    const discountAmount = (totalAmount * discountPercentage) / 100;
    return totalAmount + penaltyAmount - discountAmount;
  };

  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    const finalAmount = calculateFinalAmount(totalAmount);
    setBill((prev) => ({
      ...prev,
      total_amount: totalAmount,
      final_amount: finalAmount,
    }));
  }, [bill.cost_room, bill.cost_service, bill.penalty_amount, bill.discount]);

  const handleSubmit = () => {
    let formIsValid = true;
    let newErrors: { [key: string]: string } = {};

    if (!bill.building_id) {
      formIsValid = false;
      newErrors.building_id = "Vui lòng chọn tòa nhà.";
    }

    if (!bill.roomid) {
      formIsValid = false;
      newErrors.roomid = "Vui lòng chọn phòng.";
    }

    if (!bill.cost_room) {
      formIsValid = false;
      newErrors.cost_room = "Giá phòng là bắt buộc.";
    }

    // Check if there's a customer error due to room selection
    if (customerError) {
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) {
      return;
    }

    const finalBill: Bill = {
      ...bill,
      // id: crypto.randomUUID(),
      // createdAt: new Date().toISOString(),
      // updatedAt: new Date().toISOString(),
    } as Bill;

    onSubmit(finalBill);
    onClose();
  };

  return (
    <CustomModal
      header="Tạo hóa đơn mới"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
    >
      <Card className="p-6">
        <div className="space-y-4">
          {/* Bill Name */}
          <div className="space-y-2">
            <Label htmlFor="bill_name">Tên hóa đơn</Label>
            <Input
              id="bill_name"
              name="bill_name"
              value={bill.bill_name}
              onChange={handleInputChange}
              placeholder="VD: Hóa đơn tháng 11/2024"
            />
            {errors.bill_name && (
              <span className="text-red-500 text-sm">{errors.bill_name}</span>
            )}
          </div>

          {/* Building Selection */}
          <div className="space-y-2">
            <Label htmlFor="building_id" className="text-red-500">
              Tòa nhà *
            </Label>
            {buildings.length > 0 ? (
              <select
                id="building_id"
                name="building_id"
                value={bill.building_id}
                onChange={handleBuildingChange}
                className={`w-full border rounded p-2 ${
                  errors.building_id ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Chọn tòa nhà</option>
                {buildings.map((building: Building) => (
                  <option key={building.id} value={building.id}>
                    {building.building_name}
                  </option>
                ))}
              </select>
            ) : (
              <p>Đang tải danh sách tòa nhà...</p>
            )}
            {errors.building_id && (
              <span className="text-red-500 text-sm">{errors.building_id}</span>
            )}

            {/* Display Selected Building Details */}
            {selectedBuilding && (
              <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
                <p>
                  <strong>Địa chỉ:</strong> {selectedBuilding.address},{" "}
                  {selectedBuilding.district}, {selectedBuilding.city}
                </p>
                <p>
                  <strong>Số tầng:</strong> {selectedBuilding.number_of_floors}
                </p>
                <p>
                  <strong>Mô tả:</strong> {selectedBuilding.description}
                </p>
                {/* Add more details as needed */}
              </div>
            )}
          </div>

          {/* Room Selection */}
          <div className="space-y-2">
            <Label htmlFor="roomid" className="text-red-500">
              Phòng *
            </Label>
            {bill.building_id ? (
              filteredRooms.length > 0 ? (
                <select
                  id="roomid"
                  name="roomid"
                  value={bill.roomid}
                  onChange={handleRoomChange}
                  className={`w-full border rounded p-2 ${
                    errors.roomid ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Chọn phòng</option>
                  {filteredRooms.map((room: Room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_name || `Phòng ${room.id}`}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Không có phòng nào cho tòa nhà này.</p>
              )
            ) : (
              <p>Vui lòng chọn tòa nhà trước.</p>
            )}
            {errors.roomid && (
              <span className="text-red-500 text-sm">{errors.roomid}</span>
            )}
            {customerError && (
              <span className="text-red-500 text-sm">{customerError}</span>
            )}
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer_name">Tên khách hàng</Label>
            <Input
              disabled
              id="customer_name"
              name="customer_name"
              value={bill.customer_name}
              onChange={handleInputChange}
              placeholder="Nhập tên khách hàng"
            />
          </div>

          {/* Cost Room */}
          <div className="space-y-2">
            <Label htmlFor="cost_room" className="text-red-500">
              Giá phòng (VNĐ) *
            </Label>
            <Input
              id="cost_room"
              name="cost_room"
              type="number"
              value={bill.cost_room}
              readOnly // Make the input read-only
              className={`bg-gray-100 border rounded p-2 ${
                errors.cost_room ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Giá phòng tự động điền từ phòng đã chọn"
              required
            />
            {errors.cost_room && (
              <span className="text-red-500 text-sm">{errors.cost_room}</span>
            )}
          </div>

          {/* Cost Service */}
          <div className="space-y-2">
            <Label htmlFor="cost_service">Chi phí dịch vụ (VNĐ)</Label>
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Loại Chi Phí</th>
                  <th className="py-2 px-4 border-b text-left">Chỉ số</th>
                  <th className="py-2 px-4 border-b text-left">Đơn giá</th>
                  <th className="py-2 px-4 border-b text-right">
                    Số Tiền (VNĐ)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Tiền Dịch Vụ */}
                <tr>
                  <td className="py-2 px-4 border-b">Tiền Dịch Vụ</td>
                  <td className="py-2 px-4 border-b"></td>
                  <td className="py-2 px-4 border-b"></td>
                  <td className="py-2 px-4 border-b text-right">
                    {serviceCost ? serviceCost.toLocaleString() : 0}
                  </td>
                </tr>
                {/* Tiền Điện Nước */}
                <tr>
                  <td className="py-2 px-4 border-b">Tiền Điện</td>
                  <td className="py-2 px-4 border-b ">
                    {(serviceMeterReadingData?.electricity_new ?? 0) -
                      (serviceMeterReadingData?.electricity_old ?? 0)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {serviceMeterReadingData?.electricity_price}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    {electricityMoney ? electricityMoney.toLocaleString() : 0}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Tiền Nước</td>
                  <td className="py-2 px-4 border-b">
                    {(serviceMeterReadingData?.water_new ?? 0) -
                      (serviceMeterReadingData?.water_old ?? 0)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {serviceMeterReadingData?.water_price}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    {waterMoney ? waterMoney.toLocaleString() : 0}
                  </td>
                </tr>
                {/* Tổng Tiền */}
                <tr>
                  <td className="py-2 px-4 font-bold">Tổng Tiền</td>
                  <td className="py-2 px-4 font-bold"></td>
                  <td className="py-2 px-4 font-bold"></td>
                  <td className="py-2 px-4 font-bold text-right">
                    {bill?.cost_service?.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <Input
              id="cost_service"
              name="cost_service"
              type="number"
              readOnly
              className={`bg-gray-100 border rounded p-2 ${
                errors.cost_room ? "border-red-500" : "border-gray-300"
              }`}
              value={bill.cost_service}
              onChange={handleInputChange}
              placeholder="Nhập chi phí dịch vụ"
            /> */}
          </div>

          {/* Penalty Amount */}
          <div className="space-y-2">
            <Label htmlFor="penalty_amount">Tiền phạt (VNĐ)</Label>
            <Input
              id="penalty_amount"
              name="penalty_amount"
              type="number"
              value={bill.penalty_amount}
              onChange={handleInputChange}
              placeholder="Nhập tiền phạt (nếu có)"
            />
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label htmlFor="discount">Giảm giá (%)</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={bill.discount}
              onChange={handleInputChange}
              placeholder="Nhập % giảm giá"
              min="0"
              max="100"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date">Hạn thanh toán</Label>
            <div className="relative">
              <Input
                id="due_date"
                name="due_date"
                type="date"
                value={bill.due_date?.split("T")[0] || ""}
                onChange={handleInputChange}
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              name="note"
              value={bill.note}
              onChange={handleInputChange}
              placeholder="Nhập ghi chú (nếu có)"
              className="h-20"
            />
          </div>

          {/* Total and Final Amount */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span>Tổng tiền (chưa tính phạt/giảm giá):</span>
              <span className="text-lg text-blue-600">
                {(bill.total_amount ?? 0).toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span>Số tiền cuối cùng:</span>
              <span className="text-xl text-blue-600">
                {(bill.final_amount ?? 0).toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>Tạo hóa đơn</Button>
          </div>
        </div>
      </Card>
    </CustomModal>
  );
};

export default CreateBillForm;
