import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  content?: JSX.Element;
  onConfirm: () => void;
  onCancel: () => void;
  onExport?: () => void;
  confirmButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel, onExport, content, confirmButtonColor = 'bg-red-500' }) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
        <div className="bg-black opacity-50 absolute inset-0"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 max-w-md mx-auto animate-scale-up">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="mb-4">{message}</p>
          <div className="mb-4">
            {content}
          </div>
          <div className="flex justify-end space-x-2">
            {onExport && <button onClick={onExport} className="px-4 py-2 bg-green-500 text-white rounded">Export</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={onConfirm} className={`px-4 py-2 ${confirmButtonColor} text-white rounded`}>Confirm</button>
          </div>
        </div>
      </div>
  );
};

export default ConfirmationModal;
