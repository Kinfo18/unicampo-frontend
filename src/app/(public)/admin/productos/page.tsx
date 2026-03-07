'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusIcon, PencilSquareIcon, TrashIcon,
  MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Product {
  id: string; name: string; slug: string; price: string;
  images: string[]; isActive: boolean;
  category: { name: string };
  inventory: { quantity: number; minStock: number } | null;
}

export default function AdminProductosPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [deleting, setDeleting]   = useState<string | null>(null);

  // Modal reabastecimiento rápido
  const [restockTarget, setRestockTarget]   = useState<Product | null>(null);
  const [restockUnits, setRestockUnits]     = useState('');
  const [restockMin, setRestockMin]         = useState('');
  const [restocking, setRestocking]         = useState(false);
  const [restockMsg, setRestockMsg]         = useState<{ ok: boolean; text: string } | null>(null);
  const restockInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products?limit=100').then((r) => {
      setProducts(r.data.data ?? r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  // Focus automático al abrir modal
  useEffect(() => {
    if (restockTarget) {
      setRestockUnits('');
      setRestockMin(String(restockTarget.inventory?.minStock ?? 5));
      setRestockMsg(null);
      setTimeout(() => restockInputRef.current?.focus(), 50);
    }
  }, [restockTarget]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch { alert('Error al eliminar el producto'); }
    finally { setDeleting(null); }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockTarget) return;
    const units = Number(restockUnits);
    if (!units || units <= 0) return;
    setRestocking(true); setRestockMsg(null);
    try {
      const payload: any = { units };
      if (restockMin && Number(restockMin) > 0) payload.minStock = Number(restockMin);
      const res = await api.patch(`/products/${restockTarget.id}/stock`, payload);
      const { currentStock } = res.data;
      // Actualizar stock en lista local sin refetch
      setProducts((prev) => prev.map((p) =>
        p.id === restockTarget.id
          ? { ...p, inventory: { ...p.inventory!, quantity: currentStock, minStock: Number(restockMin) || p.inventory?.minStock || 5 } }
          : p
      ));
      setRestockMsg({ ok: true, text: `✅ Stock actualizado: ${currentStock} unidades` });
      setRestockUnits('');
      setTimeout(() => { setRestockTarget(null); setRestockMsg(null); }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setRestockMsg({ ok: false, text: Array.isArray(msg) ? msg[0] : msg ?? 'Error al reabastecer' });
    } finally {
      setRestocking(false);
    }
  };

  const formatPrice = (v: string) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(v));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
          <PlusIcon className="w-4 h-4" /> Nuevo producto
        </Link>
      </div>

      <div className="relative mb-5">
        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">No hay productos{search ? ' con ese criterio' : ''}.</p>
          <Link href="/admin/productos/nuevo" className="text-primary-600 font-medium hover:underline">Crear el primero</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Producto</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Precio</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const stock    = p.inventory?.quantity ?? 0;
                const minStock = p.inventory?.minStock ?? 5;
                const isLow    = stock > 0 && stock <= minStock;
                const isEmpty  = stock === 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-primary-50 shrink-0">
                          {p.images?.[0]
                            ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>}
                        </div>
                        <span className="font-medium text-gray-800 truncate max-w-[160px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.category?.name}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`font-medium ${
                        isEmpty ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-gray-700'
                      }`}>
                        {stock}
                        {isLow  && <span className="ml-1 text-xs">(mínimo)</span>}
                        {isEmpty && <span className="ml-1 text-xs">(sin stock)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>{p.isActive ? 'Activo' : 'Inactivo'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setRestockTarget(p)}
                          title="Reabastecer stock"
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                        <Link href={`/admin/productos/${p.id}/editar`}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <PencilSquareIcon className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting === p.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal reabastecimiento rápido */}
      {restockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRestockTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Reabastecer stock</h3>
              <button onClick={() => setRestockTarget(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-primary-50 shrink-0">
                {restockTarget.images?.[0]
                  ? <Image src={restockTarget.images[0]} alt={restockTarget.name} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">🌿</div>}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{restockTarget.name}</p>
                <p className="text-xs text-gray-400">Stock actual: <span className="font-medium text-gray-700">{restockTarget.inventory?.quantity ?? 0} unidades</span></p>
              </div>
            </div>

            {restockMsg && (
              <div className={`text-sm px-4 py-3 rounded-xl border ${
                restockMsg.ok
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>{restockMsg.text}</div>
            )}

            <form onSubmit={handleRestock} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Unidades a agregar <span className="text-red-500">*</span></label>
                <input ref={restockInputRef} type="number" value={restockUnits} min="1"
                  onChange={(e) => setRestockUnits(e.target.value)}
                  placeholder="Ej: 50"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock mínimo (alerta)</label>
                <input type="number" value={restockMin} min="1"
                  onChange={(e) => setRestockMin(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setRestockTarget(null)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:border-gray-300 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={restocking || !restockUnits}
                  className="flex-1 bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {restocking
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Agregando...</>
                    : <><ArrowPathIcon className="w-4 h-4" /> Confirmar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
