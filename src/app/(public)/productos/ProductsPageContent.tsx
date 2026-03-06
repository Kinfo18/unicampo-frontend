"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import ProductFilters from "@/components/products/ProductFilters";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || undefined;

  const { products, meta, loading, query, updateQuery, setPage } = useProducts({
    categoryId,
  });

  useEffect(() => {
    if (categoryId) updateQuery({ categoryId });
  }, [categoryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {loading
            ? "Cargando..."
            : `${meta.total} producto${meta.total !== 1 ? "s" : ""} encontrado${meta.total !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Filtros */}
      <ProductFilters query={query} onQueryChange={updateQuery} />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100"
            >
              <div className="h-44 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No encontramos productos
          </h3>
          <p className="text-gray-400 text-sm">
            Intenta con otro término de búsqueda o categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Paginación */}
      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
