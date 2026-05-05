import type { CheckResult, FieldResult } from "@/lib/tasks/types";
import type { QuizSolution } from "./generate";

export type QuizAnswer = (number | null)[];

export function checkTheorieQuiz(
  solution: QuizSolution,
  answer: QuizAnswer,
): CheckResult {
  const fields: Record<string, FieldResult> = {};
  let score = 0;
  solution.correctIndex.forEach((expected, i) => {
    const given = answer[i];
    const ok = given !== null && given === expected;
    if (ok) score += 1;
    fields[`q${i}`] = {
      ok,
      expected,
      given: given ?? null,
      hint: `Frage ${i + 1}`,
    };
  });
  const max = solution.correctIndex.length;
  return { score, max, fields, passed: score === max };
}
