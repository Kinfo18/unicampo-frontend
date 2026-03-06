"use client";

import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCategories } from "@/hooks/useCategories";
import { ProductQuery } from "@/types/product.types";

interface ProductFiltersProps {
  query: ProductQuery;
  onQueryChange: (q: Partial<ProductQuery>) => void;
}

export default function ProductFilters({
  query,
  onQueryChange,
}: ProductFiltersProps) {
  const { categories } = useCategories();
  const [searchInput, setSearchInput] = useState(query.search || "");

  // Debounce búsqueda: espera 400ms antes de llamar al API
  useEffect(() => {
    const timer = setTimeout(() => {
      onQueryChange({ search: searchInput || undefined });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput("");
    onQueryChange({ search: undefined, categoryId: undefined });
  };

  const hasFilters = !!query.search || !!query.categoryId;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
          />
        </div>

        {/* Filtro por categoría */}
        <div className="relative">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={query.categoryId || ""}
            onChange={(e) =>
              onQueryChange({ categoryId: e.target.value || undefined })
            }
            className="pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 appearance-none bg-white transition cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Limpiar filtros */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-2.5 rounded-xl border border-red-100 hover:border-red-200 transition"
          >
            <XMarkIcon className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
