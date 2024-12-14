import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getAllNotification, updateisread, deletenotification } from "@/services/notificationApi/notificationApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineDownloadDone } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import useAuthStore from "@/stores/userStore";

const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]); // Danh sách thông báo
  const [unreadCount, setUnreadCount] = useState<number>(0); // Số thông báo chưa đọc
  const [newNotification, setNewNotification] = useState<any | null>(null); // Thông báo mới
  const userData = useAuthStore((state) => state.userData?.id ?? "");
  const [userId] = useState(userData);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread"); // Tab hiển thị

  // Hàm lấy thông báo từ API
  const fetchNotifications = async () => {
    try {
      const response = await getAllNotification(userId);
      const data = Array.isArray(response.data) ? response.data : []; // Đảm bảo dữ liệu trả về là mảng
      setNotifications(data);

      // Cập nhật số lượng thông báo chưa đọc
      const unreadNotifications = data.filter((notif: any) => !notif.isRead);
      setUnreadCount(unreadNotifications.length);

      // Kiểm tra thông báo mới
      const newNotifs = data.filter((notif: any) => !notif.isRead && !notifications.some((existingNotif) => existingNotif.id === notif.id));

      if (newNotifs.length > 0) {
        // Hiển thị thông báo mới qua toast
        setNewNotification(newNotifs[0]); // Lấy thông báo mới
        toast.success(`Có thông báo mới: ${newNotifs[0].title}`);

        // Ẩn thông báo mới sau 5 giây
        setTimeout(() => {
          setNewNotification(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
      setNotifications([]); // Gán danh sách thông báo là mảng rỗng nếu xảy ra lỗi
    }
  };

  // Gọi API mỗi 5 giây để kiểm tra thông báo mới
  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId); // Cleanup khi component unmount
  }, [notifications]);

  // Xử lý toggle hiển thị danh sách thông báo
  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  // Hàm đánh dấu thông báo là đã đọc
  const markAsRead = async (notifId: string) => {
    try {
      await updateisread(notifId, true); // Gọi API để đánh dấu đã đọc
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notifId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prevCount) => prevCount - 1); // Giảm số thông báo chưa đọc
      toast.success("Đã đánh dấu thông báo là đã đọc");
    } catch (error) {
      toast.error("Lỗi khi đánh dấu thông báo đã đọc");
    }
  };

  // Hàm xóa thông báo
  const deleteNotification = async (notifId: string) => {
    try {
      await deletenotification(notifId); // Gọi API để xóa thông báo
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notifId)
      );
      toast.success("Đã xóa thông báo");
    } catch (error) {
      toast.error("Lỗi khi xóa thông báo");
    }
  };

  // Lọc thông báo theo tab
  const filteredNotifications = Array.isArray(notifications)
    ? activeTab === "unread"
      ? notifications.filter((notif) => !notif.isRead)
      : notifications.filter((notif) => notif.isRead)
    : [];

  return (
    <div className="h-[5%] flex flex-row px-10 gap-4 items-center justify-end border-b-b bg-white w-full relative">
      {/* Biểu tượng chuông */}
      <div className="relative flex items-center">
        <Bell className="w-6 h-6 cursor-pointer" onClick={toggleDropdown} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Danh sách thông báo */}
      {isDropdownVisible && (
        <div className="absolute top-10 right-0 bg-white shadow-md rounded-lg w-96 max-h-96 overflow-y-auto z-50">
          {/* Tabs Chưa đọc / Đã đọc */}
          <div className="flex justify-between px-4 py-2 border-b">
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "unread" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("unread")}
            >
              Chưa đọc
            </button>
            <button
              className={`px-4 py-2 font-semibold ${
                activeTab === "read" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("read")}
            >
              Đã đọc
            </button>
          </div>

          {/* Danh sách thông báo */}
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 border-b ${
                  notif.isRead ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                <div className="font-semibold">{notif.title}</div>
                <div className="text-sm">{notif.message}</div>

                <div className="flex gap-2 mt-2">
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md"
                      title="Đánh dấu đã đọc"
                    >
                      <MdOutlineDownloadDone />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md"
                    title="Xóa"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {activeTab === "unread"
                ? "Không có thông báo chưa đọc"
                : "Không có thông báo đã đọc"}
            </div>
          )}
        </div>
      )}

      {/* Container của Toast */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Header;
