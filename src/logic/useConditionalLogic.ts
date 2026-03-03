import { useMemo } from "react";
import type {
  Condition,
  SingleCondition,
  ConditionOperator,
} from "../types/condition";
import type { SchemaQuestion } from "../types/schema";

function evaluateSingleCondition(
  condition: SingleCondition,
  values: Record<string, unknown>,
): boolean {
  const { when, operator, value: expected } = condition;
  const actual = values[when];

  switch (operator as ConditionOperator) {
    case "equals":
      return actual === expected;

    case "not_equals":
      return actual !== expected;

    case "contains":
      return typeof actual === "string" && actual.includes(String(expected));

    case "not_contains":
      return typeof actual === "string" && !actual.includes(String(expected));

    case "greater_than":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual > expected
      );

    case "less_than":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual < expected
      );

    case "is_empty":
      return (
        actual === null ||
        actual === undefined ||
        actual === "" ||
        (Array.isArray(actual) && actual.length === 0)
      );

    case "is_not_empty":
      return !(
        actual === null ||
        actual === undefined ||
        actual === "" ||
        (Array.isArray(actual) && actual.length === 0)
      );

    case "includes":
      return Array.isArray(actual) && actual.includes(expected);

    case "not_includes":
      return Array.isArray(actual) && !actual.includes(expected);

    default:
      return false;
  }
}

function evaluateCondition(
  condition: Condition,
  values: Record<string, unknown>,
): boolean {
  if ("and" in condition) {
    return condition.and.every((c) => evaluateSingleCondition(c, values));
  }
  if ("or" in condition) {
    return condition.or.some((c) => evaluateSingleCondition(c, values));
  }
  // Single condition shorthand
  return evaluateSingleCondition(condition as SingleCondition, values);
}

export function useConditionalLogic(
  questions: SchemaQuestion[],
  values: Record<string, unknown>,
): { visibleKeys: Set<string>; disabledKeys: Set<string> } {
  return useMemo(() => {
    const visibleKeys = new Set<string>();
    const disabledKeys = new Set<string>();

    const process = (qs: SchemaQuestion[]) => {
      for (const q of qs) {
        if (q.condition) {
          const passes = evaluateCondition(q.condition, values);
          if (!passes) {
            const behavior = q.conditionBehavior ?? "hide";
            if (behavior === "disable") {
              visibleKeys.add(q.key);
              disabledKeys.add(q.key);
            }
            // if "hide": don't add to visibleKeys — question is hidden
          } else {
            visibleKeys.add(q.key);
          }
        } else {
          // No condition — always visible
          visibleKeys.add(q.key);
        }

        // Recurse into group children (they get their own condition checks)
        if (q.type === "group" && "questions" in q) {
          process(q.questions as SchemaQuestion[]);
        }
      }
    };

    process(questions);

    return { visibleKeys, disabledKeys };
  }, [questions, values]);
}
