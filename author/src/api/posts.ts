import { apiFetch } from "./client";
import type { PaginatedPosts, Post, PostFormData } from "../types";

export async function getPosts(
  page = 1,
  limit = 10,
): Promise<PaginatedPosts> {
  return apiFetch<PaginatedPosts>(`/posts?page=${page}&limit=${limit}`);
}

export async function getPost(id: number): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}`);
}

export async function createPost(data: PostFormData): Promise<Post> {
  return apiFetch<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePost(
  id: number,
  data: PostFormData,
): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: number): Promise<void> {
  return apiFetch<void>(`/posts/${id}`, {
    method: "DELETE",
  });
}

export async function setPostPublished(
  id: number,
  published: boolean,
): Promise<Post> {
  return apiFetch<Post>(`/posts/${id}/publish`, {
    method: "PATCH",
    body: JSON.stringify({ published }),
  });
}
