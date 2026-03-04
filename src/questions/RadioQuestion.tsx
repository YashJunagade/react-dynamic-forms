import type { QuestionComponentProps } from "../context/FormContext";
import type { RadioQuestion as TRadioQuestion } from "../types/question";

export function RadioQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TRadioQuestion;
  const flexDir = q.layout === "horizontal" ? "row" : "column";

  const optStyles = q.customStyles?.options;

  return (
    <div
      className="rdf-radio-group"
      style={{ display: "flex", flexDirection: flexDir, flexWrap: "wrap", gap: "8px", ...q.customStyles?.input }}
      onBlur={onBlur}
    >
      {q.options.map((opt) => (
        <label
          key={opt.value}
          className="rdf-radio-label"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: disabled || readOnly ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            ...optStyles?.option,
          }}
        >
          <input
            type="radio"
            className="rdf-radio"
            name={q.key}
            value={opt.value}
            checked={value === opt.value}
            disabled={disabled || readOnly}
            style={optStyles?.optionInput}
            onChange={() => !readOnly && onChange(opt.value)}
          />
          <span style={optStyles?.optionLabel}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
