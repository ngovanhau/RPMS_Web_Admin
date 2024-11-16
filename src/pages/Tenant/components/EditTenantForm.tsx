import { updateTenant } from "@/services/tenantApi/tenant";
import { Tenant } from "@/types/types";
import React, { useState, useEffect } from "react";
import { getroombystatus } from "@/services/tenantApi/tenant";
import { uploadImage } from "@/services/uploadApi/upload";

interface EditTenantFormProps {
  tenant: Tenant;
  onSuccess: () => void;
  onClose: () => void;
}

interface Room {
  id: string;
  room_name: string;
}

const EditTenantForm: React.FC<EditTenantFormProps> = ({
  tenant,
  onSuccess,
  onClose,
}) => {
  const [editableTenant, setEditableTenant] = useState<Tenant>({
    ...tenant,
    date_of_birth: tenant.date_of_birth ? new Date(tenant.date_of_birth) : new Date(),
    date_of_issue: tenant.date_of_issue ? new Date(tenant.date_of_issue) : new Date(),
  });
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      const response = await getroombystatus(0);
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };
  console.log(tenant);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setEditableTenant((prevTenant) => ({
      ...prevTenant,
      [id]: value,
    }));
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setEditableTenant((prevTenant) => ({
      ...prevTenant,
      [id]: new Date(value), // Chuyển đổi chuỗi thành `Date`
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const uploadedImageUrls: string[] = [];

      for (const file of files) {
        try {
          const response = await uploadImage(file);
          uploadedImageUrls.push(response.data.url);
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }

      setEditableTenant((prevTenant) => ({
        ...prevTenant,
        imageCCCDs: [...prevTenant.imageCCCDs, ...uploadedImageUrls],
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateTenant(editableTenant);
      console.log("Updated tenant:", editableTenant);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update tenant:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 bg-white">
      <div className="grid grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="customer_name"
            className="block text-gray-700 font-semibold mb-1"
          >
            Họ và tên *
          </label>
          <input
            type="text"
            id="customer_name"
            value={editableTenant.customer_name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone_number"
            className="block text-gray-700 font-semibold mb-1"
          >
            Số điện thoại *
          </label>
          <input
            type="text"
            id="phone_number"
            value={editableTenant.phone_number}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={editableTenant.email}
            onChange={handleChange}
            placeholder="Nhập email"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="date_of_birth" className="block text-gray-700 font-semibold mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            id="date_of_birth"
            value={editableTenant.date_of_birth.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Choose Room */}
        <div>
          <label
            htmlFor="choose_room"
            className="block text-gray-700 font-semibold mb-1"
          >
            {tenant.choose_room !== "00000000-0000-0000-0000-000000000000" ? ('Phòng thuê') : ("Chọn phòng thuê")}
          </label>
          {
            tenant.choose_room !== "00000000-0000-0000-0000-000000000000" ?
            (
              <div className="p-2"><span className="font-semibold" >{tenant.roomName}</span></div>
            )
            :
            (
              <>
                <select
                id="choose_room"
                value={editableTenant.choose_room}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Chọn phòng thuê có sẵn</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_name}
                  </option>
                ))}
              </select>
              </>
            )
          }

        </div>

        {/* CCCD */}
        <div>
          <label
            htmlFor="cccd"
            className="block text-gray-700 font-semibold mb-1"
          >
            Số CMND/CCCD
          </label>
          <input
            type="text"
            id="cccd"
            value={editableTenant.cccd}
            onChange={handleChange}
            placeholder="Nhập số CMND/CCCD"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Place of Issue */}
        <div>
          <label
            htmlFor="place_of_issue"
            className="block text-gray-700 font-semibold mb-1"
          >
            Nơi cấp
          </label>
          <input
            type="text"
            id="place_of_issue"
            value={editableTenant.place_of_issue}
            onChange={handleChange}
            placeholder="Nhập nơi cấp CMND/CCCD"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Date of Issue */}
        <div>
          <label
            htmlFor="date_of_issue"
            className="block text-gray-700 font-semibold mb-1"
          >
            Ngày cấp
          </label>
          <input
            type="date"
            id="date_of_issue"
            value={editableTenant.date_of_issue.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label
            htmlFor="address"
            className="block text-gray-700 font-semibold mb-1"
          >
            Địa chỉ
          </label>
          <textarea
            id="address"
            value={editableTenant.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ của người thuê"
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        {/* Image CCCD */}
        <div className="col-span-2">
          <label
            htmlFor="imageCCCDs"
            className="block text-gray-700 font-semibold mb-1"
          >
            Ảnh CMND/CCCD
          </label>
          <input
            type="file"
            id="imageCCCDs"
            multiple
            onChange={handleImageUpload}
            className="w-full p-2 border border-dashed rounded-md cursor-pointer"
          />
          <div className="flex flex-wrap mt-2">
            {editableTenant.imageCCCDs.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Ảnh CMND/CCCD ${index + 1}`}
                className="w-20 h-20 object-cover m-1"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-md"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
};

export default EditTenantForm;