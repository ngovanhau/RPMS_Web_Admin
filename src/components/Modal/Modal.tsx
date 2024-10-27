import React, { ReactNode } from 'react';

interface CustomModalProps {
  header: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  overlayClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  modalWrapperClassName?: string; // New prop for outer wrapper class
}

const CustomModal: React.FC<CustomModalProps> = ({
  header,
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  headerClassName = '',
  contentClassName = '',
  modalWrapperClassName = '' // Using the new prop here
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${modalWrapperClassName}`}>
      <div className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity ${overlayClassName}`} onClick={onClose}></div>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-7xl transform transition-all ${className}`}>
        <div className={`flex justify-between items-center border-b pb-3 px-6 pt-4 ${headerClassName}`}>
          <h2 className="text-xl font-bold text-gray-800">{header}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={`px-6 py-4 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
