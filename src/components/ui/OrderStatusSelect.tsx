'use client';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Secuencia estricta de avance
const FLOW: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

// Etiquetas y colores
const META: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:   { label: 'Pendiente',   color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  CONFIRMED: { label: 'Confirmado',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
  SHIPPED:   { label: 'Enviado',     color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'Entregado',   color: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED: { label: 'Cancelado',   color: 'bg-red-50 text-red-600 border-red-200' },
};

/**
 * Devuelve las opciones disponibles desde un estado dado:
 * - Si está CANCELLED: ninguna (bloqueado)
 * - Solo el siguiente paso en el flujo
 * - Cancelar solo si index < SHIPPED (es decir, PENDING o CONFIRMED)
 */
export function getAvailableTransitions(current: OrderStatus): OrderStatus[] {
  if (current === 'CANCELLED') return [];
  const idx = FLOW.indexOf(current);
  const options: OrderStatus[] = [];
  if (idx !== -1 && idx < FLOW.length - 1) options.push(FLOW[idx + 1]);
  if (idx < FLOW.indexOf('SHIPPED')) options.push('CANCELLED');
  return options;
}

interface Props {
  value: OrderStatus | string;
  onChange: (val: OrderStatus) => void;
  disabled?: boolean;
}

export default function OrderStatusSelect({ value, onChange, disabled }: Props) {
  const current = value as OrderStatus;
  const transitions = getAvailableTransitions(current);
  const isFinal = current === 'CANCELLED' || current === 'DELIVERED';

  // Estado final: solo badge, sin interacción
  if (isFinal) {
    return (
      <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border select-none ${
        META[current]?.color ?? 'bg-gray-50 text-gray-600 border-gray-200'
      }`}>
        {META[current]?.label ?? current}
      </span>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatus;
    if (!next) return;

    const isCancelling = next === 'CANCELLED';
    const msg = isCancelling
      ? `¿Seguro que quieres CANCELAR este pedido? Esta acción no se puede deshacer.`
      : `¿Confirmar cambio de estado a "${META[next]?.label}"?`;

    if (!window.confirm(msg)) {
      // Resetear el select al valor actual sin disparar onChange
      e.target.value = current;
      return;
    }
    onChange(next);
  };

  return (
    <select
      defaultValue=""
      onChange={handleChange}
      disabled={disabled || transitions.length === 0}
      className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border cursor-pointer transition-colors disabled:opacity-60 ${
        META[current]?.color ?? 'bg-gray-50 text-gray-600 border-gray-200'
      }`}
    >
      {/* Opción actual como placeholder */}
      <option value="" disabled>{META[current]?.label ?? current}</option>
      {transitions.map((s) => (
        <option key={s} value={s}>{META[s].label}</option>
      ))}
    </select>
  );
}
