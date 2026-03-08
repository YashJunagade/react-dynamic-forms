import { describe, it, expect } from "vitest";
import {
  validateRequired,
  validatePattern,
  validateMinLength,
  validateMaxLength,
  validateMin,
  validateMax,
  validateMinSelected,
  validateMaxSelected,
  validateMinItems,
  validateMaxItems,
} from "../src/logic/validators";

// ─── validateRequired ─────────────────────────────────────────────────────────

describe("validateRequired", () => {
  it("returns error for null", () => {
    expect(validateRequired(null)).toBe("This field is required");
  });
  it("returns error for undefined", () => {
    expect(validateRequired(undefined)).toBe("This field is required");
  });
  it("returns error for empty string", () => {
    expect(validateRequired("")).toBe("This field is required");
  });
  it("returns error for whitespace-only string", () => {
    expect(validateRequired("   ")).toBe("This field is required");
  });
  it("returns error for empty array", () => {
    expect(validateRequired([])).toBe("This field is required");
  });
  it("returns null for a non-empty string", () => {
    expect(validateRequired("hello")).toBeNull();
  });
  it("returns null for a number", () => {
    expect(validateRequired(0)).toBeNull();
  });
  it("returns null for a non-empty array", () => {
    expect(validateRequired(["a"])).toBeNull();
  });
});

// ─── validateMinLength ────────────────────────────────────────────────────────

describe("validateMinLength", () => {
  it("returns null for non-string values", () => {
    expect(validateMinLength(42, 3)).toBeNull();
    expect(validateMinLength(null, 3)).toBeNull();
  });
  it("returns error when string is too short", () => {
    expect(validateMinLength("ab", 3)).toBe("Must be at least 3 characters");
  });
  it("returns null when string meets minimum", () => {
    expect(validateMinLength("abc", 3)).toBeNull();
    expect(validateMinLength("abcd", 3)).toBeNull();
  });
});

// ─── validateMaxLength ────────────────────────────────────────────────────────

describe("validateMaxLength", () => {
  it("returns null for non-string values", () => {
    expect(validateMaxLength(42, 5)).toBeNull();
  });
  it("returns error when string exceeds max", () => {
    expect(validateMaxLength("abcdef", 5)).toBe("Must be no more than 5 characters");
  });
  it("returns null when string is within max", () => {
    expect(validateMaxLength("abc", 5)).toBeNull();
    expect(validateMaxLength("abcde", 5)).toBeNull();
  });
});

// ─── validateMin ──────────────────────────────────────────────────────────────

describe("validateMin", () => {
  it("returns null for non-number values", () => {
    expect(validateMin("5", 3)).toBeNull();
    expect(validateMin(null, 3)).toBeNull();
  });
  it("returns error when number is below minimum", () => {
    expect(validateMin(2, 3)).toBe("Must be at least 3");
  });
  it("returns null when number meets minimum", () => {
    expect(validateMin(3, 3)).toBeNull();
    expect(validateMin(10, 3)).toBeNull();
  });
});

// ─── validateMax ──────────────────────────────────────────────────────────────

describe("validateMax", () => {
  it("returns null for non-number values", () => {
    expect(validateMax("5", 10)).toBeNull();
  });
  it("returns error when number exceeds maximum", () => {
    expect(validateMax(11, 10)).toBe("Must be no more than 10");
  });
  it("returns null when number is within maximum", () => {
    expect(validateMax(10, 10)).toBeNull();
    expect(validateMax(5, 10)).toBeNull();
  });
});

// ─── validateMinSelected ──────────────────────────────────────────────────────

describe("validateMinSelected", () => {
  it("returns null for non-array values", () => {
    expect(validateMinSelected("a", 2)).toBeNull();
  });
  it("returns error when selection is below minimum", () => {
    expect(validateMinSelected(["a"], 2)).toBe("Select at least 2 options");
    expect(validateMinSelected([], 1)).toBe("Select at least 1 option");
  });
  it("returns null when selection meets minimum", () => {
    expect(validateMinSelected(["a", "b"], 2)).toBeNull();
  });
});

// ─── validateMaxSelected ──────────────────────────────────────────────────────

describe("validateMaxSelected", () => {
  it("returns null for non-array values", () => {
    expect(validateMaxSelected("a", 2)).toBeNull();
  });
  it("returns error when selection exceeds maximum", () => {
    expect(validateMaxSelected(["a", "b", "c"], 2)).toBe("Select no more than 2 options");
  });
  it("returns null when selection is within maximum", () => {
    expect(validateMaxSelected(["a", "b"], 2)).toBeNull();
    expect(validateMaxSelected(["a"], 2)).toBeNull();
  });
});

// ─── validateMinItems ─────────────────────────────────────────────────────────

describe("validateMinItems", () => {
  it("returns null for non-array values", () => {
    expect(validateMinItems("a", 2)).toBeNull();
  });
  it("returns error when items are below minimum", () => {
    expect(validateMinItems(["a"], 2)).toBe("Add at least 2 items");
    expect(validateMinItems([], 1)).toBe("Add at least 1 item");
  });
  it("returns null when items meet minimum", () => {
    expect(validateMinItems(["a", "b"], 2)).toBeNull();
  });
});

// ─── validateMaxItems ─────────────────────────────────────────────────────────

describe("validateMaxItems", () => {
  it("returns null for non-array values", () => {
    expect(validateMaxItems("a", 2)).toBeNull();
  });
  it("returns error when items exceed maximum", () => {
    expect(validateMaxItems(["a", "b", "c"], 2)).toBe("Maximum 2 items allowed");
  });
  it("returns null when items are within maximum", () => {
    expect(validateMaxItems(["a", "b"], 2)).toBeNull();
  });
});

// ─── validatePattern ──────────────────────────────────────────────────────────

describe("validatePattern", () => {
  it("returns null for empty values", () => {
    expect(validatePattern("", "^\\d+$")).toBeNull();
    expect(validatePattern(null, "^\\d+$")).toBeNull();
    expect(validatePattern(undefined, "^\\d+$")).toBeNull();
  });
  it("returns error when value does not match pattern", () => {
    expect(validatePattern("abc", "^\\d+$")).toBe("Value does not match the required format");
  });
  it("returns null when value matches pattern", () => {
    expect(validatePattern("123", "^\\d+$")).toBeNull();
  });
  it("validates email pattern", () => {
    const emailPattern = "^[^@]+@[^@]+\\.[^@]+$";
    expect(validatePattern("not-an-email", emailPattern)).not.toBeNull();
    expect(validatePattern("user@example.com", emailPattern)).toBeNull();
  });
});
