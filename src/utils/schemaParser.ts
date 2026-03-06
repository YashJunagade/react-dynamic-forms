import type { FormSchema, SchemaQuestion } from "../types/schema";

/**
 * Walks the schema recursively and returns a flat list of all questions
 * (including those nested inside groups). Used to run validation and
 * conditional logic across all questions at once.
 */
export function flattenQuestions(questions: SchemaQuestion[]): SchemaQuestion[] {
  const result: SchemaQuestion[] = [];

  for (const q of questions) {
    result.push(q);
    if (q.type === "group" && "questions" in q) {
      result.push(...flattenQuestions(q.questions as SchemaQuestion[]));
    }
  }

  return result;
}

/**
 * Basic schema validation — throws if the schema is missing required fields.
 */
export function parseSchema(schema: unknown): FormSchema {
  if (!schema || typeof schema !== "object") {
    throw new Error("[react-dynamic-forms] schema must be an object");
  }

  const s = schema as Record<string, unknown>;

  if (!s["id"] || typeof s["id"] !== "string") {
    throw new Error("[react-dynamic-forms] schema.id must be a non-empty string");
  }

  if (!Array.isArray(s["questions"])) {
    throw new Error("[react-dynamic-forms] schema.questions must be an array");
  }

  return schema as FormSchema;
}
