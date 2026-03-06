'use client';

const OPTIONS = [
  { value: 'PENDING',   label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'SHIPPED',   label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

const COLOR: Record<string, string> = {
  PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  SHIPPED:   'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function OrderStatusSelect({ value, onChange, disabled }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border cursor-pointer transition-colors disabled:opacity-60 ${
        COLOR[value] ?? 'bg-gray-50 text-gray-600 border-gray-200'
      }`}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
