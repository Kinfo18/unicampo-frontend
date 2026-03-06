import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import ProductDetailContent from './ProductDetailContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <PublicLayout>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3" />
                <div className="h-8 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 bg-gray-100 rounded animate-pulse w-2/3" />
                <div className="h-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-12 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        }
      >
        <ProductDetailContent slug={slug} />
      </Suspense>
    </PublicLayout>
  );
}
