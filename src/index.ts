// Main component
export { FormRenderer } from "./core/FormRenderer";
export type { FormRendererProps } from "./core/FormRenderer";

// Context (for advanced usage / custom question types)
export { useFormContext } from "./context/FormContext";
export type { QuestionComponentProps, FormContextValue } from "./context/FormContext";

// Types — schema
export type { FormSchema, SchemaQuestion } from "./types/schema";

// Types — questions
export type {
  QuestionType,
  SelectOption,
  AnyQuestion,
  BaseQuestion,
  TextBoxQuestion,
  TextAreaQuestion,
  NumberQuestion,
  CheckboxQuestion,
  RadioQuestion,
  ComboSelectQuestion,
  DateTimeQuestion,
  ArrayQuestion,
  GroupQuestion,
  ConfigOnlyQuestion,
  CustomQuestion,
  QuestionStyles,
  QuestionOptionStyles,
  QuestionDropdownStyles,
  ListSelectQuestion,
  MultiStringQuestion,
  MultiStringField,
  FileUploadQuestion,
} from "./types/question";

// Types — conditions
export type {
  Condition,
  SingleCondition,
  AndCondition,
  OrCondition,
  ConditionOperator,
  ConditionBehavior,
} from "./types/condition";

// Types — validation
export type {
  ValidationRules,
  CustomValidator,
  ValidationResult,
  QuestionValidationResult,
} from "./types/validation";

// Types — UI config
export type { QuestionUIConfig } from "./types/uiConfig";

// Types — theme
export type { FormTheme } from "./types/theme";

// Hooks (for advanced usage, e.g. headless mode)
export { useFormState } from "./logic/useFormState";
export { useConditionalLogic } from "./logic/useConditionalLogic";
export { useValidation, validateQuestion } from "./logic/useValidation";

// Utils
export { flattenValues } from "./utils/flattenValues";
export { flattenQuestions, parseSchema } from "./utils/schemaParser";

// Individual validators (for custom validation composition)
export {
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
} from "./logic/validators";
