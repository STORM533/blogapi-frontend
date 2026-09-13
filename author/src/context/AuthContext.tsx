import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { setAuthToken, setOnUnauthorized } from "../api/client";
import { getMe } from "../api/users";
import type { LoginRequest, User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthor: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}
const AUTH_TOKEN_KEY = "author_auth_token";
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    abortRef.current?.abort();

    setAuthToken(null);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);

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

    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return () => {
        active = false;
        controller.abort();
      };
    }

    setAuthToken(token);

    fetchUser(controller.signal).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [fetchUser]);

  const login = async (data: LoginRequest) => {
    const response = await apiLogin(data);

    setAuthToken(response.token);
    sessionStorage.setItem(AUTH_TOKEN_KEY, response.token);

    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthor: user?.role === "AUTHOR",
        login,
        logout,
      }}
    >
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
