'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBagIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

export default function CheckoutContent() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ shippingAddress: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esperar a que Zustand hidrate antes de evaluar el guard
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (items.length === 0) {
      router.push('/carrito');
    }
  }, [mounted, isAuthenticated, items.length]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.shippingAddress.trim()) {
      setError('La dirección de entrega es obligatoria');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // El interceptor de api.ts agrega el token automáticamente desde localStorage
      const res = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        shippingAddress: form.shippingAddress,
        notes: form.notes || undefined,
      });
      clearCart();
      router.push(`/checkout/confirmacion?orderId=${res.data.id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg ?? 'Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();

  // Mostrar skeleton mientras hidrata
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-48 bg-gray-100 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-primary-600">Inicio</Link>
        <span>/</span>
        <Link href="/carrito" className="hover:text-primary-600">Carrito</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Formulario */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Dirección */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <MapPinIcon className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Dirección de entrega</h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dirección completa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.shippingAddress}
                  onChange={(e) => setForm((p) => ({ ...p, shippingAddress: e.target.value }))}
                  required
                  placeholder="Ej: Calle 123 # 45-67, Bogotá"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardDocumentListIcon className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Notas del pedido</h2>
                <span className="text-xs text-gray-400">(opcional)</span>
              </div>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                placeholder="Instrucciones especiales para la entrega..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Botón móvil */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Procesando...</>
                  : <><LockClosedIcon className="w-4 h-4" /> Confirmar pedido</>}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBagIcon className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Tu pedido</h2>
              <span className="text-xs text-gray-400">({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
            </div>

            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-primary-50 shrink-0">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">x{quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 shrink-0">
                    {formatPrice(Number(product.price) * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-xl text-primary-700">{formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Botón desktop */}
            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="hidden lg:flex w-full bg-primary-600 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 items-center justify-center gap-2"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Procesando...</>
                : <><LockClosedIcon className="w-4 h-4" /> Confirmar pedido</>}
            </button>

            <div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-400">
              <LockClosedIcon className="w-3.5 h-3.5" />
              <span>Compra simulada — sin cobro real</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
