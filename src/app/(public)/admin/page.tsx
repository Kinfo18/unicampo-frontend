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

  const quickActions = [
    {
      href: '/admin/productos/nuevo',
      label: 'Nuevo producto',
      sub: 'Agregar al catálogo',
      icon: ShoppingBagIcon,
      cls: 'bg-primary-600 hover:bg-primary-700 text-white',
      iconCls: 'bg-white/20',
      subCls: 'text-primary-100',
    },
    {
      href: '/admin/categorias/nueva',
      label: 'Nueva categoría',
      sub: 'Organizar productos',
      icon: TagIcon,
      cls: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      iconCls: 'bg-white/20',
      subCls: 'text-emerald-100',
    },
    {
      href: '/admin/pedidos',
      label: 'Gestionar pedidos',
      sub: 'Ver y actualizar estados',
      icon: ClipboardDocumentListIcon,
      cls: 'bg-white border border-gray-100 shadow-sm hover:shadow-md text-gray-900',
      iconCls: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      subCls: 'text-gray-400',
    },
    {
      href: '/admin/usuarios',
      label: 'Ver usuarios',
      sub: 'Listado de clientes',
      icon: UsersIcon,
      cls: 'bg-white border border-gray-100 shadow-sm hover:shadow-md text-gray-900',
      iconCls: 'bg-purple-50',
      iconColor: 'text-purple-500',
      subCls: 'text-gray-400',
    },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href}
            className={`rounded-2xl p-4 flex items-center gap-3 transition-all ${a.cls}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.iconCls}`}>
              <a.icon className={`w-5 h-5 ${a.iconColor ?? ''}`} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">{a.label}</p>
              <p className={`text-xs mt-0.5 truncate ${a.subCls}`}>{a.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
