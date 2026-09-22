const PRODUCTS_BASE_URL = 'https://dummyjson.com/products';

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};

export type ProductQueryParams = {
  q?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  skip?: number;
};

export type SortByOption = 'title' | 'price' | 'rating' | 'brand';

export function getProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set('q', params.q);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.order) searchParams.set('order', params.order);
  searchParams.set('limit', String(params.limit ?? 20));
  searchParams.set('skip', String(params.skip ?? 0));

  const query = searchParams.toString();
  const url = params.category
    ? `${PRODUCTS_BASE_URL}/category/${encodeURIComponent(params.category)}?${query}`
    : params.q
      ? `${PRODUCTS_BASE_URL}/search?${query}`
      : `${PRODUCTS_BASE_URL}?${query}`;

  return fetch(url).then<ProductsResponse>(handleResponse);
}

export function getProduct(id: number): Promise<Product> {
  return fetch(`${PRODUCTS_BASE_URL}/${id}`).then<Product>(handleResponse);
}

export function getCategories(): Promise<Category[]> {
  return fetch(`${PRODUCTS_BASE_URL}/categories`).then<Category[]>(handleResponse);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}