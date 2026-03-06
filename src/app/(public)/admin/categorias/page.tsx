'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  _count?: { products: number };
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories').then((r) => {
      setCategories(r.data.data ?? r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los productos asociados quedarán sin categoría.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/categories/${id}`);
      setCategories((c) => c.filter((x) => x.id !== id));
    } catch (err: any) {
      const msg = err.response?.data?.message;
      alert(Array.isArray(msg) ? msg[0] : msg ?? 'Error al eliminar la categoría');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <Link
          href="/admin/categorias/nueva"
          className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Nueva categoría
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <TagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No hay categorías creadas aún.</p>
          <Link href="/admin/categorias/nueva" className="text-primary-600 font-medium hover:underline">
            Crear la primera
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              {/* Imagen */}
              <div className="relative h-32 bg-primary-50">
                {cat.imageUrl ? (
                  <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TagIcon className="w-10 h-10 text-primary-200" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{cat.description}</p>
                    )}
                    {cat._count !== undefined && (
                      <p className="text-xs text-gray-400 mt-1">
                        {cat._count.products} producto{cat._count.products !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/categorias/${cat.id}/editar`}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deleting === cat.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
