import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white overflow-hidden">
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🌿</div>
        <div className="absolute top-20 right-20 text-6xl">🥭</div>
        <div className="absolute bottom-10 left-1/4 text-7xl">🌽</div>
        <div className="absolute bottom-20 right-10 text-5xl">🍅</div>
        <div className="absolute top-1/2 left-1/2 text-9xl">🥬</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full mb-6 border border-white/30">
            🇨🇴 Del campo colombiano a tu mesa
          </span>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Productos agrícolas
            <span className="block text-earth-300">frescos y naturales</span>
          </h1>

          {/* Descripción */}
          <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
            Conectamos directamente con agricultores colombianos para traerte
            frutas, verduras y productos del campo con la mejor calidad y precio
            justo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              🛒 Ver productos
            </Link>
            <Link
              href="/categorias"
              className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/30 hover:bg-white/25 transition-colors"
            >
              📦 Ver categorías
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/20">
            {[
              { value: "100%", label: "Productos naturales" },
              { value: "24h", label: "Entrega rápida" },
              { value: "🔒", label: "Pago seguro" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
