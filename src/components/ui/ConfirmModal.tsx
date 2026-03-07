'use client';

import { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
  danger = false, onConfirm, onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            danger ? 'bg-red-50' : 'bg-yellow-50'
          }`}>
            <ExclamationTriangleIcon className={`w-5 h-5 ${
              danger ? 'text-red-500' : 'text-yellow-500'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${
              danger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
