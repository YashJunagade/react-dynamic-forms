import { useCallback, useMemo, useReducer } from "react";
import type { FormSchema, SchemaQuestion } from "../types/schema";

// ─── State ────────────────────────────────────────────────────────────────────

export interface FormState {
  values: Record<string, unknown>;
  touched: Set<string>;        // keys the user has interacted with
  showErrors: boolean;         // true after first submit attempt
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_VALUE"; key: string; value: unknown }
  | { type: "SET_TOUCHED"; key: string }
  | { type: "SHOW_ERRORS" }
  | { type: "RESET"; initialValues: Record<string, unknown> };

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        values: { ...state.values, [action.key]: action.value },
      };

    case "SET_TOUCHED": {
      const touched = new Set(state.touched);
      touched.add(action.key);
      return { ...state, touched };
    }

    case "SHOW_ERRORS":
      return { ...state, showErrors: true };

    case "RESET":
      return {
        values: action.initialValues,
        touched: new Set(),
        showErrors: false,
      };

    default:
      return state;
  }
}

// ─── Default value extractor ──────────────────────────────────────────────────

function extractDefaults(questions: SchemaQuestion[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  const walk = (qs: SchemaQuestion[]) => {
    for (const q of qs) {
      if (q.defaultValue !== undefined) {
        defaults[q.key] = q.defaultValue;
      }
      if (q.type === "group" && "questions" in q) {
        walk(q.questions as SchemaQuestion[]);
      }
    }
  };

  walk(questions);
  return defaults;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFormState(schema: FormSchema) {
  const initialValues = useMemo(
    () => extractDefaults(schema.questions as SchemaQuestion[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schema.id]  // only recompute when schema identity changes
  );

  const [state, dispatch] = useReducer(reducer, {
    values: initialValues,
    touched: new Set<string>(),
    showErrors: false,
  });

  const setValue = useCallback((key: string, value: unknown) => {
    dispatch({ type: "SET_VALUE", key, value });
  }, []);

  const setTouched = useCallback((key: string) => {
    dispatch({ type: "SET_TOUCHED", key });
  }, []);

  const showErrors = useCallback(() => {
    dispatch({ type: "SHOW_ERRORS" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET", initialValues });
  }, [initialValues]);

  return { state, setValue, setTouched, showErrors, reset };
}
