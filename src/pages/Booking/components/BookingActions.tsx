import React, { useEffect, useState, useRef } from "react";
import { Booking } from "@/types/types";
import { FiTrash, FiEdit2, FiMoreHorizontal, FiEye } from "react-icons/fi";


type BookingActionProps = {
  booking: Booking;
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
};

const BookingAction: React.FC<BookingActionProps> = ({
  booking,
  onView,
  onEdit,
  onDelete,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (
    e: React.MouseEvent,
    action: () => void
  ) => {
    e.stopPropagation();
    action();
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        ref={dropdownButtonRef}
      >
        <FiMoreHorizontal />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-20"
          ref={dropdownRef}
        >
          <ul className="list-none p-2">
            <li
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-600"
              onClick={(e) => handleMenuItemClick(e, () => onView(booking))}
            >
              <FiEye className="mr-2" /> View
            </li>
            <li
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-600"
              onClick={(e) => handleMenuItemClick(e, () => onEdit(booking))}
            >
              <FiEdit2 className="mr-2" /> Edit
            </li>
            <li
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-600"
              onClick={(e) => handleMenuItemClick(e, () => onDelete(booking.id))}
            >
              <FiTrash className="mr-2" /> Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingAction;
