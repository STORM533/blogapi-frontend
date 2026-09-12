import { apiFetch } from "./client";
import type { LoginRequest, LoginResponse } from "../types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
