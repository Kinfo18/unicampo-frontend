"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Category } from "@/types/product.types";

const categoryEmojis: Record<string, string> = {
  frutas: "🍎",
  verduras: "🥬",
  tuberculos: "🥔",
  granos: "🌾",
  lacteos: "🥛",
  carnes: "🥩",
  hierbas: "🌿",
  default: "📦",
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getEmoji = (slug: string) => {
    const key = Object.keys(categoryEmojis).find((k) => slug.includes(k));
    return key ? categoryEmojis[key] : categoryEmojis.default;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-1">
              Explora por categoría
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Qué estás buscando?
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:block text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas →
          </Link>
        </div>

        {/* Grid de categorías */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No hay categorías disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
                className="group flex flex-col items-center justify-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 rounded-2xl border border-primary-100 hover:border-primary-300 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {getEmoji(category.slug)}
                </span>
                <span className="text-sm font-medium text-gray-700 text-center leading-tight">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Ver todas móvil */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/categories"
            className="text-sm text-primary-600 font-medium"
          >
            Ver todas las categorías →
          </Link>
        </div>
      </div>
    </section>
  );
}
