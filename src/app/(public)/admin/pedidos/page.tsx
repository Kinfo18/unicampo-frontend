'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import OrderStatusSelect, { type OrderStatus } from '@/components/ui/OrderStatusSelect';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

interface Order {
  id: string;
  status: string;
  total: string;
  createdAt: string;
  shippingAddress: string;
  user: { name: string; email: string };
  items: { quantity: number; unitPrice: string; product: { name: string; images: string[] } }[];
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/orders/all?${params}`)
      .then((r) => {
        setOrders(r.data.data);
        setMeta(r.data.meta);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });

      // Si hay filtro activo y el nuevo estado no coincide, quitar el pedido de la lista
      if (statusFilter && newStatus !== statusFilter) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setMeta((m) => ({ ...m, total: Math.max(0, m.total - 1) }));
      } else {
        // Sin filtro activo: actualizar el estado en el mismo lugar
        setOrders((prev) =>
          prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
        );
      }
    } catch {
      alert('Error al actualizar el estado. Inténtalo de nuevo.');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPrice = (v: string | number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(v));

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{meta.total} pedido{meta.total !== 1 ? 's' : ''} en total</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <FunnelIcon className="w-4 h-4 text-gray-400 shrink-0" />
        {STATUS_FILTERS.map((f) => (
          <button key={f.value || 'all'}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No hay pedidos{statusFilter ? ' con ese estado' : ''}.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Pedido</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="font-medium text-gray-800 truncate max-w-[160px]">{order.user?.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px]">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <OrderStatusSelect
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(val) => handleStatusChange(order.id, val)}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-gray-400 inline-block transition-transform ${
                          expanded === order.id ? 'rotate-180' : ''
                        }`}>▾</span>
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Productos</p>
                              <div className="space-y-2">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">
                                      <span className="font-medium">{item.quantity}×</span> {item.product.name}
                                    </span>
                                    <span className="text-gray-500">{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dirección de envío</p>
                              <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 mt-3">Cliente</p>
                              <p className="text-sm text-gray-700">{order.user?.name}</p>
                              <p className="text-sm text-gray-400">{order.user?.email}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-400">Página {meta.page} de {meta.totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
