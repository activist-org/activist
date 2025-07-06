import Typography from "@/components/Typography.vue";
import { render } from "@testing-library/vue";
import { describe, it, expect } from "vitest";

describe("Typography Component", () => {
  it('renders the correct tag based on the "variant" prop', () => {
    const { getByText } = render(Typography, {
      props: { variant: "h1" },
      slots: { default: "Heading 1" },
    });

    const element = getByText("Heading 1");
    expect(element.tagName).toBe("H1");
  });

  it('renders the correct default tag when no "variant" prop is provided', () => {
    const { getByText } = render(Typography, {
      slots: { default: "Default Text" },
    });

    const element = getByText("Default Text");
    expect(element.tagName).toBe("P"); // Assuming default is <p>
  });

  it('applies the correct color class based on the "color" prop', () => {
    const { getByText } = render(Typography, {
      props: { color: "primary" },
      slots: { default: "Primary Text" },
    });

    const element = getByText("Primary Text");
    expect(element.classList.contains("text-primary-text")).toBe(true);
  });

  it("renders the slot content correctly", () => {
    const { getByText } = render(Typography, {
      slots: { default: "Custom Content" },
    });

    const element = getByText("Custom Content");
    expect(element).toBeTruthy();
  });
});
