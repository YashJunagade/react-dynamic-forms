/**
 * Returns a clean flat object of { questionKey: value } for all answered questions.
 * Strips undefined values so the result is serializable.
 */
export function flattenValues(values: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
