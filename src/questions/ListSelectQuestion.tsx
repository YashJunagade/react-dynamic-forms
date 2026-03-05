import { useState } from "react";
import type { QuestionComponentProps } from "../context/FormContext";
import type { ListSelectQuestion as TListSelectQuestion } from "../types/question";

export function ListSelectQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TListSelectQuestion;
  const selected = Array.isArray(value) ? (value as string[]) : [];
  const [search, setSearch] = useState("");

  const optStyles = q.customStyles?.options;
  const filtered = q.searchable && search.trim()
    ? q.options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : q.options;

  function toggle(val: string) {
    if (readOnly || disabled) return;
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  }

  return (
    <div className="rdf-list-select" onBlur={onBlur}>
      {q.searchable && (
        <input
          type="text"
          className="rdf-list-select__search rdf-input"
          placeholder="Search…"
          value={search}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <div
        className="rdf-list-select__options"
        style={{
          maxHeight: q.maxHeight ?? 200,
          overflowY: "auto",
          border: "1px solid var(--rdf-border)",
          borderRadius: "var(--rdf-radius)",
          ...q.customStyles?.input,
        }}
      >
        {filtered.length === 0 ? (
          <p className="rdf-list-select__empty">No options found</p>
        ) : (
          filtered.map((opt) => (
            <label
              key={opt.value}
              className={`rdf-list-select__item ${selected.includes(opt.value) ? "rdf-list-select__item--selected" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
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
                onChange={() => toggle(opt.value)}
              />
              <span style={optStyles?.optionLabel}>{opt.label}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
