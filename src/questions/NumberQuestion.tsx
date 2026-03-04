import type { QuestionComponentProps } from "../context/FormContext";
import type { NumberQuestion as TNumberQuestion } from "../types/question";

export function NumberQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TNumberQuestion;

  return (
    <div
      className="rdf-input-wrapper"
      style={{ display: "flex", alignItems: "center", gap: "4px", ...q.customStyles?.inputWrapper }}
    >
      {q.prefix && <span className="rdf-prefix" style={q.customStyles?.prefix}>{q.prefix}</span>}
      <input
        type="number"
        className="rdf-input"
        value={typeof value === "number" ? value : ""}
        placeholder={q.placeholder}
        min={q.min}
        max={q.max}
        step={q.step ?? 1}
        disabled={disabled}
        readOnly={readOnly}
        style={q.customStyles?.input}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          onChange(isNaN(parsed) ? undefined : parsed);
        }}
        onBlur={onBlur}
      />
      {q.suffix && <span className="rdf-suffix" style={q.customStyles?.suffix}>{q.suffix}</span>}
    </div>
  );
}
