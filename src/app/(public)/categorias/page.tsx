'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TagIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  _count?: { products: number };
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((r) => {
        const data = Array.isArray(r.data) ? r.data : (r.data?.data ?? []);
        setCategories(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
        <p className="text-gray-500 mt-1 text-sm">Explora nuestros productos por categoría</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <TagIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No hay categorías disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoryId=${cat.id}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Imagen */}
              <div className="relative h-36 bg-primary-50">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TagIcon className="w-12 h-12 text-primary-200" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h2 className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{cat.description}</p>
                )}
                {cat._count !== undefined && (
                  <p className="text-xs text-primary-500 font-medium mt-2">
                    {cat._count.products} producto{cat._count.products !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
