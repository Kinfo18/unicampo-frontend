'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  UserCircleIcon,
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

const DEPARTAMENTOS_CO = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá','Caldas',
  'Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca',
  'Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño',
  'Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés y Providencia',
  'Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada',
  'Bogotá D.C.',
];

export default function PerfilContent() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', phone: '', address: '', municipality: '', department: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    // Hidratar formulario con datos actuales
    if (user) {
      setForm({
        name: user.name ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        municipality: user.municipality ?? '',
        department: user.department ?? '',
      });
      if (user.avatarUrl) setAvatarPreview(user.avatarUrl);
    }
  }, [mounted, isAuthenticated, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.patch('/users/profile', form);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview inmediato
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/users/profile/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data);
      setAvatarPreview(
        res.data.avatarUrl.startsWith('http')
          ? res.data.avatarUrl
          : `${process.env.NEXT_PUBLIC_API_URL}${res.data.avatarUrl}`,
      );
    } catch {
      setError('Error al subir la foto. Máx. 2 MB (JPG, PNG, WEBP)');
    } finally {
      setUploading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';
  const displayAvatar = avatarPreview
    ? (avatarPreview.startsWith('blob:') || avatarPreview.startsWith('http')
        ? avatarPreview
        : `${apiBase}${avatarPreview}`)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      <div className="flex items-center gap-3 mb-8">
        <UserCircleIcon className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mi cuenta</h1>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">Foto de perfil</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 shrink-0">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt="Avatar"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                <UserCircleIcon className="w-12 h-12 text-primary-400" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-sm font-medium text-primary-600 border border-primary-200 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
              <CameraIcon className="w-4 h-4" />
              {uploading ? 'Subiendo...' : 'Cambiar foto'}
            </button>
            <p className="text-xs text-gray-400 mt-1.5">Máx. 2 MB • JPG, PNG o WEBP</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* Datos personales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-5">Datos personales</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
              <input
                type="text" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="flex items-center gap-1"><PhoneIcon className="w-4 h-4" /> Teléfono</span>
              </label>
              <input
                type="tel" value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Ej: 3001234567"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> Dirección de entrega</span>
              </label>
              <div className="space-y-3">
                <input
                  type="text" value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Calle, carrera, avenida, #..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
                <input
                  type="text" value={form.municipality}
                  onChange={(e) => setForm((p) => ({ ...p, municipality: e.target.value }))}
                  placeholder="Municipio"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
                <select
                  value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-white"
                >
                  <option value="">Selecciona un departamento</option>
                  {DEPARTAMENTOS_CO.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Info de cuenta (no editable) */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 mb-2">Correo electrónico</p>
          <p className="text-sm text-gray-700 font-medium">{user?.email}</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
        >
          {saving
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</>
            : success
            ? <><CheckCircleIcon className="w-5 h-5" /> Cambios guardados</>
            : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
