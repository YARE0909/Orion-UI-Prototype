// components/ui/Modal.tsx
import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-foreground rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex justify-between items-center pb-4 border-b-2 border-border">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <X className='w-5 h-5' />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
