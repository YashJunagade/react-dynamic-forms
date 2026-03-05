import { useRef, useState } from "react";
import type { QuestionComponentProps } from "../context/FormContext";
import type { FileUploadQuestion as TFileUploadQuestion } from "../types/question";

export function FileUploadQuestion({ question, value, onChange, onBlur, disabled, readOnly }: QuestionComponentProps) {
  const q = question as TFileUploadQuestion;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const fileNames: string[] = Array.isArray(value)
    ? (value as File[]).map((f) => f.name)
    : value instanceof File
    ? [value.name]
    : typeof value === "string" && value
    ? [value]
    : [];

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setSizeError(null);

    if (q.maxSizeMB) {
      const maxBytes = q.maxSizeMB * 1024 * 1024;
      for (const file of Array.from(files)) {
        if (file.size > maxBytes) {
          setSizeError(`"${file.name}" exceeds the ${q.maxSizeMB} MB limit.`);
          return;
        }
      }
    }

    if (q.multiple) {
      onChange(Array.from(files));
    } else {
      onChange(files[0]);
    }
    onBlur();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (!readOnly && !disabled) handleFiles(e.dataTransfer.files);
  }

  function clearFiles() {
    onChange(undefined);
    setSizeError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rdf-file-upload">
      {!readOnly && !disabled && (
        <div
          className={`rdf-file-upload__zone ${dragOver ? "rdf-file-upload__zone--over" : ""}`}
          style={q.customStyles?.input}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Upload file"
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <span className="rdf-file-upload__icon" aria-hidden="true">📁</span>
          <span className="rdf-file-upload__text">
            {dragOver ? "Drop file here" : "Click or drag & drop to upload"}
          </span>
          {q.accept && (
            <span className="rdf-file-upload__hint">Accepted: {q.accept}</span>
          )}
          {q.maxSizeMB && (
            <span className="rdf-file-upload__hint">Max size: {q.maxSizeMB} MB</span>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={q.accept}
        multiple={q.multiple}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {sizeError && (
        <p className="rdf-file-upload__size-error" role="alert">{sizeError}</p>
      )}

      {fileNames.length > 0 && (
        <ul className="rdf-file-upload__list">
          {fileNames.map((name) => (
            <li key={name} className="rdf-file-upload__file">
              <span className="rdf-file-upload__filename">📄 {name}</span>
              {!readOnly && !disabled && (
                <button
                  type="button"
                  className="rdf-file-upload__remove"
                  style={q.customStyles?.removeButton}
                  aria-label={`Remove ${name}`}
                  onClick={clearFiles}
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
