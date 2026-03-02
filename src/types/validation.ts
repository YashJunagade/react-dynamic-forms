export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;       // regex string
  minSelected?: number;   // for checkbox
  maxSelected?: number;   // for checkbox
  minItems?: number;      // for array
  maxItems?: number;      // for array
  custom?: CustomValidator | CustomValidator[];
}

export type CustomValidator = (
  value: unknown,
  allValues: Record<string, unknown>
) => string | null;    // return error string or null if valid

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;  // questionKey → error message
}

export interface QuestionValidationResult {
  isValid: boolean;
  error: string | null;
}
