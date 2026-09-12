import type { ApiError } from "../types";

const BASE_URL = "/api";

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(fn: (() => void) | null) {
  onUnauthorized = fn;
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

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
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
      onUnauthorized?.();
    }

    throw new FetchError(response.status, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
