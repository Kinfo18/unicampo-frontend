import PublicLayout from "@/components/layout/PublicLayout";

export default function HomePage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-4">
          🌿 Bienvenido a Unicampo
        </h1>
        <p className="text-gray-500 text-lg">
          Productos agrícolas frescos del campo a tu puerta.
        </p>
      </div>
    </PublicLayout>
  );
}
