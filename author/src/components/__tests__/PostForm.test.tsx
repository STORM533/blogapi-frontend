import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostForm from "../PostForm";

vi.mock("@tinymce/tinymce-react", () => ({
  Editor: ({ onEditorChange, value }: { onEditorChange: (content: string) => void; value: string }) => (
    <textarea
      data-testid="tinymce-editor"
      value={value}
      onChange={(e) => onEditorChange(e.target.value)}
    />
  ),
}));

describe("PostForm", () => {
  it("renders form fields", () => {
    render(<PostForm onSubmit={vi.fn()} submitLabel="Create" />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByTestId("tinymce-editor")).toBeInTheDocument();
    expect(screen.getByLabelText("Publish immediately")).toBeInTheDocument();
  });

  it("renders submit button with label", () => {
    render(<PostForm onSubmit={vi.fn()} submitLabel="Create Post" />);
    expect(screen.getByRole("button", { name: "Create Post" })).toBeInTheDocument();
  });

  it("calls onSubmit with form data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PostForm onSubmit={onSubmit} submitLabel="Create" />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByTestId("tinymce-editor"), {
      target: { value: "Test content" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Test Title",
      content: "Test content",
      published: false,
    });
  });

  it("initializes with provided data", () => {
    render(
      <PostForm
        initialData={{ title: "Initial Title", content: "Initial content", published: true }}
        onSubmit={vi.fn()}
        submitLabel="Update"
      />,
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Initial Title");
    expect(screen.getByTestId("tinymce-editor")).toHaveValue("Initial content");
    expect(screen.getByLabelText("Publish immediately")).toBeChecked();
  });
});
