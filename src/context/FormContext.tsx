import { createContext, useContext } from "react";
import type { SchemaQuestion } from "../types/schema";
import type { FormTheme } from "../types/theme";
import type { QuestionRegistry } from "../logic/questionResolver";

export interface QuestionComponentProps {
  question: SchemaQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error: string | null;
  disabled: boolean;
  readOnly: boolean;
}

export interface FormContextValue {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Set<string>;
  showErrors: boolean;
  visibleKeys: Set<string>;
  disabledKeys: Set<string>;
  setValue: (key: string, value: unknown) => void;
  setTouched: (key: string) => void;
  theme: FormTheme;
  readOnly: boolean;
  customQuestions: QuestionRegistry;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext must be used inside <FormRenderer>");
  }
  return ctx;
}
