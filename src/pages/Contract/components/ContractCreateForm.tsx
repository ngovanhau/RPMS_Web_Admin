import React, { useState, useEffect } from "react";
import { Contract } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import useServiceStore from "@/stores/servicesStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ServiceInfo } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox is available for multi-selection
import Select, { MultiValue } from "react-select";
import { getroombystatus } from "@/services/tenantApi/tenant";
import { Room } from "@/types/types";
import { getCustomerNoRoom } from "@/services/contractApi/contractApi";
import useTenantStore from "@/stores/tenantStore";
import { uploadImage } from "@/services/imageApi/imageApi";

interface CreateContractFormProps {
  onSubmit: (contract: Contract) => void;
}

const CreateContractForm: React.FC<CreateContractFormProps> = ({
  onSubmit,
}) => {
  const [contract, setContract] = useState<Partial<Contract>>({
    contract_name: "",
    rentalManagement: "",
    room: "",
    roomId: "",
    start_day: new Date(),
    end_day: new Date(),
    billing_start_date: new Date(),
    payment_term: 0,
    room_fee: 0,
    deposit: 0,
    customerId: "",
    service: "7e2d6bcc-0350-4474-bb71-03c5b33cb2bb",
    clause: "",
    image: "ContractRow.tsx",
    customerName: "",
  });
  const [listRoom, setListRoom] = useState<Room[]>([]);
  const [uploading, setUploading] = useState(false); // Trạng thái đang tải ảnh

  // Access services from the store
  const services = useServiceStore.getState().services;
  const listCustomer = useTenantStore.getState().tenantsWithoutRoom;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContract((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contract as Contract);
  };

  const handleRoomChange = (selectedRoom: { value: string; label: string }) => {
    setContract((prevState) => ({
      ...prevState,
      room: selectedRoom.label,
      roomId: selectedRoom.value,
    }));
  };

  const handleCustomerChange = (selectedCustomer: {
    value: string;
    label: string;
  }) => {
    setContract((prevState) => ({
      ...prevState,
      customerId: selectedCustomer.value,
      customerName: selectedCustomer.label,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getallService();
        await getCustomerNoRoom();
        const responseRoom = await getroombystatus(0);
        setListRoom(responseRoom.data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchData();
  }, []);

  // Format services for react-select options
  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.service_name,
    serviceId: service.id,
    serviceName: service.service_name,
  }));
  // Tạo danh sách tùy chọn cho phòng
  const roomOptions = listRoom.map((room) => ({
    value: room.id,
    label: room.room_name || "Phòng không tên",
  }));

  // Tạo danh sách tùy chọn cho khách hàng
  const customerOptions = listCustomer.map((customer) => ({
    value: customer.id || "",
    label: customer.customer_name,
  }));

  const handleUploadImage = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setContract((prevState) => ({
        ...prevState,
        image: imageUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Tạo Hợp Đồng Mới
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Tên Hợp Đồng
          </label>
          <input
            type="text"
            name="contract_name"
            value={contract.contract_name || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tên hợp đồng"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Quản Lý Cho Thuê
          </label>
          <input
            type="text"
            name="rentalManagement"
            value={contract.rentalManagement || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Tên quản lý"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Phòng
          </label>
          <Select
            options={roomOptions}
            onChange={(selected) =>
              handleRoomChange(selected as { value: string; label: string })
            }
            className="border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Chọn phòng"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Bắt Đầu
          </label>
          <input
            type="date"
            name="start_day"
            value={contract.start_day?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setContract({ ...contract, start_day: new Date(e.target.value) })
            }
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Kết Thúc
          </label>
          <input
            type="date"
            name="end_day"
            value={contract.end_day?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setContract({ ...contract, end_day: new Date(e.target.value) })
            }
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ngày Bắt Đầu Thanh Toán
          </label>
          <input
            type="date"
            name="billing_start_date"
            value={
              contract.billing_start_date?.toISOString().split("T")[0] || ""
            }
            onChange={(e) =>
              setContract({
                ...contract,
                billing_start_date: new Date(e.target.value),
              })
            }
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Kỳ Hạn Thanh Toán (tháng)
          </label>
          <input
            type="number"
            name="payment_term"
            value={contract.payment_term || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập kỳ hạn"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Phí Phòng (VND)
          </label>
          <input
            type="number"
            name="room_fee"
            value={contract.room_fee || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập phí phòng"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Tiền Đặt Cọc (VND)
          </label>
          <input
            type="number"
            name="deposit"
            value={contract.deposit || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tiền đặt cọc"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Khách Hàng
          </label>
          <Select
            options={customerOptions}
            onChange={(selected) =>
              handleCustomerChange(selected as { value: string; label: string })
            }
            className="border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Chọn khách hàng"
          />
        </div>
        {/* Service Multiselect Dropdown */}
        {/* <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Dịch Vụ
          </label>
          <Select
            isMulti
            options={serviceOptions}
            onChange={(selected) =>
              handleServiceChange(
                selected as MultiValue<{
                  value: string;
                  label: string;
                  serviceId: string;
                  serviceName: string;
                }>
              )
            }
            className="border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Chọn dịch vụ"
          />
        </div> */}

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Điều Khoản
          </label>
          <input
            type="text"
            name="clause"
            value={contract.clause || ""}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập điều khoản"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Ảnh Hợp Đồng
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadImage(file);
            }}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {uploading && (
            <p className="text-blue-500 text-sm">Đang tải ảnh...</p>
          )}
          {contract.image && (
            <div className="mt-4">
              <img
                src={contract.image}
                alt="Hợp Đồng"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300"
        >
          Xác Nhận
        </button>
      </div>
    </form>
  );
};

export default CreateContractForm;
