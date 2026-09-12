import { apiFetch } from "./client";
import type { Comment } from "../types";

export async function getComments(postId: number): Promise<Comment[]> {
  return apiFetch<Comment[]>(`/posts/${postId}/comments`);
}

export async function createComment(
  postId: number,
  content: string,
): Promise<Comment> {
  return apiFetch<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function updateComment(
  id: number,
  content: string,
): Promise<Comment> {
  return apiFetch<Comment>(`/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(id: number): Promise<void> {
  return apiFetch<void>(`/comments/${id}`, {
    method: "DELETE",
  });
}
