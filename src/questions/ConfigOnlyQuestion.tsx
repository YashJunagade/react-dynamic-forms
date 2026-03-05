import type { QuestionComponentProps } from "../context/FormContext";
import type { ConfigOnlyQuestion as TConfigOnlyQuestion } from "../types/question";

export function ConfigOnlyQuestion({ question }: QuestionComponentProps) {
  const q = question as TConfigOnlyQuestion;
  return q.content ? (
    <div
      className="rdf-config-only"
      dangerouslySetInnerHTML={{ __html: q.content }}
    />
  ) : null;
}
