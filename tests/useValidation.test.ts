import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useValidation, validateQuestion } from "../src/logic/useValidation";
import type { SchemaQuestion } from "../src/types/schema";

function makeQuestion(overrides: Partial<SchemaQuestion>): SchemaQuestion {
  return {
    key: "q",
    type: "textbox",
    label: "Q",
    ...overrides,
  } as SchemaQuestion;
}

// ─── validateQuestion (pure) ──────────────────────────────────────────────────

describe("validateQuestion", () => {
  it("returns isValid: true when no validation rules", () => {
    const q = makeQuestion({ key: "q" });
    expect(validateQuestion(q, "", {})).toEqual({ isValid: true, error: null });
  });

  it("returns error when required and value is empty", () => {
    const q = makeQuestion({ validation: { required: true } });
    const { isValid, error } = validateQuestion(q, "", {});
    expect(isValid).toBe(false);
    expect(error).toBeTruthy();
  });

  it("returns isValid: true when required and value is provided", () => {
    const q = makeQuestion({ validation: { required: true } });
    expect(validateQuestion(q, "hello", {})).toEqual({ isValid: true, error: null });
  });

  it("skips non-required rules when value is empty", () => {
    const q = makeQuestion({ validation: { minLength: 5 } });
    // Empty value, not required → should pass (no error)
    expect(validateQuestion(q, "", {})).toEqual({ isValid: true, error: null });
  });

  it("runs minLength rule when value is non-empty", () => {
    const q = makeQuestion({ validation: { minLength: 5 } });
    const { isValid, error } = validateQuestion(q, "hi", {});
    expect(isValid).toBe(false);
    expect(error).toBeTruthy();
  });

  it("runs custom validator", () => {
    const q = makeQuestion({
      validation: {
        custom: (val) => (val === "forbidden" ? "Not allowed" : null),
      },
    });
    expect(validateQuestion(q, "forbidden", {}).error).toBe("Not allowed");
    expect(validateQuestion(q, "ok", {}).error).toBeNull();
  });

  it("custom validator receives allValues", () => {
    const q = makeQuestion({
      key: "confirm",
      validation: {
        custom: (val, all) =>
          val !== (all as Record<string, unknown>).password ? "Passwords do not match" : null,
      },
    });
    const all = { password: "secret", confirm: "wrong" };
    expect(validateQuestion(q, "wrong", all).error).toBe("Passwords do not match");
    expect(validateQuestion(q, "secret", all).error).toBeNull();
  });

  it("stops at first error (required before minLength)", () => {
    const q = makeQuestion({ validation: { required: true, minLength: 10 } });
    // Empty → required fires first
    const { error } = validateQuestion(q, "", {});
    expect(error).toMatch(/required/i);
  });
});

// ─── useValidation (hook) ─────────────────────────────────────────────────────

describe("useValidation", () => {
  it("returns isValid: true for a form with no validation rules", () => {
    const questions = [makeQuestion({ key: "name" })];
    const visibleKeys = new Set(["name"]);
    const { result } = renderHook(() =>
      useValidation(questions, { name: "" }, visibleKeys)
    );
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it("returns errors for required fields with empty values", () => {
    const questions = [
      makeQuestion({ key: "name", validation: { required: true } }),
      makeQuestion({ key: "email", validation: { required: true } }),
    ];
    const visibleKeys = new Set(["name", "email"]);
    const { result } = renderHook(() =>
      useValidation(questions, { name: "", email: "" }, visibleKeys)
    );
    expect(result.current.isValid).toBe(false);
    expect(result.current.errors["name"]).toBeTruthy();
    expect(result.current.errors["email"]).toBeTruthy();
  });

  it("skips validation for questions not in visibleKeys", () => {
    const questions = [
      makeQuestion({ key: "hidden", validation: { required: true } }),
    ];
    const visibleKeys = new Set<string>(); // hidden not included
    const { result } = renderHook(() =>
      useValidation(questions, { hidden: "" }, visibleKeys)
    );
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors["hidden"]).toBeUndefined();
  });

  it("isValid is true when all visible questions pass", () => {
    const questions = [
      makeQuestion({ key: "name", validation: { required: true } }),
    ];
    const visibleKeys = new Set(["name"]);
    const { result } = renderHook(() =>
      useValidation(questions, { name: "John" }, visibleKeys)
    );
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it("only reports errors for visible questions (hides errors of hidden ones)", () => {
    const questions = [
      makeQuestion({ key: "visible", validation: { required: true } }),
      makeQuestion({ key: "hidden", validation: { required: true } }),
    ];
    const visibleKeys = new Set(["visible"]); // hidden excluded
    const { result } = renderHook(() =>
      useValidation(questions, { visible: "", hidden: "" }, visibleKeys)
    );
    expect(result.current.errors["visible"]).toBeTruthy();
    expect(result.current.errors["hidden"]).toBeUndefined();
  });
});
