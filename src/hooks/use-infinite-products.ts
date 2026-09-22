import { useCallback, useEffect, useRef, useState } from 'react';

import { getProducts, type Product, type ProductQueryParams } from '@/lib/products';

const PAGE_SIZE = 20;

type State = {
  products: Product[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
};

const INITIAL_STATE: State = {
  products: [],
  total: 0,
  isLoading: true,
  isLoadingMore: false,
  isRefreshing: false,
  error: null,
};

function currentParamsKey(params: ProductQueryParams) {
  return {
    q: params.q ?? '',
    category: params.category ?? '',
    sortBy: params.sortBy ?? '',
    order: params.order ?? '',
  };
}

export function useInfiniteProducts(params: ProductQueryParams = {}) {
  const [state, setState] = useState<State>(INITIAL_STATE);

  const requestIdRef = useRef(0);
  const paramsRef = useRef(params);

  const paramsKey = JSON.stringify(currentParamsKey(params));

  const { q, category, sortBy, order } = params;

  useEffect(() => {
    paramsRef.current = { q, category, sortBy, order };
  }, [q, category, sortBy, order]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const currentParams = paramsRef.current;

    getProducts({ ...currentParams, limit: PAGE_SIZE, skip: 0 })
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setState({
          products: data.products,
          total: data.total,
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
          error: null,
        });
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setState({
          products: [],
          total: 0,
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
          error: 'Failed to load products. Pull to retry.',
        });
      });
  }, [paramsKey]);

  const loadMore = useCallback(() => {
    setState((prev) => {
      if (prev.isLoading || prev.isLoadingMore || prev.isRefreshing) return prev;
      if (prev.products.length >= prev.total && prev.total > 0) return prev;

      const requestId = ++requestIdRef.current;
      const skip = prev.products.length;
      const currentParams = paramsRef.current;

      getProducts({ ...currentParams, limit: PAGE_SIZE, skip })
        .then((data) => {
          if (requestId !== requestIdRef.current) return;
          setState((current) => ({
            products: [...current.products, ...data.products],
            total: data.total,
            isLoading: false,
            isLoadingMore: false,
            isRefreshing: false,
            error: null,
          }));
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setState((current) => ({ ...current, isLoadingMore: false }));
        });

      return { ...prev, isLoadingMore: true };
    });
  }, []);

  const refresh = useCallback(() => {
    const requestId = ++requestIdRef.current;
    const currentParams = paramsRef.current;

    setState((prev) => ({ ...prev, isRefreshing: true, error: null }));

    getProducts({ ...currentParams, limit: PAGE_SIZE, skip: 0 })
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setState({
          products: data.products,
          total: data.total,
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
          error: null,
        });
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setState((prev) => ({ ...prev, isRefreshing: false, error: 'Failed to refresh.' }));
      });
  }, []);

  const hasMore = state.products.length < state.total || state.total === 0;

  return {
    products: state.products,
    total: state.total,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    isRefreshing: state.isRefreshing,
    error: state.error,
    hasMore,
    canLoadMore: state.products.length > 0 && !state.isLoading && hasMore,
    loadMore,
    refresh,
  };
}