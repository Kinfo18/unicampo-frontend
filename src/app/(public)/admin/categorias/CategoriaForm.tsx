'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface CategoriaFormProps {
  mode: 'create' | 'edit';
  category?: any;
}

export default function CategoriaForm({ mode, category }: CategoriaFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && category) {
      setForm({
        name: category.name ?? '',
        description: category.description ?? '',
        imageUrl: category.imageUrl ?? '',
      });
    }
  }, [mode, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
      };
      if (mode === 'create') {
        await api.post('/categories', payload);
      } else {
        await api.patch(`/categories/${category.id}`, payload);
      }
      router.push('/admin/categorias');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg ?? 'Error al guardar la categoría');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/categorias"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Información</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text" value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ej: Frutas y verduras"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3} placeholder="Descripción breve de la categoría..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de imagen</label>
            <input
              type="url" value={form.imageUrl}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
            {form.imageUrl && (
              <div className="relative mt-3 w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={form.imageUrl} alt="Preview"
                  fill className="object-cover"
                  onError={() => setForm((p) => ({ ...p, imageUrl: '' }))}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/categorias"
            className="flex-1 text-center border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:border-gray-300 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</>
              : mode === 'create' ? 'Crear categoría' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
