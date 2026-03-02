export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "is_empty"
  | "is_not_empty"
  | "includes"      // for checkbox/multi-select: value includes option
  | "not_includes";

export interface SingleCondition {
  when: string;          // question key to watch
  operator: ConditionOperator;
  value?: string | number | boolean;
}

// AND: all conditions must be true
export interface AndCondition {
  and: SingleCondition[];
}

// OR: at least one condition must be true
export interface OrCondition {
  or: SingleCondition[];
}

// Simple shorthand: { when, operator, value } → treated as AND with one item
export type Condition = SingleCondition | AndCondition | OrCondition;

// How to handle a question when its condition is false
export type ConditionBehavior = "hide" | "disable";
