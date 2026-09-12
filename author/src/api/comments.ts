import { apiFetch } from "./client";
import type { Comment } from "../types";

export async function getPostComments(
  postId: number,
  signal?: AbortSignal,
): Promise<Comment[]> {
  return apiFetch<Comment[]>(`/posts/${postId}/comments`, { signal });
}

export async function deleteComment(id: number): Promise<void> {
  return apiFetch<void>(`/comments/${id}`, {
    method: "DELETE",
  });
}
