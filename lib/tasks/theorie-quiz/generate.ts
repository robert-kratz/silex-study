import { createRng, rngInt } from "@/lib/random";
import { QUIZ_BANK } from "./items";

export interface QuizParams {
  /** Indices into QUIZ_BANK in display order. */
  itemIds: string[];
  /** For each item: a permutation of option indices used to shuffle options. */
  optionOrder: number[][];
}

export interface QuizSolution {
  /** Index of the correct option *after* shuffling, per item. */
  correctIndex: number[];
}

const QUESTION_COUNT = 6;

function shuffleIndices(rng: () => number, n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = rngInt(rng, 0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateTheorieQuiz(seed: number): QuizParams {
  const rng = createRng(seed);
  const indexPerm = shuffleIndices(rng, QUIZ_BANK.length).slice(0, QUESTION_COUNT);
  const itemIds = indexPerm.map((i) => QUIZ_BANK[i].id);
  const optionOrder = indexPerm.map((i) =>
    shuffleIndices(rng, QUIZ_BANK[i].options.length),
  );
  return { itemIds, optionOrder };
}
