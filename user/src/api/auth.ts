import { apiFetch } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  User,
} from "../types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signup(data: SignupRequest): Promise<User> {
  return apiFetch<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
