import type { Condition, ConditionBehavior } from "./condition";
import type { ValidationRules } from "./validation";
import type { QuestionUIConfig } from "./uiConfig";

export type QuestionType =
  | "textbox"
  | "textarea"
  | "number"
  | "checkbox"
  | "radio"
  | "combo_select"
  | "datetime"
  | "array"
  | "group"
  | "list_select"
  | "multi_string"
  | "file_upload"
  | "google_map"
  | "config_only"
  | "custom";

export interface SelectOption {
  label: string;
  value: string;
}

export interface QuestionOptionStyles {
  /** The outer wrapper of each option row (label element) */
  option?: React.CSSProperties;
  /** The text label inside each option */
  optionLabel?: React.CSSProperties;
  /** The actual checkbox / radio input element */
  optionInput?: React.CSSProperties;
  /** Description text below an option */
  optionDescription?: React.CSSProperties;
}

export interface QuestionDropdownStyles {
  /** The <select> element itself */
  select?: React.CSSProperties;
  /** Each <option> element (limited browser support) */
  option?: React.CSSProperties;
  /** The dropdown wrapper div */
  wrapper?: React.CSSProperties;
}

export interface QuestionStyles {
  /** Outermost question wrapper div */
  container?: React.CSSProperties;
  /** The <label> above the input */
  label?: React.CSSProperties;
  /** Description / help text */
  description?: React.CSSProperties;
  /** Error message */
  error?: React.CSSProperties;
  /** The primary input element (input / textarea / select / group div) */
  input?: React.CSSProperties;
  /** Wrapper div around input + prefix + suffix */
  inputWrapper?: React.CSSProperties;
  /** Prefix span (textbox / number) */
  prefix?: React.CSSProperties;
  /** Suffix span (textbox / number) */
  suffix?: React.CSSProperties;
  /** Per-option styles for checkbox / radio */
  options?: QuestionOptionStyles;
  /** Dropdown-specific styles for combo_select */
  dropdown?: QuestionDropdownStyles;
  /** "Add item" button in array questions */
  addButton?: React.CSSProperties;
  /** "Remove item" button in array questions */
  removeButton?: React.CSSProperties;
}

/**
 * Every question type shares these fields.
 * Validation and conditional logic live here so they're accessible
 * without narrowing the discriminated union.
 */
export interface BaseQuestion {
  key: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  disabled?: boolean;
  hidden?: boolean;
  customStyles?: QuestionStyles;
  uiConfig?: QuestionUIConfig;
  // Schema-level additions (on every question)
  validation?: ValidationRules;
  condition?: Condition;
  conditionBehavior?: ConditionBehavior;
}

export interface TextBoxQuestion extends BaseQuestion {
  type: "textbox";
  prefix?: string;
  suffix?: string;
  defaultValue?: string;
}

export interface TextAreaQuestion extends BaseQuestion {
  type: "textarea";
  minRows?: number;
  maxRows?: number;
  defaultValue?: string;
}

export interface NumberQuestion extends BaseQuestion {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  defaultValue?: number;
}

export interface CheckboxQuestion extends BaseQuestion {
  type: "checkbox";
  options: SelectOption[];
  layout?: "vertical" | "horizontal" | "grid";
  defaultValue?: string[];
}

export interface RadioQuestion extends BaseQuestion {
  type: "radio";
  options: SelectOption[];
  layout?: "vertical" | "horizontal";
  defaultValue?: string;
}

export interface ComboSelectQuestion extends BaseQuestion {
  type: "combo_select";
  options: SelectOption[];
  searchable?: boolean;
  clearable?: boolean;
  defaultValue?: string;
}

export interface DateTimeQuestion extends BaseQuestion {
  type: "datetime";
  mode?: "date" | "time" | "datetime";
  minDate?: string;
  maxDate?: string;
  defaultValue?: string;
}

export interface ArrayQuestion extends BaseQuestion {
  type: "array";
  itemLabel?: string;
  minItems?: number;
  maxItems?: number;
  defaultValue?: string[];
}

export interface GroupQuestion extends BaseQuestion {
  type: "group";
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  questions: AnyQuestion[];
}

export interface ListSelectQuestion extends BaseQuestion {
  type: "list_select";
  options: SelectOption[];
  /** Allow filtering options by typing. @default false */
  searchable?: boolean;
  /** Max height (px) of the scrollable options container. @default 200 */
  maxHeight?: number;
  defaultValue?: string[];
}

export interface MultiStringField {
  key: string;
  label: string;
  placeholder?: string;
}

export interface MultiStringQuestion extends BaseQuestion {
  type: "multi_string";
  /** Each field definition rendered as a labelled input row */
  fields: MultiStringField[];
  defaultValue?: Record<string, string>;
}

export interface FileUploadQuestion extends BaseQuestion {
  type: "file_upload";
  /** Accepted MIME types or extensions e.g. "image/*,.pdf" */
  accept?: string;
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Allow selecting multiple files. @default false */
  multiple?: boolean;
  defaultValue?: string;
}

export interface ConfigOnlyQuestion extends BaseQuestion {
  type: "config_only";
  content?: string;
}

export interface CustomQuestion extends BaseQuestion {
  type: "custom";
  customType: string;
  [key: string]: unknown;
}

export type AnyQuestion =
  | TextBoxQuestion
  | TextAreaQuestion
  | NumberQuestion
  | CheckboxQuestion
  | RadioQuestion
  | ComboSelectQuestion
  | DateTimeQuestion
  | ArrayQuestion
  | GroupQuestion
  | ListSelectQuestion
  | MultiStringQuestion
  | FileUploadQuestion
  | ConfigOnlyQuestion
  | CustomQuestion;

// Needed for JSX in QuestionStyles
import type React from "react";
