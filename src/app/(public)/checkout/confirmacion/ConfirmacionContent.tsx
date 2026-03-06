'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface OrderDetail {
  id: string;
  status: string;
  total: number;
  shippingAddress: string;
  createdAt: string;
  items: {
    product: { name: string };
    quantity: number;
    unitPrice: string;
  }[];
}

export default function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    // El interceptor de api.ts agrega el token automáticamente
    api
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">

      {/* Ícono éxito */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
        <p className="text-gray-500 text-sm">
          Tu pedido ha sido recibido. Te contactaremos pronto para coordinar la entrega.
        </p>
      </div>

      {/* Detalle */}
      {order ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Detalle del pedido</h2>
            <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2.5 py-1 rounded-full uppercase">
              {order.status === 'PENDING' ? 'Pendiente' : order.status}
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-4">
            Pedido #{order.id.slice(0, 8).toUpperCase()} &bull;{' '}
            {new Date(order.createdAt).toLocaleDateString('es-CO', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>

          <div className="space-y-2 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name}{' '}
                  <span className="text-gray-400">x{item.quantity}</span>
                </span>
                <span className="font-medium text-gray-800">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-primary-700">
              {formatPrice(Number(order.total))}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Dirección de entrega:</span> {order.shippingAddress}
            </p>
          </div>
        </div>
      ) : (
        // Si no hay detalle igual muestra el éxito con acciones
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-center">
          <p className="text-sm text-gray-500">Tu pedido fue registrado exitosamente.</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        <Link
          href="/cuenta/pedidos"
          className="flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
          Ver mis pedidos
        </Link>
        <Link
          href="/productos"
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:border-gray-300 hover:text-gray-800 transition-colors"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
