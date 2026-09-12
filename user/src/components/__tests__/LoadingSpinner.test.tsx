import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders without crashing", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a spinner element", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("div");
    expect(spinner).toBeInTheDocument();
    expect(spinner?.childElementCount).toBe(1);
  });
});
