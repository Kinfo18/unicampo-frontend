'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // Login automático tras registro
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      // El backend devuelve { user, token } (no access_token)
      const { user, token } = res.data;
      setAuth(user, token);
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg ?? 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required
          placeholder="Tu nombre"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required
          placeholder="tu@correo.com"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
            onChange={handleChange} required placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
        <div className="relative">
          <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
            onChange={handleChange} required placeholder="Repite tu contraseña"
            className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition" />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        {form.confirmPassword && (
          <p className={`text-xs mt-1.5 ${form.password === form.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
            {form.password === form.confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
          </p>
        )}
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creando cuenta...</>
        ) : 'Crear cuenta'}
      </button>
    </form>
  );
}
