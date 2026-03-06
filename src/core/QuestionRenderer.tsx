import type { ComponentType } from "react";
import { useFormContext, type QuestionComponentProps } from "../context/FormContext";
import type { SchemaQuestion } from "../types/schema";
import {
  TextBoxQuestion,
  TextAreaQuestion,
  NumberQuestion,
  CheckboxQuestion,
  RadioQuestion,
  ComboSelectQuestion,
  DateTimeQuestion,
  ArrayQuestion,
  ConfigOnlyQuestion,
  ListSelectQuestion,
  MultiStringQuestion,
  FileUploadQuestion,
} from "../questions";
import { GroupRenderer } from "./GroupRenderer";

// ─── Built-in registry ────────────────────────────────────────────────────────

const BUILT_IN_REGISTRY: Record<string, ComponentType<QuestionComponentProps>> = {
  textbox: TextBoxQuestion,
  textarea: TextAreaQuestion,
  number: NumberQuestion,
  checkbox: CheckboxQuestion,
  radio: RadioQuestion,
  combo_select: ComboSelectQuestion,
  datetime: DateTimeQuestion,
  array: ArrayQuestion,
  config_only: ConfigOnlyQuestion,
  list_select: ListSelectQuestion,
  multi_string: MultiStringQuestion,
  file_upload: FileUploadQuestion,
};

// ─── Question shell (label + error) ──────────────────────────────────────────

interface QuestionShellProps {
  question: SchemaQuestion;
  error: string | null;
  showError: boolean;
  children: React.ReactNode;
}

function QuestionShell({ question, error, showError, children }: QuestionShellProps) {
  const hasError = showError && !!error;

  return (
    <div
      className={`rdf-question ${hasError ? "rdf-question--error" : ""}`}
      style={question.customStyles?.container}
    >
      {question.type !== "config_only" && (
        <label className="rdf-question__label" style={question.customStyles?.label}>
          {question.label}
          {question.validation?.required && (
            <span className="rdf-required" aria-hidden="true"> *</span>
          )}
        </label>
      )}
      {question.description && (
        <p className="rdf-question__description" style={question.customStyles?.description}>
          {question.description}
        </p>
      )}
      {question.uiConfig?.warning && (
        <div className="rdf-warning" role="alert">
          {question.uiConfig.warning.showAlertIcon && (
            <span className="rdf-warning__icon" aria-hidden="true">⚠</span>
          )}
          <div className="rdf-warning__body">
            <p className="rdf-warning__message">{question.uiConfig.warning.message}</p>
            {question.uiConfig.warning.subMessage && (
              <p className="rdf-warning__sub">{question.uiConfig.warning.subMessage}</p>
            )}
          </div>
        </div>
      )}
      <div className="rdf-question__input">
        {children}
      </div>
      {hasError && (
        <p className="rdf-question__error" role="alert" style={question.customStyles?.error}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main renderer ────────────────────────────────────────────────────────────

interface QuestionRendererProps {
  question: SchemaQuestion;
}

export function QuestionRenderer({ question }: QuestionRendererProps) {
  const { values, errors, touched, showErrors, visibleKeys, disabledKeys, setValue, setTouched, customQuestions, readOnly } =
    useFormContext();

  // Hidden — render nothing
  if (!visibleKeys.has(question.key)) return null;

  // Groups are handled by GroupRenderer (no shell wrapping)
  if (question.type === "group") {
    return <GroupRenderer question={question} />;
  }

  const isDisabled = disabledKeys.has(question.key) || question.disabled === true;
  const error = errors[question.key] ?? null;
  const showError = showErrors || touched.has(question.key);

  // Resolve component: custom registry > built-in
  const Component: ComponentType<QuestionComponentProps> | undefined =
    question.type === "custom"
      ? customQuestions[question.customType as string]
      : (customQuestions[question.type] ?? BUILT_IN_REGISTRY[question.type]);

  if (!Component) {
    console.warn(`[react-dynamic-forms] Unknown question type: "${question.type}"`);
    return null;
  }

  return (
    <QuestionShell question={question} error={error} showError={showError}>
      <Component
        question={question}
        value={values[question.key]}
        onChange={(val) => setValue(question.key, val)}
        onBlur={() => setTouched(question.key)}
        error={error}
        disabled={isDisabled}
        readOnly={readOnly}
      />
    </QuestionShell>
  );
}
