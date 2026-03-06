'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCartIcon,
  CheckIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { Product } from '@/types/product.types';
import { useCartStore } from '@/store/cart.store';
import ProductCard from '@/components/products/ProductCard';

interface Props {
  slug: string;
}

export default function ProductDetailContent({ slug }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get(`/products/${slug}`)
      .then((res) => {
        const data: Product = res.data;
        setProduct(data);
        return api.get(`/products?categoryId=${data.categoryId}&limit=5`);
      })
      .then((res) => {
        setRelated(
          (res.data.data as Product[]).filter((p) => p.slug !== slug).slice(0, 4),
        );
      })
      .catch((err) => {
        console.error('Error cargando producto:', err);
        setError('No se pudo cargar el producto.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (value: string | number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(Number(value));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">&#128533;</p>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {error ?? 'Producto no encontrado'}
        </h2>
        <button
          onClick={() => router.push('/productos')}
          className="mt-4 bg-primary-600 text-white px-5 py-2 rounded-xl hover:bg-primary-700 transition"
        >
          Volver a productos
        </button>
      </div>
    );
  }

  const stock = product.inventory?.quantity ?? 0;
  const hasStock = stock > 0;
  const isLowStock = hasStock && stock <= (product.inventory?.minStock ?? 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-primary-600 transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/productos" className="hover:text-primary-600 transition-colors">Productos</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

        {/* Imagen */}
        <div className="space-y-3">
          <div className="relative h-80 md:h-96 bg-primary-50 rounded-2xl overflow-hidden border border-primary-100">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl select-none">
                &#127807;
              </div>
            )}
            {!hasStock && (
              <span className="absolute top-3 left-3 bg-gray-800/80 text-white text-xs font-medium px-3 py-1 rounded-full">
                Agotado
              </span>
            )}
            {isLowStock && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                &#161;&#218;ltimas {stock} unidades!
              </span>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === i ? 'border-primary-500' : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <Image src={img} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Link
            href={`/productos?categoryId=${product.categoryId}`}
            className="text-sm text-primary-600 font-medium hover:text-primary-700 mb-2"
          >
            {product.category?.name}
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          <div className="text-4xl font-extrabold text-primary-700 mb-4">
            {formatPrice(product.price)}
            <span className="text-base font-normal text-gray-400 ml-2">/ unidad</span>
          </div>

          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6 border-t border-gray-100 pt-4">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${hasStock ? 'bg-green-500' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${hasStock ? 'text-green-600' : 'text-red-500'}`}>
              {hasStock ? `En stock (${stock} disponibles)` : 'Sin stock'}
            </span>
          </div>

          {hasStock && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Cantidad:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-gray-800 min-w-[3rem] text-center border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-400">
                Total:{' '}
                <strong className="text-gray-700">
                  {formatPrice(Number(product.price) * quantity)}
                </strong>
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={!hasStock}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : hasStock
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {added ? (
                <><CheckIcon className="w-5 h-5" /> Agregado al carrito</>
              ) : (
                <><ShoppingCartIcon className="w-5 h-5" /> {hasStock ? 'Agregar al carrito' : 'Sin stock'}</>
              )}
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 transition"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Volver
            </button>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
