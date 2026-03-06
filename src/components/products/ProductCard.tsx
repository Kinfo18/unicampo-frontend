'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Product } from '@/types/product.types';
import { useCartStore } from '@/store/cart.store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(Number(product.price));

  const hasStock = product.inventory ? product.inventory.quantity > 0 : true;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all hover:-translate-y-0.5"
    >
      {/* Imagen */}
      <div className="relative h-44 bg-primary-50 overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🌿
          </div>
        )}
        {!hasStock && (
          <span className="absolute top-2 left-2 bg-gray-800/70 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            Agotado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-primary-700">
            {formattedPrice}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!hasStock}
            className={`p-2 rounded-xl transition-all ${
              added
                ? 'bg-primary-600 text-white scale-95'
                : hasStock
                ? 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            title={hasStock ? 'Agregar al carrito' : 'Sin stock'}
          >
            {added ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <ShoppingCartIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
