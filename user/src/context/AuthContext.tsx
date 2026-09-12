import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { User, LoginRequest, SignupRequest } from "../types";
import { getMe } from "../api/users";
import { login as apiLogin, signup as apiSignup } from "../api/auth";
import { apiFetch } from "../api/client";
import { setOnUnauthorized } from "../api/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    abortRef.current?.abort();
    apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    setLoading(false);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    setOnUnauthorized(() => {
      if (user) logout();
    });
    return () => setOnUnauthorized(null);
  }, [logout, user]);

  const fetchUser = useCallback(async (signal?: AbortSignal) => {
    try {
      const userData = await getMe(signal);
      setUser(userData);
    } catch {
      if (!signal?.aborted) {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    abortRef.current = controller;
    fetchUser(controller.signal).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [fetchUser]);

  const login = async (data: LoginRequest) => {
    await apiLogin(data);
    await fetchUser();
  };

  const signup = async (data: SignupRequest) => {
    await apiSignup(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
