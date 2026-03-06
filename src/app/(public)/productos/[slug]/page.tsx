import { Suspense } from 'react';
import ProductDetailContent from './ProductDetailContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando producto...</p>
          </div>
        </div>
      }
    >
      <ProductDetailContent slug={slug} />
    </Suspense>
  );
}
