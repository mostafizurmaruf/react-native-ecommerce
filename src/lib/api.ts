const API_BASE_URL = 'https://dummyjson.com';

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

export type LoginResult = AuthUser & {
  accessToken: string;
  refreshToken: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: { message?: string } | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data && typeof data.message === 'string' && data.message
        ? data.message
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export function loginRequest(username: string, password: string): Promise<LoginResult> {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  }).then((res) => handleResponse<LoginResult>(res));
}

export function getCurrentUserRequest(accessToken: string): Promise<AuthUser> {
  return fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => handleResponse<AuthUser>(res));
}