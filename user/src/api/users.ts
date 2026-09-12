import { apiFetch } from "./client";
import type { User, PaginatedComments } from "../types";

export async function getMe(): Promise<User> {
  return apiFetch<User>("/me");
}

export async function getMyComments(
  page = 1,
  limit = 10,
): Promise<PaginatedComments> {
  return apiFetch<PaginatedComments>(
    `/me/comments?page=${page}&limit=${limit}`,
  );
}
