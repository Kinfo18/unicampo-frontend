import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-green-700">🌿 Unicampo</h1>
      <p className="text-gray-500 text-lg">
        Tu tienda de productos agrícolas del campo
      </p>
      <Button className="bg-green-700 hover:bg-green-800">Ver productos</Button>
    </main>
  );
}
