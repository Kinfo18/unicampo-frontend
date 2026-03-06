'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CategoriaForm from '../../CategoriaForm';

export default function EditarCategoriaPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/categories/${id}`)
      .then((r) => setCategory(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return <CategoriaForm mode="edit" category={category} />;
}
