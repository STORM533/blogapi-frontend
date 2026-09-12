import { apiFetch } from "./client";
import type { PaginatedPosts, PostDetail } from "../types";

export async function getPosts(
  page = 1,
  limit = 10,
): Promise<PaginatedPosts> {
  return apiFetch<PaginatedPosts>(`/posts?page=${page}&limit=${limit}`);
}

export async function getPost(id: number): Promise<PostDetail> {
  return apiFetch<PostDetail>(`/posts/${id}`);
}
