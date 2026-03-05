import type { QuestionComponentProps } from "../context/FormContext";
import type { MultiStringQuestion as TMultiStringQuestion } from "../types/question";

export function MultiStringQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TMultiStringQuestion;
  const values = (value && typeof value === "object" && !Array.isArray(value))
    ? (value as Record<string, string>)
    : {};

  function updateField(fieldKey: string, fieldValue: string) {
    onChange({ ...values, [fieldKey]: fieldValue });
  }

  return (
    <div className="rdf-multi-string" onBlur={onBlur}>
      {q.fields.map((field) => (
        <div
          key={field.key}
          className="rdf-multi-string__row"
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}
        >
          <label
            className="rdf-multi-string__label"
            style={{
              minWidth: "120px",
              fontWeight: 500,
              fontSize: "var(--rdf-font-size)",
              color: "var(--rdf-label-color)",
              flexShrink: 0,
              ...q.customStyles?.label,
            }}
          >
            {field.label}
          </label>
          <input
            type="text"
            className="rdf-input"
            value={values[field.key] ?? ""}
            placeholder={field.placeholder ?? ""}
            disabled={disabled}
            readOnly={readOnly}
            style={{ flex: 1, ...q.customStyles?.input }}
            onChange={(e) => updateField(field.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
