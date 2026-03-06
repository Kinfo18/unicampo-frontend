import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marca */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold">Unicampo</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed max-w-sm">
              Tu tienda de productos agrícolas frescos directamente del campo.
              Calidad, frescura y precio justo para tu hogar.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary-300 mb-4">
              Navegación
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/productos", label: "Productos" },
                { href: "/categorias", label: "Categorías" },
                { href: "/carrito", label: "Carrito" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mi cuenta */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-primary-300 mb-4">
              Mi cuenta
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/auth/login", label: "Iniciar sesión" },
                { href: "/auth/register", label: "Registrarse" },
                { href: "/cuenta", label: "Mi perfil" },
                { href: "/pedidos", label: "Mis pedidos" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-primary-400 text-xs">
            © {new Date().getFullYear()} Unicampo. Todos los derechos
            reservados.
          </p>
          <p className="text-primary-400 text-xs">
            Hecho con ❤️ en Colombia 🇨🇴
          </p>
        </div>
      </div>
    </footer>
  );
}
