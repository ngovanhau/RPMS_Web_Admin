import React, { useState, useEffect } from "react";
import { Contract } from "@/types/types";
import { getallService } from "@/services/servicesApi/servicesApi";
import { getroombystatus } from "@/services/tenantApi/tenant";
import { Room } from "@/types/types";
import { getCustomerNoRoom } from "@/services/contractApi/contractApi";
import { deleteImage, uploadImage } from "@/services/imageApi/imageApi";
import { Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface EditContractFormProps {
  contract: Contract; // Contract to edit
  onSubmit: (contract: Contract, modifiedData: Partial<Contract>) => void; // Return both the full contract and modified data
}

const EditContractForm: React.FC<EditContractFormProps> = ({
  contract: initialContract, // Get contract to edit from prop
  onSubmit,
}) => {
  const [contract, setContract] = useState<Partial<Contract>>(initialContract);
  const [modifiedData, setModifiedData] = useState<Partial<Contract>>({});
  const [listRoom, setListRoom] = useState<Room[]>([]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
 

  const onChange: UploadProps["onChange"] = async ({ file }) => {
    if (file.originFileObj && file.status === "uploading") {
      try {
        // Xóa ảnh cũ trước khi tải ảnh mới
        await handleRemoveImage();

        // Tải ảnh mới
        const imageUrl = await uploadImage(file.originFileObj);
        if (imageUrl) {
          const updatedFile: UploadFile = {
            uid: "-1", // Định danh tạm thời
            name: file.name || "image.png", // Tên ảnh
            url: imageUrl, // URL của ảnh mới
            status: "done",
          };

          // Cập nhật giao diện và trạng thái hợp đồng
          setFileList([updatedFile]);
          setModifiedData((prevState) => ({
            ...prevState,
            image: imageUrl,
          }));

          message.success("Ảnh đã tải lên thành công!");
        } else {
          throw new Error("Không nhận được URL ảnh từ API.");
        }
      } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        message.error("Tải ảnh thất bại. Vui lòng thử lại.");
        setFileList([]); // Reset fileList nếu lỗi
      }
    }
  };

  // Xóa ảnh
  const handleRemoveImage = async () => {
    if (contract.image) {
      try {
        // Gọi API để xóa ảnh trên server
        await deleteImage(contract.image);
        // Xóa ảnh trong state contract
        setModifiedData((prevState) => ({
          ...prevState,
          image: "",
        }));

        // Xóa ảnh khỏi giao diện
        setFileList([]);

        message.success("Ảnh đã được xóa!");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        message.error("Xóa ảnh thất bại. Vui lòng thử lại.");
      }
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // Submit form with updated data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Merge initial contract with modified data for submission
    const updatedContract = { ...initialContract, ...modifiedData };

    // Return both the full contract and the modified fields
    onSubmit(updatedContract, modifiedData);
  };

  useEffect(() => {
    // Đồng bộ modifiedData với dữ liệu contract khi vào trang
    setModifiedData(initialContract);
  }, [initialContract]);

  // Fetch initial data (rooms and customers)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getallService();
        await getCustomerNoRoom();

        const responseRoom = await getroombystatus(0);
        setListRoom(responseRoom.data);

        if (contract?.image) {
          const updatedFile: UploadFile = {
            uid: "-1",
            name: "image.png",
            url: contract.image,
            status: "done",
          };
          setFileList([updatedFile]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 mx-auto">
      {/* Form Fields */}
      <div className="flex flex-col w-full gap-6">
        {/* Contract Name */}
        <div className="w-full flex flex-row justify-between">
          <div className="w-[48%] flex flex-col">
            <label className="block text-sm font-semibold text-black mb-1">
              Tên Hợp Đồng
            </label>
            <div className="border border-gray-300 h-12 rounded-[8px] w-full px-2 flex items-center cursor-not-allowed hover:text-red-500">
              <span>{contract.contract_name || "Chưa có tên hợp đồng"}</span>
            </div>
          </div>

          {/* Room */}
          <div className="w-[48%] flex flex-col">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Phòng
            </label>
            <div className="border rounded-[8px] border-gray-300 h-12 p-3 w-full bg-white text-black flex items-center cursor-not-allowed hover:text-red-500">
              <span>{contract.room || "Chưa chọn phòng"}</span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row justify-between">
          <div className="w-[48%]">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Khách Hàng
            </label>
            <div className="border border-gray-300 h-12 rounded-[8px] px-2 flex items-center cursor-not-allowed hover:text-red-500">
              <span>{contract?.customerName || "Chưa chọn khách hàng"}</span>
            </div>
          </div>

          <div className="w-[48%]">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phí Phòng (VND)
              </label>
              <div className="w-full border border-gray-300 rounded-[8px] h-12 justify-start p-2 items-center flex cursor-not-allowed hover:text-red-500">
                <span>
                  {contract.room_fee?.toLocaleString() || "Chưa có phí phòng"}{" "}
                  VNĐ
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row justify-between">
          {/* Ngày bắt đầu */}
          <div className="w-[48%] flex flex-col">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Ngày Bắt Đầu
            </label>
            <DatePicker
              value={dayjs(contract.start_day)} // Chuyển Date sang Dayjs
              format="DD/MM/YYYY" // Hiển thị định dạng dd/MM/yyyy
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  variant: "outlined",
                  InputProps: {
                    style: {
                      height: "48px", // Đặt chiều cao cố định (tương ứng h-10)
                    },
                  },
                  className:
                    "h-12 border border-gray-300 rounded-[8px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none",
                },
              }}
            />
          </div>
          <div className="w-[48%] flex flex-col">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Ngày Kết Thúc
            </label>
            <DatePicker
              value={dayjs(contract.end_day)} // Chuyển Date sang Dayjs
              onChange={(date) =>
                setContract((prev) => ({
                  ...prev,
                  end_day: date ? date.toDate() : prev.end_day, // Chuyển Dayjs thành Date
                }))
              }
              format="DD/MM/YYYY" // Hiển thị định dạng dd/MM/yyyy
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  variant: "outlined",
                  InputProps: {
                    style: {
                      height: "48px", // Đặt chiều cao cố định (tương ứng h-10)
                    },
                  },
                  className:
                    "h-12 border border-gray-300 rounded-[8px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none",
                },
              }}
            />
          </div>
        </div>

        <div className="w-full flex flex-row justify-between">
          <div className="w-[48%] flex flex-col">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Ngày Bắt Đầu Thanh Toán
            </label>
            <DatePicker
              value={dayjs(contract.billing_start_date)} // Chuyển Date sang Dayjs
              onChange={(date) =>
                setContract((prev) => ({
                  ...prev,
                  billing_start_date: date
                    ? date.toDate()
                    : prev.billing_start_date, 
                }))
              }
              format="DD/MM/YYYY" // Hiển thị định dạng dd/MM/yyyy
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  variant: "outlined",
                  InputProps: {
                    style: {
                      height: "48px", // Đặt chiều cao cố định (tương ứng h-10)
                    },
                  },
                  className:
                    "h-12 border border-gray-300 rounded-[8px] p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none",
                },
              }}
            />
          </div>

          <div className="flex flex-col w-[48%]">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Kỳ Hạn Thanh Toán (tháng)
            </label>
            <select
              name="payment_term"
              value={contract.payment_term || ""}
              onChange={(e) =>
                setContract((prev) => ({
                  ...prev,
                  payment_term: Number(e.target.value),
                }))
              }
              className="border border-gray-300 rounded-[8px] h-12 p-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="" disabled>
                Chọn kỳ hạn
              </option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month} tháng
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Upload Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          Ảnh hợp đồng
        </label>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          onRemove={handleRemoveImage}
          maxCount={1}
        >
          {fileList.length === 0 && "+ Upload"}{" "}
        </Upload>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          // onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded hover:bg-blue-700 bg-themeColor"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default EditContractForm;
