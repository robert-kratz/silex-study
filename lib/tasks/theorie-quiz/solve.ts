import { QUIZ_BANK, type QuizItem } from "./items";
import type { QuizParams, QuizSolution } from "./generate";

export function getItem(id: string): QuizItem {
  const item = QUIZ_BANK.find((q) => q.id === id);
  if (!item) throw new Error(`Quiz-Item nicht gefunden: ${id}`);
  return item;
}

export function solveTheorieQuiz(params: QuizParams): QuizSolution {
  const correctIndex = params.itemIds.map((id, idx) => {
    const item = getItem(id);
    const order = params.optionOrder[idx];
    // Position in shuffled array where item.correct ended up.
    return order.indexOf(item.correct);
  });
  return { correctIndex };
}
