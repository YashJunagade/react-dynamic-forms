import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormRenderer } from "../src";
import type { FormSchema } from "../src";
import "../src/styles.css";

const basicSchema: FormSchema = {
  id: "test-form",
  title: "Test Form",
  description: "A test form",
  questions: [
    {
      key: "name",
      type: "textbox",
      label: "Full Name",
      placeholder: "Enter name",
      validation: { required: true, minLength: 2 },
    },
    {
      key: "age",
      type: "number",
      label: "Age",
      validation: { required: true, min: 18 },
    },
  ],
};

// ─── Rendering ────────────────────────────────────────────────────────────────

describe("FormRenderer — rendering", () => {
  it("renders the form title", () => {
    render(<FormRenderer schema={basicSchema} />);
    expect(screen.getByText("Test Form")).toBeInTheDocument();
  });

  it("renders the form description", () => {
    render(<FormRenderer schema={basicSchema} />);
    expect(screen.getByText("A test form")).toBeInTheDocument();
  });

  it("renders all question labels", () => {
    render(<FormRenderer schema={basicSchema} />);
    expect(screen.getByText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByText(/Age/)).toBeInTheDocument();
  });

  it("renders required asterisk on required fields", () => {
    render(<FormRenderer schema={basicSchema} />);
    const required = document.querySelectorAll(".rdf-required");
    expect(required.length).toBe(2);
  });

  it("renders a submit button", () => {
    render(<FormRenderer schema={basicSchema} />);
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("does not render reset button by default", () => {
    render(<FormRenderer schema={basicSchema} />);
    expect(screen.queryByRole("button", { name: /reset/i })).toBeNull();
  });

  it("renders reset button when showReset is true", () => {
    render(<FormRenderer schema={basicSchema} showReset />);
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("uses custom submitLabel", () => {
    render(<FormRenderer schema={basicSchema} submitLabel="Send" />);
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
});

// ─── User interaction ─────────────────────────────────────────────────────────

describe("FormRenderer — user interaction", () => {
  it("updates input value when user types", async () => {
    render(<FormRenderer schema={basicSchema} />);
    const input = screen.getByPlaceholderText("Enter name");
    await userEvent.type(input, "Jane");
    expect((input as HTMLInputElement).value).toBe("Jane");
  });

  it("calls onChange with key, value, and allValues", async () => {
    const onChange = vi.fn();
    render(<FormRenderer schema={basicSchema} onChange={onChange} />);
    const input = screen.getByPlaceholderText("Enter name");
    await userEvent.type(input, "J");
    expect(onChange).toHaveBeenCalledWith("name", "J", expect.objectContaining({ name: "J" }));
  });
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe("FormRenderer — validation", () => {
  it("shows required error after submit with empty fields", async () => {
    render(<FormRenderer schema={basicSchema} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      const errors = document.querySelectorAll(".rdf-question__error");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it("does not call onSubmit when form is invalid", async () => {
    const onSubmit = vi.fn();
    render(<FormRenderer schema={basicSchema} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("calls onSubmit with values when form is valid", async () => {
    const onSubmit = vi.fn();
    render(<FormRenderer schema={basicSchema} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByPlaceholderText("Enter name"), "Jane Doe");
    const ageInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, "25");

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Jane Doe", age: 25 })
      );
    });
  });

  it("shows inline error after field is blurred with invalid value", async () => {
    render(<FormRenderer schema={basicSchema} />);
    const input = screen.getByPlaceholderText("Enter name");
    await userEvent.type(input, "J");
    fireEvent.blur(input);
    await waitFor(() => {
      expect(document.querySelector(".rdf-question--error")).toBeInTheDocument();
    });
  });
});

// ─── Read-only mode ───────────────────────────────────────────────────────────

describe("FormRenderer — readOnly", () => {
  it("does not render submit button in readOnly mode", () => {
    render(<FormRenderer schema={basicSchema} readOnly />);
    expect(screen.queryByRole("button", { name: /submit/i })).toBeNull();
  });

  it("renders inputs as readOnly", () => {
    render(<FormRenderer schema={basicSchema} readOnly />);
    const input = screen.getByPlaceholderText("Enter name");
    expect(input).toHaveAttribute("readonly");
  });
});

// ─── Conditional visibility ───────────────────────────────────────────────────

describe("FormRenderer — conditional logic", () => {
  const conditionalSchema: FormSchema = {
    id: "cond-form",
    questions: [
      { key: "show_extra", type: "radio", label: "Show extra?", options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ]},
      {
        key: "extra",
        type: "textbox",
        label: "Extra Field",
        condition: { when: "show_extra", operator: "equals", value: "yes" },
      },
    ],
  };

  it("hides dependent question initially", () => {
    render(<FormRenderer schema={conditionalSchema} />);
    expect(screen.queryByText("Extra Field")).toBeNull();
  });

  it("shows dependent question when condition is met", async () => {
    render(<FormRenderer schema={conditionalSchema} />);
    const yesRadio = screen.getByLabelText("Yes");
    await userEvent.click(yesRadio);
    await waitFor(() => {
      expect(screen.getByText("Extra Field")).toBeInTheDocument();
    });
  });
});

// ─── Reset ────────────────────────────────────────────────────────────────────

describe("FormRenderer — reset", () => {
  it("clears values when reset is clicked", async () => {
    render(<FormRenderer schema={basicSchema} showReset />);
    const input = screen.getByPlaceholderText("Enter name");
    await userEvent.type(input, "Jane");
    expect((input as HTMLInputElement).value).toBe("Jane");

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });
});
