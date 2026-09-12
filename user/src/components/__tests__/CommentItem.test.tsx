import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CommentItem from "../CommentItem";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
  }),
}));

const mockComment = {
  id: 1,
  content: "This is a test comment.",
  createdAt: "2024-01-15T10:30:00Z",
  user: {
    id: 1,
    username: "commenter",
  },
};

describe("CommentItem", () => {
  it("renders comment content", () => {
    render(
      <MemoryRouter>
        <CommentItem comment={mockComment} onCommentSaved={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByText("This is a test comment.")).toBeInTheDocument();
  });

  it("renders username", () => {
    render(
      <MemoryRouter>
        <CommentItem comment={mockComment} onCommentSaved={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByText("commenter")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(
      <MemoryRouter>
        <CommentItem comment={mockComment} onCommentSaved={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
  });
});
