const CART_BASE_URL = 'https://dummyjson.com/carts';

export type CartLine = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
};

export type Cart = {
  id: number;
  products: CartLine[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};

export type CartProductsInput = { id: number; quantity: number }[];

type UserCartsResponse = {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
};

export function getUserCart(userId: number): Promise<Cart[]> {
  return fetch(`${CART_BASE_URL}/user/${userId}`)
    .then((res) => handleResponse<UserCartsResponse>(res))
    .then((data) => data.carts);
}

export function createCart(userId: number, products: CartProductsInput): Promise<Cart> {
  return fetch(`${CART_BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, products }),
  }).then((res) => handleResponse<Cart>(res));
}

export function updateCart(cartId: number, products: CartProductsInput): Promise<Cart> {
  return fetch(`${CART_BASE_URL}/${cartId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merge: true, products }),
  }).then((res) => handleResponse<Cart>(res));
}

export function clearCartRequest(cartId: number): Promise<unknown> {
  return fetch(`${CART_BASE_URL}/${cartId}`, {
    method: 'DELETE',
  }).then((res) => handleResponse(res));
}

async function handleResponse<T = unknown>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}