import type { QuestionComponentProps } from "../context/FormContext";
import type { CheckboxQuestion as TCheckboxQuestion } from "../types/question";

export function CheckboxQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TCheckboxQuestion;
  const selected = Array.isArray(value) ? (value as string[]) : [];

  function toggle(optionValue: string) {
    if (selected.includes(optionValue)) {
      onChange(selected.filter((v) => v !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
  }

  const flexDir = q.layout === "horizontal" ? "row" : "column";

  const optStyles = q.customStyles?.options;

  return (
    <div
      className="rdf-checkbox-group"
      style={{ display: "flex", flexDirection: flexDir, flexWrap: "wrap", gap: "8px", ...q.customStyles?.input }}
      onBlur={onBlur}
    >
      {q.options.map((opt) => (
        <label
          key={opt.value}
          className="rdf-checkbox-label"
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
            type="checkbox"
            className="rdf-checkbox"
            checked={selected.includes(opt.value)}
            disabled={disabled || readOnly}
            style={optStyles?.optionInput}
            onChange={() => !readOnly && toggle(opt.value)}
          />
          <span style={optStyles?.optionLabel}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
