'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// /admin/categorias/[id] redirige a su subpágina de edición
export default function CategoriaRedirectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/admin/categorias/${id}/editar`);
  }, [id, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
