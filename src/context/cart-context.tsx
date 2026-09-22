import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth-context';
import { clearCartRequest, createCart, getUserCart, updateCart, type CartLine } from '@/lib/cart';
import type { Product } from '@/lib/products';

const DEFAULT_USER_ID = 1;

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isLoading: boolean;
  totalQuantity: number;
  total: number;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineToProduct(line: CartLine): Product {
  return {
    id: line.id,
    title: line.title,
    description: '',
    category: '',
    price: line.price,
    discountPercentage: line.discountPercentage,
    rating: 0,
    stock: 0,
    brand: '',
    thumbnail: line.thumbnail,
    images: [line.thumbnail],
  };
}

function lineTotal(product: Product): number {
  return product.price * (1 - product.discountPercentage / 100);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? DEFAULT_USER_ID;

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cartIdRef = useRef<number | null>(null);

  const syncCart = useCallback(
    async (next: CartItem[]) => {
      const products = next.map((item) => ({ id: item.product.id, quantity: item.quantity }));
      try {
        if (products.length === 0) {
          if (cartIdRef.current != null) {
            await clearCartRequest(cartIdRef.current);
            cartIdRef.current = null;
          }
          return;
        }
        if (cartIdRef.current == null) {
          const cart = await createCart(userId, products);
          cartIdRef.current = cart.id;
        } else {
          await updateCart(cartIdRef.current, products);
        }
      } catch {
        // Writes are simulated on the mock server; keep optimistic local state.
      }
    },
    [userId],
  );

  useEffect(() => {
    let cancelled = false;
    getUserCart(userId)
      .then(async (cartLines) => {
        if (cancelled) return;
        if (cartLines.length === 0) {
          setItems([]);
          return;
        }
        const [cart] = cartLines;
        cartIdRef.current = cart.id;
        setItems(
          cart.products.map((line) => ({ product: lineToProduct(line), quantity: line.quantity })),
        );
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const add = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        const next = existing
          ? prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || item.quantity + quantity) }
                : item,
            )
          : [...prev, { product, quantity: Math.min(quantity, product.stock || quantity) }];
        void syncCart(next);
        return next;
      });
    },
    [syncCart],
  );

  const remove = useCallback(
    (productId: number) => {
      setItems((prev) => {
        const next = prev.filter((item) => item.product.id !== productId);
        void syncCart(next);
        return next;
      });
    },
    [syncCart],
  );

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      setItems((prev) => {
        const next = prev
          .map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock || quantity)) }
              : item,
          )
          .filter((item) => item.quantity >= 1);
        void syncCart(next);
        return next;
      });
    },
    [syncCart],
  );

  const clear = useCallback(() => {
    setItems((prev) => {
      if (prev.length === 0) return prev;
      void syncCart([]);
      return [];
    });
  }, [syncCart]);

  const { totalQuantity, total } = useMemo(() => {
    let totalQuantity = 0;
    let total = 0;
    for (const item of items) {
      totalQuantity += item.quantity;
      total += lineTotal(item.product) * item.quantity;
    }
    return { totalQuantity, total };
  }, [items]);

  const value = useMemo(
    () => ({ items, isLoading, totalQuantity, total, add, remove, updateQuantity, clear }),
    [items, isLoading, totalQuantity, total, add, remove, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}