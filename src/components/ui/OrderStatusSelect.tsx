'use client';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const FLOW: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export const META: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:   { label: 'Pendiente',  color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  CONFIRMED: { label: 'Confirmado', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  SHIPPED:   { label: 'Enviado',    color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'Entregado',  color: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED: { label: 'Cancelado',  color: 'bg-red-50 text-red-600 border-red-200' },
};

export function getAvailableTransitions(current: OrderStatus): OrderStatus[] {
  if (current === 'CANCELLED' || current === 'DELIVERED') return [];
  const idx = FLOW.indexOf(current);
  const options: OrderStatus[] = [];
  if (idx !== -1 && idx < FLOW.length - 1) options.push(FLOW[idx + 1]);
  if (idx < FLOW.indexOf('SHIPPED')) options.push('CANCELLED');
  return options;
}

interface Props {
  value: OrderStatus | string;
  // onRequestChange: el componente padre muestra el modal y llama onChange si confirma
  onRequestChange: (next: OrderStatus) => void;
  disabled?: boolean;
}

export default function OrderStatusSelect({ value, onRequestChange, disabled }: Props) {
  const current = value as OrderStatus;
  const transitions = getAvailableTransitions(current);
  const isFinal = current === 'CANCELLED' || current === 'DELIVERED';
  const colorClass = META[current]?.color ?? 'bg-gray-50 text-gray-600 border-gray-200';

  // Estado final: solo badge estatico
  if (isFinal) {
    return (
      <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border select-none ${colorClass}`}>
        {META[current]?.label ?? current}
      </span>
    );
  }

  return (
    <select
      value={current}                         // controlled: siempre muestra el estado real
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        if (next !== current) onRequestChange(next);
      }}
      disabled={disabled || transitions.length === 0}
      className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border cursor-pointer
        transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${colorClass}`}
    >
      {/* Opcion actual */}
      <option value={current}>{META[current]?.label ?? current}</option>
      {transitions.map((s) => (
        <option key={s} value={s}>{META[s].label}</option>
      ))}
    </select>
  );
}
