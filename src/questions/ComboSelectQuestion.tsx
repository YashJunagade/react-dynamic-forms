import type { QuestionComponentProps } from "../context/FormContext";
import type { ComboSelectQuestion as TComboSelectQuestion } from "../types/question";

export function ComboSelectQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TComboSelectQuestion;
  const ddStyles = q.customStyles?.dropdown;
  const ddConfig = q.uiConfig?.dropdown;

  const showClear = (ddConfig?.showClear ?? q.clearable) && !disabled && !readOnly && value !== undefined && value !== "";
  const noOptionText = ddConfig?.noOptionText ?? "No options available";

  return (
    <div
      className="rdf-select-wrapper"
      style={{ position: "relative", display: "flex", alignItems: "center", gap: "4px", ...ddStyles?.wrapper }}
    >
      <select
        className="rdf-select"
        value={typeof value === "string" ? value : ""}
        disabled={disabled || readOnly}
        onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.value)}
        onBlur={onBlur}
        style={{ flex: 1, width: "100%", ...q.customStyles?.input, ...ddStyles?.select }}
      >
        <option value="">{q.placeholder ?? "Select an option"}</option>
        {q.options.length === 0 ? (
          <option value="" disabled>{noOptionText}</option>
        ) : (
          q.options.map((opt) => (
            <option key={opt.value} value={opt.value} style={ddStyles?.option}>
              {opt.label}
            </option>
          ))
        )}
      </select>
      {showClear && (
        <button
          type="button"
          className="rdf-select-clear"
          aria-label="Clear selection"
          onClick={() => { onChange(undefined); onBlur(); }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
