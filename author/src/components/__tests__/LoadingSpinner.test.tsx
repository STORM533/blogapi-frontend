import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders a loading spinner", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByText("", { selector: ".animate-spin" });
    expect(spinner).toBeInTheDocument();
  });

  it("has animate-spin class", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByText("", { selector: ".animate-spin" });
    expect(spinner).toHaveClass("animate-spin");
  });
});
