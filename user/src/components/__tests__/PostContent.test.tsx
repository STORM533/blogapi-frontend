import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PostContent from "../PostContent";
import type { PostDetail } from "../../types";

const mockPost: PostDetail = {
  id: 1,
  title: "Test Post Title",
  content: "First paragraph.\n\nSecond paragraph.",
  published: true,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  author: {
    id: 1,
    username: "testuser",
  },
  comments: [],
};

describe("PostContent", () => {
  it("renders post title", () => {
    render(<MemoryRouter><PostContent post={mockPost} /></MemoryRouter>);
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
  });

  it("renders author username", () => {
    render(<MemoryRouter><PostContent post={mockPost} /></MemoryRouter>);
    expect(screen.getByText("by testuser")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<MemoryRouter><PostContent post={mockPost} /></MemoryRouter>);
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
  });

  it("renders post content", () => {
    const { container } = render(<MemoryRouter><PostContent post={mockPost} /></MemoryRouter>);
    const content = container.querySelector("[class*='articleContent']");
    expect(content).toBeInTheDocument();
    expect(content?.textContent).toContain("First paragraph.");
    expect(content?.textContent).toContain("Second paragraph.");
  });
});
