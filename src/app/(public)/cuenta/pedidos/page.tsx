import PublicLayout from '@/components/layout/PublicLayout';
import { Suspense } from 'react';
import MisPedidosContent from './MisPedidosContent';

export default function MisPedidosPage() {
  return (
    <PublicLayout>
      <Suspense fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }>
        <MisPedidosContent />
      </Suspense>
    </PublicLayout>
  );
}
