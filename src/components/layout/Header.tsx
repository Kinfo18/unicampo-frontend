"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/categories", label: "Categorías" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const totalItems = useCartStore((s) => s.getTotalItems());

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
                    ? "text-primary-600 border-b-2 border-primary-600 pb-0.5"
                    : "text-gray-600 hover:text-primary-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Búsqueda */}
            <Link
              href="/products"
              className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
              title="Buscar productos"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Link>

            {/* Carrito */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Usuario */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-xs bg-earth-500 text-white px-2 py-1 rounded-full font-medium hover:bg-earth-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="font-medium">
                    {user?.name.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={clearAuth}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" className="relative p-2 text-gray-500">
              <ShoppingCartIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-500"
            >
              {mobileOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium py-1 ${
                pathname === link.href ? "text-primary-600" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-gray-700"
                >
                  Mi cuenta — {user?.name}
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-earth-600 font-medium"
                  >
                    Panel de administración
                  </Link>
                )}
                <button
                  onClick={clearAuth}
                  className="text-sm text-red-500 text-left"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
