import type { ComponentType } from "react";
import type { QuestionType } from "../types/question";
import type { QuestionComponentProps } from "../context/FormContext";

export type QuestionRegistry = Partial<Record<string, ComponentType<QuestionComponentProps>>>;

// Built-in question type keys
export const BUILT_IN_TYPES: QuestionType[] = [
  "textbox",
  "textarea",
  "number",
  "checkbox",
  "radio",
  "combo_select",
  "datetime",
  "array",
  "group",
  "config_only",
];
