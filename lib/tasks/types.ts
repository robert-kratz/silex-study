import type { ComponentType, ReactNode } from "react";

export interface TaskToken<TKind extends string = string> {
  v: number;
  k: TKind;
  s: number;
}

export interface FieldResult {
  ok: boolean;
  expected: number | string;
  given: number | string | null;
  tolerance?: number;
  hint?: string;
}

export interface CheckResult {
  score: number;
  max: number;
  fields: Record<string, FieldResult>;
  passed: boolean;
}

export interface TaskComponentProps<Params, Solution> {
  params: Params;
  solution: Solution;
  seed: number;
  shareUrl: string;
  courseId: string;
}

export interface TaskDefinition<Params, Solution, Answer> {
  kind: string;
  tutorium: string;
  title: string;
  description: string;
  schemaVersion: number;
  generate: (seed: number) => Params;
  solve: (params: Params) => Solution;
  check: (solution: Solution, answer: Answer) => CheckResult;
  Component: ComponentType<TaskComponentProps<Params, Solution>>;
  renderSolution: (params: Params, solution: Solution) => ReactNode;
  buildPrompt: (params: Params) => string;
  /**
   * Validates raw string form inputs before submission.
   * Returns field name → human-readable error message for every invalid field.
   * An empty object means all inputs are valid.
   */
  validateRawInput: (raw: Record<string, string>) => Partial<Record<string, string>>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyTaskDefinition = TaskDefinition<any, any, any>;
