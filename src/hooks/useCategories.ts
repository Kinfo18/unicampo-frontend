'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Category } from '@/types/product.types';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get('/categories')
            .then((res) => setCategories(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return { categories, loading };
}
