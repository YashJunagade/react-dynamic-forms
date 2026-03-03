export function validatePattern(value: unknown, pattern: string): string | null {
  if (value === null || value === undefined || value === "") return null;
  const regex = new RegExp(pattern);
  if (!regex.test(String(value))) return "Value does not match the required format";
  return null;
}
