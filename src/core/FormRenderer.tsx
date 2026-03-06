import { useMemo } from "react";
import { FormContext } from "../context/FormContext";
import type { QuestionRegistry } from "../logic/questionResolver";
import type { FormSchema, SchemaQuestion } from "../types/schema";
import type { FormTheme } from "../types/theme";
import { useFormState } from "../logic/useFormState";
import { useConditionalLogic } from "../logic/useConditionalLogic";
import { useValidation } from "../logic/useValidation";
import { flattenQuestions, parseSchema } from "../utils/schemaParser";
import { flattenValues } from "../utils/flattenValues";
import { QuestionRenderer } from "./QuestionRenderer";
import { applyTheme } from "../utils/theme";

export interface FormRendererProps {
  schema: FormSchema;
  onSubmit?: (values: Record<string, unknown>) => void;
  onChange?: (key: string, value: unknown, allValues: Record<string, unknown>) => void;
  theme?: FormTheme;
  readOnly?: boolean;
  customQuestions?: QuestionRegistry;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
}

export function FormRenderer({
  schema,
  onSubmit,
  onChange,
  theme = {},
  readOnly = false,
  customQuestions = {},
  submitLabel,
  resetLabel,
  showReset = false,
  className,
}: FormRendererProps) {
  // Validate schema at render time (throws early on bad input)
  const validSchema = useMemo(() => parseSchema(schema), [schema]);

  const { state, setValue, setTouched, showErrors: triggerShowErrors, reset } = useFormState(validSchema);

  // Intercept setValue to fire onChange prop
  const handleSetValue = useMemo(
    () => (key: string, value: unknown) => {
      setValue(key, value);
      if (onChange) {
        const next = { ...state.values, [key]: value };
        onChange(key, value, flattenValues(next));
      }
    },
    [setValue, onChange, state.values]
  );

  // Flat list of all questions for logic/validation hooks
  const allQuestions = useMemo(
    () => flattenQuestions(validSchema.questions as SchemaQuestion[]),
    [validSchema]
  );

  const { visibleKeys, disabledKeys } = useConditionalLogic(
    validSchema.questions as SchemaQuestion[],
    state.values
  );

  const { errors, isValid } = useValidation(allQuestions, state.values, visibleKeys);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    triggerShowErrors();
    if (!isValid) return;
    onSubmit?.(flattenValues(state.values));
  }

  // Apply CSS variable theme to the form element
  const themeVars = useMemo(() => applyTheme(theme), [theme]);

  return (
    <FormContext.Provider
      value={{
        values: state.values,
        errors,
        touched: state.touched,
        showErrors: state.showErrors,
        visibleKeys,
        disabledKeys,
        setValue: handleSetValue,
        setTouched,
        theme,
        readOnly,
        customQuestions,
      }}
    >
      <form
        className={`rdf-form ${className ?? ""}`}
        onSubmit={handleSubmit}
        noValidate
        style={themeVars as React.CSSProperties}
      >
        {validSchema.title && <h2 className="rdf-form__title">{validSchema.title}</h2>}
        {validSchema.description && (
          <p className="rdf-form__description">{validSchema.description}</p>
        )}

        <div className="rdf-form__body">
          {validSchema.questions.map((q) => (
            <QuestionRenderer key={q.key} question={q as SchemaQuestion} />
          ))}
        </div>

        {!readOnly && (
          <div className="rdf-form__actions">
            {showReset && (
              <button type="button" className="rdf-btn rdf-btn--reset" onClick={reset}>
                {resetLabel ?? schema.resetLabel ?? "Reset"}
              </button>
            )}
            <button type="submit" className="rdf-btn rdf-btn--submit">
              {submitLabel ?? schema.submitLabel ?? "Submit"}
            </button>
          </div>
        )}
      </form>
    </FormContext.Provider>
  );
}
