import { Suspense } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import ConfirmacionContent from './ConfirmacionContent';

export default function ConfirmacionPage() {
  return (
    <PublicLayout>
      <Suspense fallback={
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }>
        <ConfirmacionContent />
      </Suspense>
    </PublicLayout>
  );
}
