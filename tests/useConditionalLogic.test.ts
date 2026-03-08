import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useConditionalLogic } from "../src/logic/useConditionalLogic";
import type { SchemaQuestion } from "../src/types/schema";

function makeQuestion(overrides: Partial<SchemaQuestion>): SchemaQuestion {
  return {
    key: "q1",
    type: "textbox",
    label: "Q1",
    ...overrides,
  } as SchemaQuestion;
}

// ─── No condition ─────────────────────────────────────────────────────────────

describe("no condition", () => {
  it("makes every question visible by default", () => {
    const questions = [makeQuestion({ key: "a" }), makeQuestion({ key: "b" })];
    const { result } = renderHook(() => useConditionalLogic(questions, {}));
    expect(result.current.visibleKeys.has("a")).toBe(true);
    expect(result.current.visibleKeys.has("b")).toBe(true);
    expect(result.current.disabledKeys.size).toBe(0);
  });
});

// ─── Single condition — equals ────────────────────────────────────────────────

describe("single condition: equals", () => {
  const questions = [
    makeQuestion({ key: "trigger" }),
    makeQuestion({
      key: "dependent",
      condition: { when: "trigger", operator: "equals", value: "yes" },
    }),
  ];

  it("hides dependent when condition fails", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { trigger: "no" })
    );
    expect(result.current.visibleKeys.has("dependent")).toBe(false);
  });

  it("shows dependent when condition passes", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { trigger: "yes" })
    );
    expect(result.current.visibleKeys.has("dependent")).toBe(true);
  });
});

// ─── Single condition — not_equals ────────────────────────────────────────────

describe("single condition: not_equals", () => {
  const questions = [
    makeQuestion({ key: "trigger" }),
    makeQuestion({
      key: "dependent",
      condition: { when: "trigger", operator: "not_equals", value: "skip" },
    }),
  ];

  it("hides when value equals the excluded value", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { trigger: "skip" })
    );
    expect(result.current.visibleKeys.has("dependent")).toBe(false);
  });

  it("shows when value differs", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { trigger: "other" })
    );
    expect(result.current.visibleKeys.has("dependent")).toBe(true);
  });
});

// ─── Single condition — is_empty / is_not_empty ───────────────────────────────

describe("single condition: is_empty / is_not_empty", () => {
  it("is_empty: shows when value is empty", () => {
    const questions = [
      makeQuestion({ key: "t" }),
      makeQuestion({
        key: "d",
        condition: { when: "t", operator: "is_empty", value: undefined },
      }),
    ];
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { t: "" })
    );
    expect(result.current.visibleKeys.has("d")).toBe(true);
  });

  it("is_not_empty: shows when value is non-empty", () => {
    const questions = [
      makeQuestion({ key: "t" }),
      makeQuestion({
        key: "d",
        condition: { when: "t", operator: "is_not_empty", value: undefined },
      }),
    ];
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { t: "filled" })
    );
    expect(result.current.visibleKeys.has("d")).toBe(true);
  });
});

// ─── Single condition — includes / not_includes ───────────────────────────────

describe("single condition: includes", () => {
  const questions = [
    makeQuestion({ key: "tags" }),
    makeQuestion({
      key: "special",
      condition: { when: "tags", operator: "includes", value: "vip" },
    }),
  ];

  it("shows when array includes the value", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { tags: ["basic", "vip"] })
    );
    expect(result.current.visibleKeys.has("special")).toBe(true);
  });

  it("hides when array does not include the value", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { tags: ["basic"] })
    );
    expect(result.current.visibleKeys.has("special")).toBe(false);
  });
});

// ─── conditionBehavior: disable ───────────────────────────────────────────────

describe("conditionBehavior: disable", () => {
  const questions = [
    makeQuestion({ key: "trigger" }),
    makeQuestion({
      key: "dependent",
      condition: { when: "trigger", operator: "equals", value: "go" },
      conditionBehavior: "disable",
    }),
  ];

  it("keeps question visible but adds to disabledKeys when condition fails", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { trigger: "stop" })
    );
    expect(result.current.visibleKeys.has("dependent")).toBe(true);
    expect(result.current.disabledKeys.has("dependent")).toBe(true);
  });

  it("removes from disabledKeys when condition passes", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { trigger: "go" })
    );
    expect(result.current.visibleKeys.has("dependent")).toBe(true);
    expect(result.current.disabledKeys.has("dependent")).toBe(false);
  });
});

// ─── AND condition ────────────────────────────────────────────────────────────

describe("AND condition", () => {
  const questions = [
    makeQuestion({ key: "a" }),
    makeQuestion({ key: "b" }),
    makeQuestion({
      key: "result",
      condition: {
        and: [
          { when: "a", operator: "equals", value: "yes" },
          { when: "b", operator: "equals", value: "yes" },
        ],
      },
    }),
  ];

  it("shows when all conditions pass", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { a: "yes", b: "yes" })
    );
    expect(result.current.visibleKeys.has("result")).toBe(true);
  });

  it("hides when one condition fails", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { a: "yes", b: "no" })
    );
    expect(result.current.visibleKeys.has("result")).toBe(false);
  });

  it("hides when both conditions fail", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { a: "no", b: "no" })
    );
    expect(result.current.visibleKeys.has("result")).toBe(false);
  });
});

// ─── OR condition ─────────────────────────────────────────────────────────────

describe("OR condition", () => {
  const questions = [
    makeQuestion({ key: "a" }),
    makeQuestion({ key: "b" }),
    makeQuestion({
      key: "result",
      condition: {
        or: [
          { when: "a", operator: "equals", value: "yes" },
          { when: "b", operator: "equals", value: "yes" },
        ],
      },
    }),
  ];

  it("shows when at least one condition passes", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { a: "yes", b: "no" })
    );
    expect(result.current.visibleKeys.has("result")).toBe(true);
  });

  it("shows when both conditions pass", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { a: "yes", b: "yes" })
    );
    expect(result.current.visibleKeys.has("result")).toBe(true);
  });

  it("hides when all conditions fail", () => {
    const { result } = renderHook(() =>
      useConditionalLogic(questions, { a: "no", b: "no" })
    );
    expect(result.current.visibleKeys.has("result")).toBe(false);
  });
});

// ─── Group recursion ──────────────────────────────────────────────────────────

describe("group recursion", () => {
  it("processes children inside a group", () => {
    const questions: SchemaQuestion[] = [
      {
        key: "group1",
        type: "group",
        label: "Group",
        questions: [
          makeQuestion({ key: "child1" }),
          makeQuestion({
            key: "child2",
            condition: { when: "child1", operator: "equals", value: "show" },
          }),
        ],
      },
    ];

    const { result } = renderHook(() =>
      useConditionalLogic(questions, { child1: "show" })
    );
    expect(result.current.visibleKeys.has("group1")).toBe(true);
    expect(result.current.visibleKeys.has("child1")).toBe(true);
    expect(result.current.visibleKeys.has("child2")).toBe(true);
  });

  it("hides child inside group when its condition fails", () => {
    const questions: SchemaQuestion[] = [
      {
        key: "group1",
        type: "group",
        label: "Group",
        questions: [
          makeQuestion({ key: "child1" }),
          makeQuestion({
            key: "child2",
            condition: { when: "child1", operator: "equals", value: "show" },
          }),
        ],
      },
    ];

    const { result } = renderHook(() =>
      useConditionalLogic(questions, { child1: "hide" })
    );
    expect(result.current.visibleKeys.has("child2")).toBe(false);
  });
});
