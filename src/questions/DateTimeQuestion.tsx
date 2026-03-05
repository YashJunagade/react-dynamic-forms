import type { QuestionComponentProps } from "../context/FormContext";
import type { DateTimeQuestion as TDateTimeQuestion } from "../types/question";

const INPUT_TYPE_MAP = {
  date: "date",
  time: "time",
  datetime: "datetime-local",
} as const;

export function DateTimeQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TDateTimeQuestion;
  const inputType = INPUT_TYPE_MAP[q.mode ?? "date"];

  return (
    <input
      type={inputType}
      className="rdf-input rdf-datetime"
      value={typeof value === "string" ? value : ""}
      min={q.minDate}
      max={q.maxDate}
      disabled={disabled}
      readOnly={readOnly}
      style={q.customStyles?.input}
      onChange={(e) => onChange(e.target.value || undefined)}
      onBlur={onBlur}
    />
  );
}
