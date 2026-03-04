import { useState, useRef, useEffect } from "react";
import type { QuestionComponentProps } from "../context/FormContext";
import type { TextBoxQuestion as TTextBoxQuestion } from "../types/question";

export function TextBoxQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TTextBoxQuestion;
  const showEditIcon = q.uiConfig?.textBox?.showEditIcon === true;
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  // Edit-icon mode: show value as text, pencil to enter edit mode
  if (showEditIcon && !isEditing && !disabled && !readOnly) {
    return (
      <div
        className="rdf-input-wrapper rdf-input-wrapper--view"
        style={{ display: "flex", alignItems: "center", gap: "4px", ...q.customStyles?.inputWrapper }}
      >
        {q.prefix && <span className="rdf-prefix" style={q.customStyles?.prefix}>{q.prefix}</span>}
        <span className="rdf-input-view" style={{ flex: 1, ...q.customStyles?.input }}>
          {typeof value === "string" && value ? value : (
            <span className="rdf-input-view__placeholder">{q.placeholder ?? ""}</span>
          )}
        </span>
        <button
          type="button"
          className="rdf-edit-icon"
          aria-label="Edit"
          onClick={() => setIsEditing(true)}
        >
          ✏
        </button>
        {q.suffix && <span className="rdf-suffix" style={q.customStyles?.suffix}>{q.suffix}</span>}
      </div>
    );
  }

  return (
    <div
      className="rdf-input-wrapper"
      style={{ display: "flex", alignItems: "center", gap: "4px", ...q.customStyles?.inputWrapper }}
    >
      {q.prefix && <span className="rdf-prefix" style={q.customStyles?.prefix}>{q.prefix}</span>}
      <input
        ref={inputRef}
        type="text"
        className="rdf-input"
        value={typeof value === "string" ? value : ""}
        placeholder={q.placeholder}
        disabled={disabled}
        readOnly={readOnly}
        style={q.customStyles?.input}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (showEditIcon) setIsEditing(false);
          onBlur();
        }}
      />
      {q.suffix && <span className="rdf-suffix" style={q.customStyles?.suffix}>{q.suffix}</span>}
    </div>
  );
}
