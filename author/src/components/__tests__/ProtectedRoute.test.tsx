import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    token: null,
    loading: false,
    isAuthor: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe("ProtectedRoute", () => {
  it("redirects to login when not authenticated", () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
