import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PostCard from "../PostCard";
import type { Post } from "../../types";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
  }),
}));

const mockPost: Post = {
  id: 1,
  title: "Test Post Title",
  content: "This is a test post content that should be truncated.",
  published: true,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  author: {
    id: 1,
    username: "testuser",
  },
  _count: {
    comments: 5,
  },
};

describe("PostCard", () => {
  it("renders post title", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} index={0} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
  });

  it("renders author username", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} index={0} />
      </MemoryRouter>,
    );
    expect(screen.getByText("by testuser")).toBeInTheDocument();
  });

  it("renders comment count", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} index={0} />
      </MemoryRouter>,
    );
    expect(screen.getByText("5 comments")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} index={0} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
  });

  it("links to post detail page", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} index={0} />
      </MemoryRouter>,
    );
    const link = screen.getByText("Test Post Title").closest("a");
    expect(link).toHaveAttribute("href", "/post/1");
  });
});
