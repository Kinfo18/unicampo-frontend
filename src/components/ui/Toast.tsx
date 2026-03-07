'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const ICONS = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />,
  error:   <XCircleIcon className="w-5 h-5 text-red-500 shrink-0" />,
  warning: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 shrink-0" />,
};

const BORDER = {
  success: 'border-green-200 bg-white',
  error:   'border-red-200 bg-white',
  warning: 'border-yellow-200 bg-white',
};

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Entrada con micro-delay para animar
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`flex items-start gap-3 w-80 px-4 py-3 rounded-2xl border shadow-lg transition-all duration-300 ${
      BORDER[toast.type]
    } ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      {ICONS[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{toast.title}</p>
        {toast.message && <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="text-gray-300 hover:text-gray-500 transition-colors mt-0.5">
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

// ---- Contenedor global ----
let _setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>> | null = null;

export function toast(type: ToastType, title: string, message?: string) {
  if (!_setToasts) return;
  const id = Math.random().toString(36).slice(2);
  _setToasts((prev) => [...prev, { id, type, title, message }]);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  _setToasts = setToasts;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastCard
          key={t.id}
          toast={t}
          onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
        />
      ))}
    </div>
  );
}
