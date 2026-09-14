import type { ApiError } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL;

let onUnauthorized: (() => void) | null = null;
let authToken: string | null = null;
export function setOnUnauthorized(fn: (() => void) | null) {
  onUnauthorized = fn;
}
export function setAuthToken(token: string | null) {
  authToken = token;
}
export class FetchError extends Error {
  status: number;
  data: ApiError;

  constructor(status: number, data: ApiError) {
    super(data.message);
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let data: ApiError;
    try {
      data = await response.json();
    } catch {
      data = { message: "An unexpected error occurred" };
    }

    if (response.status === 401) {
      setAuthToken(null);
      onUnauthorized?.();
    }

    throw new FetchError(response.status, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
