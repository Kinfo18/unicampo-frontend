'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useCategories } from '@/hooks/useCategories';
import { ProductQuery, ProductSortBy } from '@/types/product.types';
import api from '@/lib/api';

interface ProductFiltersProps {
  query: ProductQuery;
  onQueryChange: (q: Partial<ProductQuery>) => void;
}

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: 'newest',      label: 'Más recientes' },
  { value: 'price_asc',   label: 'Precio: menor a mayor' },
  { value: 'price_desc',  label: 'Precio: mayor a menor' },
  { value: 'best_seller', label: 'Más vendidos' },
];

const formatCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

export default function ProductFilters({ query, onQueryChange }: ProductFiltersProps) {
  const { categories } = useCategories();
  const [searchInput, setSearchInput]   = useState(query.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange]     = useState({ min: 0, max: 0 });
  const [localMin, setLocalMin]         = useState('');
  const [localMax, setLocalMax]         = useState('');

  // Cargar rango de precios real desde el backend
  useEffect(() => {
    api.get('/products/price-range').then((r) => {
      setPriceRange(r.data);
    }).catch(() => {});
  }, []);

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => onQueryChange({ search: searchInput || undefined }), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Debounce precio
  useEffect(() => {
    const t = setTimeout(() => {
      const min = localMin !== '' ? Number(localMin) : undefined;
      const max = localMax !== '' ? Number(localMax) : undefined;
      onQueryChange({ minPrice: min, maxPrice: max });
    }, 600);
    return () => clearTimeout(t);
  }, [localMin, localMax]);

  const clearAll = () => {
    setSearchInput('');
    setLocalMin('');
    setLocalMax('');
    onQueryChange({
      search: undefined, categoryId: undefined,
      sortBy: undefined, inStock: undefined,
      minPrice: undefined, maxPrice: undefined,
    });
  };

  // Chips de filtros activos
  const activeChips: { label: string; clear: () => void }[] = [];
  if (query.categoryId) {
    const cat = categories.find((c) => c.id === query.categoryId);
    if (cat) activeChips.push({ label: cat.name, clear: () => onQueryChange({ categoryId: undefined }) });
  }
  if (query.sortBy && query.sortBy !== 'newest') {
    const s = SORT_OPTIONS.find((o) => o.value === query.sortBy);
    if (s) activeChips.push({ label: s.label, clear: () => onQueryChange({ sortBy: undefined }) });
  }
  if (query.inStock) {
    activeChips.push({ label: 'Con stock', clear: () => onQueryChange({ inStock: undefined }) });
  }
  if (query.minPrice !== undefined) {
    activeChips.push({ label: `Desde ${formatCOP(query.minPrice)}`, clear: () => { setLocalMin(''); onQueryChange({ minPrice: undefined }); } });
  }
  if (query.maxPrice !== undefined) {
    activeChips.push({ label: `Hasta ${formatCOP(query.maxPrice)}`, clear: () => { setLocalMax(''); onQueryChange({ maxPrice: undefined }); } });
  }

  const hasFilters = !!query.search || activeChips.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 space-y-3">
      {/* Fila principal */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
          />
        </div>

        {/* Categoría */}
        <div className="relative">
          <select
            value={query.categoryId || ''}
            onChange={(e) => onQueryChange({ categoryId: e.target.value || undefined })}
            className="pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none bg-white transition cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Ordenar */}
        <div className="relative">
          <select
            value={query.sortBy || 'newest'}
            onChange={(e) => onQueryChange({ sortBy: e.target.value as ProductSortBy })}
            className="pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none bg-white transition cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Botón filtros avanzados */}
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2.5 rounded-xl border transition ${
            showAdvanced
              ? 'bg-primary-50 border-primary-200 text-primary-600'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}>
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          Filtros
          {activeChips.length > 0 && (
            <span className="ml-0.5 w-4 h-4 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
              {activeChips.length}
            </span>
          )}
        </button>

        {/* Limpiar todo */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-2.5 rounded-xl border border-red-100 hover:border-red-200 transition">
            <XMarkIcon className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {/* Panel de filtros avanzados */}
      {showAdvanced && (
        <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Precio mínimo */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Precio mínimo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                min={0}
                placeholder={priceRange.min ? String(priceRange.min) : '0'}
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full pl-6 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Precio máximo */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Precio máximo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                min={0}
                placeholder={priceRange.max ? String(priceRange.max) : '∞'}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full pl-6 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Disponibilidad</label>
            <button
              onClick={() => onQueryChange({ inStock: query.inStock ? undefined : true })}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl border text-sm transition ${
                query.inStock
                  ? 'bg-primary-50 border-primary-200 text-primary-700 font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
              <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${
                query.inStock ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
              }`}>
                {query.inStock && <span className="text-white text-[10px]">✓</span>}
              </span>
              Solo con stock disponible
            </button>
          </div>
        </div>
      )}

      {/* Chips de filtros activos */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {activeChips.map((chip) => (
            <span key={chip.label}
              className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-xl">
              {chip.label}
              <button onClick={chip.clear} className="ml-0.5 text-primary-400 hover:text-primary-600">
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
