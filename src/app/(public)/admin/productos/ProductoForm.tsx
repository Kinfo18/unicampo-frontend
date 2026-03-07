'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Category { id: string; name: string; }

interface ProductoFormProps {
  mode: 'create' | 'edit';
  product?: any;
}

export default function ProductoForm({ mode, product }: ProductoFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', categoryId: '',
    initialStock: '', minStock: '5', isActive: true, images: [] as string[],
  });
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Reabastecimiento (solo modo edit)
  const [restockUnits, setRestockUnits]     = useState('');
  const [restockMin, setRestockMin]         = useState('');
  const [restocking, setRestocking]         = useState(false);
  const [restockSuccess, setRestockSuccess] = useState<string | null>(null);
  const [restockError, setRestockError]     = useState<string | null>(null);
  const [currentStock, setCurrentStock]     = useState<number | null>(null);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.data ?? r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setForm({
        name: product.name ?? '',
        description: product.description ?? '',
        price: String(product.price ?? ''),
        categoryId: product.categoryId ?? '',
        initialStock: String(product.inventory?.quantity ?? ''),
        minStock: String(product.inventory?.minStock ?? '5'),
        isActive: product.isActive ?? true,
        images: product.images ?? [],
      });
      setCurrentStock(product.inventory?.quantity ?? 0);
      setRestockMin(String(product.inventory?.minStock ?? '5'));
    }
  }, [mode, product]);

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setForm((p) => ({ ...p, images: [...p.images, url] }));
    setImageInput('');
  };
  const removeImage = (idx: number) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim())              { setError('El nombre es obligatorio'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('El precio debe ser mayor a 0'); return; }
    if (!form.categoryId)               { setError('Selecciona una categoría'); return; }
    setSaving(true); setError(null);
    try {
      const payload: any = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number(form.price),
        categoryId: form.categoryId,
        images: form.images,
        isActive: form.isActive,
      };
      if (mode === 'create') {
        payload.initialStock = form.initialStock ? Number(form.initialStock) : 0;
        payload.minStock     = form.minStock ? Number(form.minStock) : 5;
        await api.post('/products', payload);
      } else {
        await api.patch(`/products/${product.id}`, payload);
      }
      router.push('/admin/productos');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg ?? 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  // Sin FormEvent — se llama desde onClick de un button type="button"
  const handleRestock = async () => {
    const units = Number(restockUnits);
    if (!units || units <= 0) { setRestockError('Ingresa un número de unidades válido'); return; }
    setRestocking(true); setRestockError(null); setRestockSuccess(null);
    try {
      const payload: any = { units };
      if (restockMin && Number(restockMin) > 0) payload.minStock = Number(restockMin);
      const res = await api.patch(`/products/${product.id}/stock`, payload);
      const { currentStock: newStock, addedUnits } = res.data;
      setCurrentStock(newStock);
      setRestockSuccess(`✅ +${addedUnits} unidades agregadas. Stock actual: ${newStock}`);
      setRestockUnits('');
      setTimeout(() => setRestockSuccess(null), 4000);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setRestockError(Array.isArray(msg) ? msg[0] : msg ?? 'Error al reabastecer');
    } finally {
      setRestocking(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/productos" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* Información básica */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Información básica</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre <span className="text-red-500">*</span></label>
            <input type="text" value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ej: Papa criolla fresca"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              rows={3} placeholder="Descripción del producto..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio (COP) <span className="text-red-500">*</span></label>
              <input type="number" value={form.price} min="0" step="50"
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="15000"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría <span className="text-red-500">*</span></label>
              <select value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-white">
                <option value="">Seleccionar</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button type="button"
              onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isActive ? 'bg-primary-600' : 'bg-gray-300'
              }`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.isActive ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
            <span className="text-sm text-gray-700">{form.isActive ? 'Producto activo' : 'Producto inactivo'}</span>
          </div>
        </div>

        {/* Inventario inicial — solo creación */}
        {mode === 'create' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-800">Inventario inicial</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock inicial</label>
                <input type="number" value={form.initialStock} min="0"
                  onChange={(e) => setForm((p) => ({ ...p, initialStock: e.target.value }))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock mínimo</label>
                <input type="number" value={form.minStock} min="1"
                  onChange={(e) => setForm((p) => ({ ...p, minStock: e.target.value }))}
                  placeholder="5"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
              </div>
            </div>
          </div>
        )}

        {/* Reabastecimiento — solo edición. Usa div en vez de form para evitar form anidado */}
        {mode === 'edit' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Inventario</h2>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                (currentStock ?? 0) === 0
                  ? 'bg-red-100 text-red-600'
                  : (currentStock ?? 0) <= 5
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-green-100 text-green-700'
              }`}>
                Stock actual: {currentStock ?? 0} unidades
              </span>
            </div>

            {restockSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
                {restockSuccess}
              </div>
            )}
            {restockError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {restockError}
              </div>
            )}

            {/* div en lugar de form — evita <form> anidado */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Unidades a agregar <span className="text-red-500">*</span>
                  </label>
                  <input type="number" value={restockUnits} min="1"
                    onChange={(e) => setRestockUnits(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleRestock())}
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
              </div>
              <button
                type="button"
                onClick={handleRestock}
                disabled={restocking || !restockUnits}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50">
                {restocking
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Agregando...</>
                  : <><ArrowPathIcon className="w-4 h-4" /> Reabastecer stock</>}
              </button>
            </div>
          </div>
        )}

        {/* Imágenes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-800">Imágenes</h2>
          <p className="text-xs text-gray-400">Ingresa URLs de imágenes (Cloudinary, Imgur, etc.)</p>
          <div className="flex gap-2">
            <input type="url" value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              placeholder="https://..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition" />
            <button type="button" onClick={addImage}
              className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium transition-colors">
              <PlusIcon className="w-4 h-4" /> Agregar
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative group">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={url} alt={`img-${idx}`} fill className="object-cover" onError={() => {}} />
                  </div>
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link href="/admin/productos"
            className="flex-1 text-center border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:border-gray-300 transition-colors">
            Cancelar
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</>
              : mode === 'create' ? 'Crear producto' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
