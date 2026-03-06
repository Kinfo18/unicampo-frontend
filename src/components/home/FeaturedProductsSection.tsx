"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types/product.types";
import ProductCard from "@/components/products/ProductCard";

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?limit=8&page=1")
      .then((res) => setProducts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-1">
              Recién llegados
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Productos destacados
            </h2>
          </div>
          <Link
            href="/productos" // botón "Ver todos"
            className="hidden sm:block text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="h-44 bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No hay productos disponibles aún.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Ver todos móvil */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/productos"
            className="text-sm text-primary-600 font-medium"
          >
            Ver todos los productos →
          </Link>
        </div>
      </div>
    </section>
  );
}
