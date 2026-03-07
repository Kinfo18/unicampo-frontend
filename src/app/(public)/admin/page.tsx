'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBagIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Metrics {
  summary: { totalOrders: number; totalUsers: number; totalProducts: number; totalRevenue: number };
  ordersByStatus: { status: string; count: number }[];
  recentOrders: { id: string; status: string; total: string; createdAt: string; user: { name: string; email: string } }[];
  topProducts: { product: { name: string } | null; totalSold: number }[];
  lowStockAlerts: { productName: string; currentStock: number; minStock: number }[];
}

interface RevenueMonth { month: string; revenue: number }

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente', CONFIRMED: 'Confirmado', SHIPPED: 'Enviado',
  DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-400', CONFIRMED: 'bg-blue-400',
  SHIPPED: 'bg-indigo-400', DELIVERED: 'bg-green-400', CANCELLED: 'bg-red-400',
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [revenue, setRevenue]   = useState<RevenueMonth[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard').then((r) => r.data),
      api.get('/dashboard/revenue').then((r) => r.data),
    ])
      .then(([m, rev]) => { setMetrics(m); setRevenue(rev); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (v: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

  const formatMonth = (m: string) => {
    const [year, month] = m.split('-');
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('es-CO', { month: 'short', year: '2-digit' });
  };

  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);

  const cards = [
    { label: 'Productos activos', value: metrics?.summary.totalProducts ?? '-', icon: ShoppingBagIcon, color: 'bg-blue-50 text-blue-600', href: '/admin/productos' },
    { label: 'Pedidos totales',   value: metrics?.summary.totalOrders ?? '-',   icon: ClipboardDocumentListIcon, color: 'bg-yellow-50 text-yellow-600', href: '/admin/pedidos' },
    { label: 'Clientes',          value: metrics?.summary.totalUsers ?? '-',    icon: UsersIcon,  color: 'bg-purple-50 text-purple-600', href: '/admin/usuarios' },
    { label: 'Ingresos totales',  value: metrics ? formatPrice(metrics.summary.totalRevenue) : '-', icon: CurrencyDollarIcon, color: 'bg-green-50 text-green-600', href: '/admin/pedidos' },
  ];

  const quickActions = [
    { href: '/admin/productos/nuevo', label: 'Nuevo producto', sub: 'Agregar al catálogo', icon: ShoppingBagIcon, cls: 'bg-primary-600 hover:bg-primary-700 text-white', iconCls: 'bg-white/20', subCls: 'text-primary-100' },
    { href: '/admin/categorias/nueva', label: 'Nueva categoría', sub: 'Organizar productos', icon: TagIcon, cls: 'bg-emerald-600 hover:bg-emerald-700 text-white', iconCls: 'bg-white/20', subCls: 'text-emerald-100' },
    { href: '/admin/pedidos', label: 'Gestionar pedidos', sub: 'Ver y actualizar estados', icon: ClipboardDocumentListIcon, cls: 'bg-white border border-gray-100 shadow-sm hover:shadow-md text-gray-900', iconCls: 'bg-yellow-50', iconColor: 'text-yellow-500', subCls: 'text-gray-400' },
    { href: '/admin/usuarios', label: 'Ver usuarios', sub: 'Listado de clientes', icon: UsersIcon, cls: 'bg-white border border-gray-100 shadow-sm hover:shadow-md text-gray-900', iconCls: 'bg-purple-50', iconColor: 'text-purple-500', subCls: 'text-gray-400' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              {loading
                ? <div className="h-7 w-20 bg-gray-100 rounded animate-pulse mb-1" />
                : <p className="text-2xl font-bold text-gray-900">{card.value}</p>}
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Fila: gráfica de ingresos + pedidos por estado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Ingresos por mes — barchart CSS puro */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowTrendingUpIcon className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-gray-800">Ingresos por mes</h2>
          </div>
          {loading ? (
            <div className="h-40 bg-gray-50 rounded-xl animate-pulse" />
          ) : revenue.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Sin datos aún</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {revenue.map((r) => (
                <div key={r.month} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <span className="text-[10px] text-gray-400 truncate w-full text-center">
                    {formatPrice(r.revenue).replace('COP', '').trim()}
                  </span>
                  <div
                    className="w-full bg-primary-500 rounded-t-lg transition-all"
                    style={{ height: `${Math.max(4, (r.revenue / maxRevenue) * 100)}px` }}
                  />
                  <span className="text-[10px] text-gray-400">{formatMonth(r.month)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pedidos por estado */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Pedidos por estado</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map((i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {metrics?.ordersByStatus
                .filter((s) => s.count > 0)
                .map((s) => {
                  const total = metrics.summary.totalOrders || 1;
                  const pct = Math.round((s.count / total) * 100);
                  return (
                    <div key={s.status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{STATUS_LABEL[s.status] ?? s.status}</span>
                        <span className="font-semibold text-gray-800">{s.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${STATUS_COLOR[s.status] ?? 'bg-gray-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Fila: top productos + stock bajo + pedidos recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top 5 productos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Top productos vendidos</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : metrics?.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">Sin ventas aún</p>
          ) : (
            <ol className="space-y-2">
              {metrics?.topProducts.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="flex-1 text-gray-700 truncate">{p.product?.name ?? 'Producto eliminado'}</span>
                  <span className="font-semibold text-gray-800 shrink-0">{p.totalSold} uds.</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Stock bajo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-gray-800">Stock bajo</h2>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2].map((i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : metrics?.lowStockAlerts.length === 0 ? (
            <p className="text-sm text-gray-400">Sin alertas 🎉</p>
          ) : (
            <div className="space-y-2">
              {metrics?.lowStockAlerts.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1">{a.productName}</span>
                  <span className="ml-2 text-xs font-bold text-red-500 shrink-0">{a.currentStock} / {a.minStock}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Pedidos recientes</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {metrics?.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{o.user.name}</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-semibold text-gray-800">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(o.total))}
                    </p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${
                      STATUS_COLOR[o.status]?.replace('bg-', 'text-').replace('-400', '-600') ?? 'text-gray-500'
                    }`}>{STATUS_LABEL[o.status] ?? o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div>
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
    </div>
  );
}
