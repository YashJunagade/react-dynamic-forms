import type { QuestionComponentProps } from "../context/FormContext";
import type { ArrayQuestion as TArrayQuestion } from "../types/question";

export function ArrayQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TArrayQuestion;
  const arrConfig = q.uiConfig?.array;
  const items = Array.isArray(value) ? (value as string[]) : [];

  function updateItem(index: number, newValue: string) {
    const updated = [...items];
    updated[index] = newValue;
    onChange(updated);
  }

  function addItem() {
    if (q.maxItems && items.length >= q.maxItems) return;
    onChange([...items, ""]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  const canAdd = !q.maxItems || items.length < q.maxItems;
  const canRemove = !q.minItems || items.length > q.minItems;

  return (
    <div className="rdf-array" onBlur={onBlur}>
      {items.map((item, i) => (
        <div
          key={i}
          className="rdf-array-item"
          style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}
        >
          <input
            type="text"
            className="rdf-input"
            value={item}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={q.itemLabel ?? `Item ${i + 1}`}
            onChange={(e) => updateItem(i, e.target.value)}
            style={{ flex: 1, ...q.customStyles?.input }}
          />
          {!readOnly && canRemove && (
            <button
              type="button"
              className="rdf-array-remove"
              onClick={() => removeItem(i)}
              disabled={disabled}
              aria-label={arrConfig?.removeLabel ?? "Remove item"}
              style={q.customStyles?.removeButton}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {!readOnly && canAdd && (
        <button
          type="button"
          className="rdf-array-add"
          onClick={addItem}
          disabled={disabled}
          style={q.customStyles?.addButton}
        >
          + {arrConfig?.addLabel ?? (q.itemLabel ? `Add ${q.itemLabel}` : "Add item")}
        </button>
      )}
    </div>
  );
}
