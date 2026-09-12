import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PostList from "../PostList";
import type { Post, Pagination } from "../../types";

const mockPosts: Post[] = [
  {
    id: 1,
    title: "Post 1",
    content: "Content 1",
    published: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    author: { id: 1, username: "user1" },
  },
  {
    id: 2,
    title: "Post 2",
    content: "Content 2",
    published: true,
    createdAt: "2024-01-16T10:30:00Z",
    updatedAt: "2024-01-16T10:30:00Z",
    author: { id: 2, username: "user2" },
  },
];

const mockPagination: Pagination = {
  page: 2,
  limit: 10,
  total: 25,
  totalPages: 3,
};

describe("PostList", () => {
  it("renders all posts", () => {
    render(
      <MemoryRouter>
        <PostList
          posts={mockPosts}
          pagination={mockPagination}
          onPageChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });

  it("shows empty message when no posts", () => {
    render(
      <MemoryRouter>
        <PostList
          posts={[]}
          pagination={{ ...mockPagination, total: 0, totalPages: 0 }}
          onPageChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("No posts found.")).toBeInTheDocument();
  });

  it("shows pagination when totalPages > 1", () => {
    render(
      <MemoryRouter>
        <PostList
          posts={mockPosts}
          pagination={mockPagination}
          onPageChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("calls onPageChange when clicking Previous", () => {
    const onPageChange = vi.fn();
    render(
      <MemoryRouter>
        <PostList
          posts={mockPosts}
          pagination={mockPagination}
          onPageChange={onPageChange}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Previous"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange when clicking Next", () => {
    const onPageChange = vi.fn();
    render(
      <MemoryRouter>
        <PostList
          posts={mockPosts}
          pagination={mockPagination}
          onPageChange={onPageChange}
        />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables Previous on first page", () => {
    render(
      <MemoryRouter>
        <PostList
          posts={mockPosts}
          pagination={{ ...mockPagination, page: 1 }}
          onPageChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables Next on last page", () => {
    render(
      <MemoryRouter>
        <PostList
          posts={mockPosts}
          pagination={{ ...mockPagination, page: 3 }}
          onPageChange={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Next")).toBeDisabled();
  });
});
