const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Confirmado', cls: 'bg-blue-100 text-blue-700' },
  SHIPPED:   { label: 'Enviado',    cls: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'Entregado',  cls: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelado',  cls: 'bg-red-100 text-red-600' },
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
