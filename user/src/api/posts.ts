import { apiFetch } from "./client";
import type { PaginatedPosts, PostDetail } from "../types";

export async function getPosts(
  page = 1,
  limit = 10,
  signal?: AbortSignal,
): Promise<PaginatedPosts> {
  return apiFetch<PaginatedPosts>(`/posts?page=${page}&limit=${limit}`, { signal });
}

export async function getPost(id: number, signal?: AbortSignal): Promise<PostDetail> {
  return apiFetch<PostDetail>(`/posts/${id}`, { signal });
}
