'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/categorias', label: 'Categorías' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const totalItems = useCartStore((s) => s.getTotalItems());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-primary-700">Unicampo</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-0.5'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-2">

            <Link
              href="/productos"
              className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Buscar productos"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Link>

            <Link
              href="/carrito"
              className="relative p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Carrito"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {mounted && isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                >
                  <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name.split(' ')[0]}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        Panel Admin
                      </Link>
                    )}

                    <Link
                      href="/cuenta"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Mi cuenta
                    </Link>

                    <Link
                      href="/cuenta/pedidos"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      Mis pedidos
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/registro"
                  className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            ) : null}
          </div>

          {/* Botones móvil */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/carrito" className="relative p-2 text-gray-500">
              <ShoppingCartIcon className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-500"
            >
              {mobileOpen
                ? <XMarkIcon className="w-6 h-6" />
                : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium py-2 px-3 rounded-xl ${
                pathname === link.href
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-2 pt-3">
            {mounted && isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                  <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>

                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-3 text-sm text-primary-700 py-2 px-3 rounded-xl hover:bg-primary-50">
                    <Cog6ToothIcon className="w-4 h-4" /> Panel Admin
                  </Link>
                )}
                <Link href="/cuenta" className="flex items-center gap-3 text-sm text-gray-700 py-2 px-3 rounded-xl hover:bg-gray-50">
                  <UserIcon className="w-4 h-4" /> Mi cuenta
                </Link>
                <Link href="/cuenta/pedidos" className="flex items-center gap-3 text-sm text-gray-700 py-2 px-3 rounded-xl hover:bg-gray-50">
                  <ClipboardDocumentListIcon className="w-4 h-4" /> Mis pedidos
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-sm text-red-500 py-2 px-3 rounded-xl hover:bg-red-50 text-left mt-1"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="block text-center border border-primary-600 text-primary-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/registro"
                  className="block text-center bg-primary-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
