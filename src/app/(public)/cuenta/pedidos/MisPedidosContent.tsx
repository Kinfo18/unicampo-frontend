'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface OrderItem {
  quantity: number;
  unitPrice: string;
  product: { name: string; images: string[]; slug: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Pendiente',   color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED:  { label: 'Confirmado',  color: 'bg-blue-100 text-blue-700' },
  SHIPPED:    { label: 'Enviado',     color: 'bg-purple-100 text-purple-700' },
  DELIVERED:  { label: 'Entregado',   color: 'bg-green-100 text-green-700' },
  CANCELLED:  { label: 'Cancelado',   color: 'bg-red-100 text-red-600' },
};

export default function MisPedidosContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    api.get('/orders/my-orders')
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [mounted, isAuthenticated]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  if (!mounted || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      <div className="flex items-center gap-3 mb-8">
        <ClipboardDocumentListIcon className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
        {orders.length > 0 && (
          <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {orders.length}
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Aún no tienes pedidos</h2>
          <p className="text-gray-400 mb-8">Explora nuestros productos frescos y haz tu primer pedido.</p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Header del pedido */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-800">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('es-CO', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary-700">{formatPrice(Number(order.total))}</span>
                    {isOpen
                      ? <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                      : <ChevronDownIcon className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {/* Detalle expandible */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product.name}
                          <span className="text-gray-400 ml-1">x{item.quantity}</span>
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatPrice(Number(item.unitPrice) * item.quantity)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Dirección:</span> {order.shippingAddress}
                      </p>
                      {order.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Notas:</span> {order.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
