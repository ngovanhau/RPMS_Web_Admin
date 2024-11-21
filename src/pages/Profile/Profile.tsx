import React from "react";
import useAuthStore from "@/stores/userStore";

const Profile: React.FC = () => {
    const userData = useAuthStore((state) => state.userData);

    if (!userData) {
        return <div>Không có thông tin người dùng</div>;
    }

    const { email, role, firstName, lastName, phone, status } = userData;

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin</h1>
                    
                    <div className="grid grid-cols-2 gap-y-4">
                        {/* Họ */}
                        <label className="text-gray-700 font-semibold">Họ :</label>
                        <span className="text-sm text-gray-500 font-semibold">{lastName}</span>

                        {/* Tên */}
                        <label className="text-gray-700 font-semibold">Tên :</label>
                        <span className="text-sm text-gray-500 font-semibold">{firstName}</span>

                        {/* Điện Thoại */}
                        <label className="text-gray-700 font-semibold">Điện Thoại :</label>
                        <span className="text-sm text-gray-500 font-semibold">{phone || "N/A"}</span>

                        {/* Email */}
                        <label className="text-gray-700 font-semibold">Email :</label>
                        <span className="text-sm text-gray-500 font-semibold">{email}</span>

                        {/* Trạng Thái */}
                        <label className="text-gray-700 font-semibold">Trạng Thái :</label>
                        <span className={`inline-block w-fit px-2 py-0.5 text-xs font-semibold rounded ${status === 'Deleted' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                            {status === 'Deleted' ? 'Đã Xóa' : 'Hoạt động'}
                        </span>
                    </div>
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ghi Chú</h2>
                    <p className="text-gray-600 mb-4">Xin Chào admin</p>
                    <p className="text-gray-600 mb-4">Chào mừng bạn đến với hệ thống. Hiện không có thông tin giới thiệu nào về bạn</p>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center">
                            <span className="text-xl">👥</span>
                        </div>
                        <div>
                            <p className="text-gray-700 font-bold">Nhóm Bạn Trực Thuộc</p>
                            <p className="text-gray-600">{role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
