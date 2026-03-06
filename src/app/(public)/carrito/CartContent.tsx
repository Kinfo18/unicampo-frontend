'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

export default function CartContent() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8">Agrega productos frescos del campo a tu carrito.</p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Ver productos
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const envio = 0;
  const total = subtotal + envio;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mi carrito</h1>
          <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {items.reduce((t, i) => t + i.quantity, 0)} productos
          </span>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          <TrashIcon className="w-4 h-4" />
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const stock = product.inventory?.quantity ?? 99;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center shadow-sm"
              >
                {/* Imagen */}
                <Link href={`/productos/${product.slug}`} className="shrink-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-primary-50 border border-primary-100">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🌿
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/productos/${product.slug}`}
                    className="text-sm font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">{product.category?.name}</p>
                  <p className="text-primary-700 font-bold mt-1">
                    {formatPrice(Number(product.price))}
                    <span className="text-xs font-normal text-gray-400 ml-1">/ unidad</span>
                  </p>
                </div>

                {/* Controles cantidad */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-2 text-sm font-semibold text-gray-800 border-x border-gray-200 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, Math.min(stock, quantity + 1))}
                      className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal item */}
                  <span className="text-sm font-bold text-gray-700 min-w-[5rem] text-right">
                    {formatPrice(Number(product.price) * quantity)}
                  </span>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Resumen del pedido</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-xl text-primary-700">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              Proceder al pago
            </button>

            {!isAuthenticated && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Deberás iniciar sesión para continuar
              </p>
            )}

            <Link
              href="/productos"
              className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4 transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
