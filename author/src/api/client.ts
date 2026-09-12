import { getToken } from "../utils/token";
import type { ApiError } from "../types";

const BASE_URL = "/api";

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
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let data: ApiError;
    try {
      data = await response.json();
    } catch {
      data = { message: "An unexpected error occurred" };
    }
    throw new FetchError(response.status, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
