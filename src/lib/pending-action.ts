import type { Product } from '@/lib/products';

let pendingAdd: Product | null = null;

export function setPendingAdd(product: Product) {
  pendingAdd = product;
}

export function consumePendingAdd(): Product | null {
  const product = pendingAdd;
  pendingAdd = null;
  return product;
}