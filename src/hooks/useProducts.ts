'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Product, ProductsResponse, ProductQuery } from '@/types/product.types';

export function useProducts(initialQuery: ProductQuery = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<ProductQuery>({ page: 1, limit: 12, ...initialQuery });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query.search)     params.set('search',     query.search);
            if (query.categoryId) params.set('categoryId', query.categoryId);
            if (query.sortBy)     params.set('sortBy',     query.sortBy);
            if (query.inStock)    params.set('inStock',    'true');
            if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
            if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
            if (query.page)  params.set('page',  String(query.page));
            if (query.limit) params.set('limit', String(query.limit));

            const res = await api.get<ProductsResponse>(`/products?${params}`);
            setProducts(res.data.data);
            setMeta(res.data.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const updateQuery = (newQuery: Partial<ProductQuery>) => {
        setQuery((prev) => ({ ...prev, ...newQuery, page: 1 }));
    };

    const setPage = (page: number) => {
        setQuery((prev) => ({ ...prev, page }));
    };

    return { products, meta, loading, query, updateQuery, setPage };
}
