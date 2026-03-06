'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const formatPrice = (v: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

  const cards = [
    { label: 'Productos activos', value: stats?.totalProducts ?? '-', icon: ShoppingBagIcon, color: 'bg-blue-50 text-blue-600', href: '/admin/productos' },
    { label: 'Pedidos totales', value: stats?.totalOrders ?? '-', icon: ClipboardDocumentListIcon, color: 'bg-yellow-50 text-yellow-600', href: '/admin/pedidos' },
    { label: 'Usuarios', value: stats?.totalUsers ?? '-', icon: UsersIcon, color: 'bg-purple-50 text-purple-600', href: '/admin/usuarios' },
    { label: 'Ingresos totales', value: stats ? formatPrice(stats.totalRevenue ?? 0) : '-', icon: CurrencyDollarIcon, color: 'bg-green-50 text-green-600', href: '/admin/pedidos' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Acciones rápidas */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Acciones rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link href="/admin/productos/nuevo"
          className="bg-primary-600 text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-primary-700 transition-colors">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <ShoppingBagIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold">Nuevo producto</p>
            <p className="text-primary-100 text-xs mt-0.5">Agregar al catálogo</p>
          </div>
        </Link>

        <Link href="/admin/categorias/nueva"
          className="bg-emerald-600 text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-emerald-700 transition-colors">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <TagIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold">Nueva categoría</p>
            <p className="text-emerald-100 text-xs mt-0.5">Organizar productos</p>
          </div>
        </Link>

        <Link href="/admin/pedidos"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardDocumentListIcon className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Gestionar pedidos</p>
            <p className="text-gray-400 text-xs mt-0.5">Ver y actualizar estados</p>
          </div>
        </Link>

        <Link href="/admin/usuarios"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            <UsersIcon className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Ver usuarios</p>
            <p className="text-gray-400 text-xs mt-0.5">Listado de clientes</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
