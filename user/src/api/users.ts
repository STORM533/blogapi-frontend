import { apiFetch } from "./client";
import type { User, PaginatedComments } from "../types";

export async function getMe(signal?: AbortSignal): Promise<User> {
  return apiFetch<User>("/me", { signal });
}

export async function getMyComments(
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<PaginatedComments> {
  return apiFetch<PaginatedComments>(
    `/me/comments?page=${page}&limit=${limit}`,
    { signal },
  );
}
