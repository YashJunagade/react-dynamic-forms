import { useState } from "react";
import { useFormContext } from "../context/FormContext";
import type { SchemaQuestion } from "../types/schema";
import type { GroupQuestion } from "../types/question";
import { QuestionRenderer } from "./QuestionRenderer";

interface GroupRendererProps {
  question: SchemaQuestion;
}

export function GroupRenderer({ question }: GroupRendererProps) {
  const { visibleKeys } = useFormContext();
  const q = question as unknown as GroupQuestion;
  const [collapsed, setCollapsed] = useState(q.defaultCollapsed ?? false);

  // If the group itself is hidden, render nothing
  if (!visibleKeys.has(question.key)) return null;

  // Check if any child is visible — if none, hide the group container too
  const hasVisibleChild = q.questions.some((child) => visibleKeys.has(child.key));
  if (!hasVisibleChild) return null;

  return (
    <fieldset className="rdf-group">
      {question.label && (
        <legend
          className={`rdf-group__legend ${q.collapsible ? "rdf-group__legend--clickable" : ""}`}
          onClick={q.collapsible ? () => setCollapsed((c) => !c) : undefined}
          aria-expanded={q.collapsible ? !collapsed : undefined}
        >
          {question.label}
          {q.collapsible && (
            <span className="rdf-group__chevron" aria-hidden="true">
              {collapsed ? " ▸" : " ▾"}
            </span>
          )}
        </legend>
      )}
      {!collapsed && (
        <div className="rdf-group__body">
          {q.questions.map((child) => (
            <QuestionRenderer key={child.key} question={child as SchemaQuestion} />
          ))}
        </div>
      )}
    </fieldset>
  );
}
