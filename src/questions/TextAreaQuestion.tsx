import type { QuestionComponentProps } from "../context/FormContext";
import type { TextAreaQuestion as TTextAreaQuestion } from "../types/question";

export function TextAreaQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TTextAreaQuestion;

  return (
    <textarea
      className="rdf-textarea"
      value={typeof value === "string" ? value : ""}
      placeholder={q.placeholder}
      disabled={disabled}
      readOnly={readOnly}
      rows={q.minRows ?? 3}
      style={{ maxHeight: q.maxRows ? `${q.maxRows * 1.5}rem` : undefined, resize: "vertical", ...q.customStyles?.input }}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}
