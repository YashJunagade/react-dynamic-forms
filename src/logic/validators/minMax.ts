export function validateMinLength(value: unknown, min: number): string | null {
  if (typeof value !== "string") return null;
  if (value.length < min) return `Must be at least ${min} characters`;
  return null;
}

export function validateMaxLength(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  if (value.length > max) return `Must be no more than ${max} characters`;
  return null;
}

export function validateMin(value: unknown, min: number): string | null {
  if (typeof value !== "number") return null;
  if (value < min) return `Must be at least ${min}`;
  return null;
}

export function validateMax(value: unknown, max: number): string | null {
  if (typeof value !== "number") return null;
  if (value > max) return `Must be no more than ${max}`;
  return null;
}

export function validateMinSelected(value: unknown, min: number): string | null {
  if (!Array.isArray(value)) return null;
  if (value.length < min) return `Select at least ${min} option${min > 1 ? "s" : ""}`;
  return null;
}

export function validateMaxSelected(value: unknown, max: number): string | null {
  if (!Array.isArray(value)) return null;
  if (value.length > max) return `Select no more than ${max} option${max > 1 ? "s" : ""}`;
  return null;
}

export function validateMinItems(value: unknown, min: number): string | null {
  if (!Array.isArray(value)) return null;
  if (value.length < min) return `Add at least ${min} item${min > 1 ? "s" : ""}`;
  return null;
}

export function validateMaxItems(value: unknown, max: number): string | null {
  if (!Array.isArray(value)) return null;
  if (value.length > max) return `Maximum ${max} item${max > 1 ? "s" : ""} allowed`;
  return null;
}
