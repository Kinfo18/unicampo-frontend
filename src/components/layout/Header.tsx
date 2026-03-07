'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import api from '@/lib/api';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/categorias', label: 'Categorías' },
];

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
  category: { name: string };
}

export default function Header() {
  const router   = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted]           = useState(false);

  // Búsqueda global
  const [searchOpen, setSearchOpen]       = useState(false);
  const [searchInput, setSearchInput]     = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching]         = useState(false);
  const searchRef  = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const totalItems = useCartStore((s) => s.getTotalItems());

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); setSearchInput(''); }, [pathname]);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchInput('');
        setSearchResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchInput('');
        setSearchResults([]);
      }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Focus automático al abrir
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Debounce + fetch resultados
  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get(`/products?search=${encodeURIComponent(q)}&limit=5`);
      setSearchResults(res.data.data ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchResults(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput, fetchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchOpen(false);
    setSearchResults([]);
    router.push(`/productos?search=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput('');
  };

  const handleResultClick = () => {
    setSearchOpen(false);
    setSearchInput('');
    setSearchResults([]);
  };

  const formatPrice = (v: string) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(v));

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';
  const avatarSrc = user?.avatarUrl
    ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${apiBase}${user.avatarUrl}`)
    : null;

  const AvatarBubble = ({ size = 7 }: { size?: number }) => (
    avatarSrc ? (
      <div className={`relative w-${size} h-${size} rounded-full overflow-hidden shrink-0`}>
        <Image src={avatarSrc} alt={user?.name ?? 'Avatar'} fill className="object-cover" />
      </div>
    ) : (
      <div className={`w-${size} h-${size} bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0`}>
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    )
  );

  const handleLogout = () => {
    clearAuth();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-primary-700">Unicampo</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  pathname === link.href
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-0.5'
                    : 'text-gray-600 hover:text-primary-600'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-2">

            {/* Búsqueda expandible */}
            <div ref={searchRef} className="relative">
              <div className={`flex items-center gap-2 rounded-xl border transition-all duration-200 ${
                searchOpen
                  ? 'border-primary-300 bg-white shadow-sm pr-2'
                  : 'border-transparent'
              }`}>
                {searchOpen && (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      ref={searchInputRef}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Buscar productos..."
                      className="w-48 lg:w-64 pl-3 py-1.5 text-sm bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
                    />
                  </form>
                )}
                <button
                  onClick={() => {
                    if (searchOpen && !searchInput.trim()) {
                      setSearchOpen(false);
                    } else if (searchOpen && searchInput.trim()) {
                      router.push(`/productos?search=${encodeURIComponent(searchInput.trim())}`);
                      setSearchOpen(false);
                      setSearchInput('');
                      setSearchResults([]);
                    } else {
                      setSearchOpen(true);
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
                  title="Buscar"
                >
                  {searching
                    ? <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                    : <MagnifyingGlassIcon className="w-5 h-5" />}
                </button>
              </div>

              {/* Dropdown de resultados */}
              {searchOpen && searchInput.trim() && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {searchResults.length === 0 && !searching ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-400">Sin resultados para &ldquo;{searchInput}&rdquo;</p>
                      <p className="text-xs text-gray-300 mt-1">Presiona Enter para buscar en todos los productos</p>
                    </div>
                  ) : (
                    <>
                      <div className="divide-y divide-gray-50">
                        {searchResults.map((p) => (
                          <Link
                            key={p.id}
                            href={`/productos/${p.slug}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {p.images?.[0] ? (
                                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🛒</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                              <p className="text-xs text-gray-400 truncate">{p.category?.name}</p>
                            </div>
                            <p className="text-sm font-semibold text-primary-600 shrink-0">{formatPrice(p.price)}</p>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          router.push(`/productos?search=${encodeURIComponent(searchInput.trim())}`);
                          handleResultClick();
                        }}
                        className="w-full px-4 py-3 text-sm text-primary-600 font-medium bg-primary-50 hover:bg-primary-100 transition-colors text-center border-t border-primary-100"
                      >
                        Ver todos los resultados para &ldquo;{searchInput}&rdquo;
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Carrito */}
            <Link href="/carrito"
              className="relative p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Carrito">
              <ShoppingCartIcon className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Usuario */}
            {mounted && isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                >
                  <AvatarBubble size={7} />
                  <span className="text-sm font-medium text-gray-700">{user?.name.split(' ')[0]}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 mb-1 flex items-center gap-3">
                      <AvatarBubble size={9} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 transition-colors">
                        <Cog6ToothIcon className="w-4 h-4" /> Panel Admin
                      </Link>
                    )}
                    <Link href="/cuenta/perfil" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <UserIcon className="w-4 h-4" /> Mi cuenta
                    </Link>
                    <Link href="/cuenta/pedidos" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <ClipboardDocumentListIcon className="w-4 h-4" /> Mis pedidos
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <ArrowRightOnRectangleIcon className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <div className="flex items-center gap-2">
                <Link href="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/auth/registro"
                  className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
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
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-500">
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1">

          {/* Búsqueda móvil */}
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </form>

          {/* Resultados móvil */}
          {searchInput.trim() && searchResults.length > 0 && (
            <div className="bg-gray-50 rounded-xl overflow-hidden mb-2 divide-y divide-gray-100">
              {searchResults.map((p) => (
                <Link key={p.id} href={`/productos/${p.slug}`} onClick={handleResultClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-white transition-colors">
                  <div className="relative w-9 h-9 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                    {p.images?.[0]
                      ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300">🛒</div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category?.name}</p>
                  </div>
                  <p className="text-xs font-semibold text-primary-600 shrink-0">{formatPrice(p.price)}</p>
                </Link>
              ))}
              <button
                onClick={() => {
                  router.push(`/productos?search=${encodeURIComponent(searchInput.trim())}`);
                  handleResultClick();
                }}
                className="w-full px-3 py-2.5 text-xs text-primary-600 font-medium text-center bg-primary-50">
                Ver todos los resultados
              </button>
            </div>
          )}

          {/* Nav links móvil */}
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium py-2 px-3 rounded-xl ${
                pathname === link.href ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'
              }`}>
              {link.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-2 pt-3">
            {mounted && isAuthenticated ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                  <AvatarBubble size={9} />
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
                <Link href="/cuenta/perfil" className="flex items-center gap-3 text-sm text-gray-700 py-2 px-3 rounded-xl hover:bg-gray-50">
                  <UserIcon className="w-4 h-4" /> Mi cuenta
                </Link>
                <Link href="/cuenta/pedidos" className="flex items-center gap-3 text-sm text-gray-700 py-2 px-3 rounded-xl hover:bg-gray-50">
                  <ClipboardDocumentListIcon className="w-4 h-4" /> Mis pedidos
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 text-sm text-red-500 py-2 px-3 rounded-xl hover:bg-red-50 text-left mt-1">
                  <ArrowRightOnRectangleIcon className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login"
                  className="block text-center border border-primary-600 text-primary-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/auth/registro"
                  className="block text-center bg-primary-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
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
