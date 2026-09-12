import { apiFetch } from "./client";
import type { User } from "../types";

export async function getMe(signal?: AbortSignal): Promise<User> {
  return apiFetch<User>("/me", { signal });
}
