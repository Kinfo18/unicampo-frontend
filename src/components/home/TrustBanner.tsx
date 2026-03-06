const features = [
  {
    emoji: "🌱",
    title: "Directamente del campo",
    description: "Sin intermediarios, desde el agricultor hasta tu mesa.",
  },
  {
    emoji: "🚚",
    title: "Entrega rápida",
    description: "Recibe tus productos frescos en menos de 24 horas.",
  },
  {
    emoji: "🔒",
    title: "Pago 100% seguro",
    description: "Transacciones protegidas con Mercado Pago.",
  },
  {
    emoji: "♻️",
    title: "Empaque sostenible",
    description: "Comprometidos con el medio ambiente en cada envío.",
  },
];

export default function TrustBanner() {
  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center gap-3 p-4"
            >
              <span className="text-4xl">{feature.emoji}</span>
              <h3 className="font-semibold text-gray-800 text-sm">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
