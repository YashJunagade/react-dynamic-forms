import { useMemo } from "react";
import type { SchemaQuestion } from "../types/schema";
import type { ValidationRules, QuestionValidationResult } from "../types/validation";
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
} from "./validators";

function runRules(
  value: unknown,
  rules: ValidationRules,
  allValues: Record<string, unknown>
): string | null {
  if (rules.required) {
    const err = validateRequired(value);
    if (err) return err;
  }

  // Skip remaining checks if value is empty and not required
  const isEmpty =
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) return null;

  if (rules.minLength !== undefined) {
    const err = validateMinLength(value, rules.minLength);
    if (err) return err;
  }
  if (rules.maxLength !== undefined) {
    const err = validateMaxLength(value, rules.maxLength);
    if (err) return err;
  }
  if (rules.min !== undefined) {
    const err = validateMin(value, rules.min);
    if (err) return err;
  }
  if (rules.max !== undefined) {
    const err = validateMax(value, rules.max);
    if (err) return err;
  }
  if (rules.minSelected !== undefined) {
    const err = validateMinSelected(value, rules.minSelected);
    if (err) return err;
  }
  if (rules.maxSelected !== undefined) {
    const err = validateMaxSelected(value, rules.maxSelected);
    if (err) return err;
  }
  if (rules.minItems !== undefined) {
    const err = validateMinItems(value, rules.minItems);
    if (err) return err;
  }
  if (rules.maxItems !== undefined) {
    const err = validateMaxItems(value, rules.maxItems);
    if (err) return err;
  }
  if (rules.pattern) {
    const err = validatePattern(value, rules.pattern);
    if (err) return err;
  }

  // Custom validators
  if (rules.custom) {
    const validators = Array.isArray(rules.custom) ? rules.custom : [rules.custom];
    for (const validator of validators) {
      const err = validator(value, allValues);
      if (err) return err;
    }
  }

  return null;
}

export function validateQuestion(
  question: SchemaQuestion,
  value: unknown,
  allValues: Record<string, unknown>
): QuestionValidationResult {
  if (!question.validation) return { isValid: true, error: null };
  const error = runRules(value, question.validation, allValues);
  return { isValid: error === null, error };
}

export function useValidation(
  questions: SchemaQuestion[],
  values: Record<string, unknown>,
  visibleKeys: Set<string>
) {
  const errors = useMemo<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    for (const q of questions) {
      if (!visibleKeys.has(q.key)) continue;
      if (!q.validation) continue;
      const { error } = validateQuestion(q, values[q.key], values);
      if (error) result[q.key] = error;
    }
    return result;
  }, [questions, values, visibleKeys]);

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid };
}
