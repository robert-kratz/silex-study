import type { QuizParams } from "./generate";

export function validateTheorieQuizInput(
  raw: Record<string, string>,
  params: QuizParams,
): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  params.itemIds.forEach((_, i) => {
    const v = raw[`q${i}`];
    if (!v || v.trim() === "") errors[`q${i}`] = "Bitte eine Antwort auswählen.";
  });
  return errors;
}
