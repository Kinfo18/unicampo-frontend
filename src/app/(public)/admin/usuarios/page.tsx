'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { ToastContainer, toast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  isActive: boolean;
  phone?: string;
  municipality?: string;
  department?: string;
  createdAt: string;
}

const ROLE_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'CUSTOMER', label: 'Clientes' },
  { value: 'ADMIN', label: 'Admins' },
];

const ACTIVE_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
];

export default function AdminUsuariosPage() {
  const [users, setUsers]           = useState<User[]>([]);
  const [meta, setMeta]             = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage]             = useState(1);
  const [confirm, setConfirm]       = useState<{ userId: string; action: 'toggle' | 'role'; label: string; danger: boolean } | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (activeFilter) params.set('active', activeFilter);
    api.get(`/users?${params}`)
      .then((r) => { setUsers(r.data.data); setMeta(r.data.meta); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, roleFilter, activeFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, roleFilter, activeFilter]);

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openToggle = (u: User) => {
    setPendingUser(u);
    setConfirm({
      userId: u.id,
      action: 'toggle',
      label: u.isActive
        ? `¿Desactivar la cuenta de ${u.name}? No podrá iniciar sesión.`
        : `¿Activar la cuenta de ${u.name}?`,
      danger: u.isActive,
    });
  };

  const openRoleChange = (u: User) => {
    const newRole = u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    setPendingUser({ ...u, role: newRole as User['role'] });
    setConfirm({
      userId: u.id,
      action: 'role',
      label: `¿Cambiar el rol de ${u.name} a "${newRole === 'ADMIN' ? 'Admin' : 'Cliente'}"?`,
      danger: newRole === 'ADMIN',
    });
  };

  const handleConfirm = async () => {
    if (!confirm || !pendingUser) return;
    const { userId, action } = confirm;
    setConfirm(null);
    try {
      let body: Record<string, unknown> = {};
      if (action === 'toggle') body = { isActive: !users.find((u) => u.id === userId)?.isActive };
      if (action === 'role') body = { role: pendingUser.role };
      const { data } = await api.patch(`/users/${userId}`, body);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...data } : u));
      toast('success', 'Usuario actualizado', action === 'toggle'
        ? `Cuenta ${data.isActive ? 'activada' : 'desactivada'}`
        : `Rol cambiado a ${data.role}`);
    } catch {
      toast('error', 'Error', 'No se pudo actualizar el usuario.');
    }
    setPendingUser(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div>
      <ToastContainer />
      <ConfirmModal
        open={!!confirm}
        title={confirm?.action === 'toggle' ? (confirm.danger ? 'Desactivar usuario' : 'Activar usuario') : 'Cambiar rol'}
        message={confirm?.label ?? ''}
        confirmLabel="Confirmar"
        danger={confirm?.danger ?? false}
        onConfirm={handleConfirm}
        onCancel={() => { setConfirm(null); setPendingUser(null); }}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-sm text-gray-400 mt-0.5">{meta.total} usuario{meta.total !== 1 ? 's' : ''} encontrado{meta.total !== 1 ? 's' : ''}</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {ROLE_FILTERS.map((f) => (
            <button key={f.value || 'all-r'}
              onClick={() => setRoleFilter(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === f.value ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}>{f.label}</button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {ACTIVE_FILTERS.map((f) => (
            <button key={f.value || 'all-a'}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeFilter === f.value ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}>{f.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No se encontraron usuarios.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Usuario</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Ubicación</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Registro</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Rol</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                      {user.municipality && user.department
                        ? `${user.municipality}, ${user.department}`
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openRoleChange(user)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl border transition-colors ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}>
                        {user.role === 'ADMIN'
                          ? <><ShieldCheckIcon className="w-3.5 h-3.5" /> Admin</>
                          : <><UserIcon className="w-3.5 h-3.5" /> Cliente</>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openToggle(user)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          user.isActive ? 'bg-primary-500' : 'bg-gray-200'
                        }`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                          user.isActive ? 'translate-x-4' : 'translate-x-1'
                        }`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-400">Página {meta.page} de {meta.totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
