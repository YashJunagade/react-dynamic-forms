import type { AnyQuestion } from "./question";

// SchemaQuestion is just AnyQuestion — validation/condition are on BaseQuestion
export type SchemaQuestion = AnyQuestion;

export interface FormSchema {
  id: string;
  title?: string;
  description?: string;
  questions: SchemaQuestion[];
  submitLabel?: string;
  resetLabel?: string;
}

// Flat map of all questions (including nested, extracted at parse time)
export type QuestionMap = Map<string, SchemaQuestion>;
