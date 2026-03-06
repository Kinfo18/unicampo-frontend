import { Suspense } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import ProductsPageContent from "./ProductsPageContent";

export const metadata = {
  title: "Productos",
  description: "Explora todos nuestros productos agrícolas frescos del campo.",
};

export default function ProductosPage() {
  return (
    <PublicLayout>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                >
                  <div className="h-44 bg-gray-100 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <ProductsPageContent />
      </Suspense>
    </PublicLayout>
  );
}
