import type { TaskDefinition } from "@/lib/tasks/types";
import { generateTheorieQuiz, type QuizParams, type QuizSolution } from "./generate";
import { solveTheorieQuiz } from "./solve";
import { checkTheorieQuiz, type QuizAnswer } from "./check";
import { TheorieQuizComponent, TheorieQuizSolutionView } from "./Component";
import { buildTheorieQuizPrompt } from "./prompt";

export const theorieQuizTask: TaskDefinition<QuizParams, QuizSolution, QuizAnswer> = {
  kind: "theorie-quiz",
  tutorium: "Tutorium 0 · Aufgabe 0.1",
  title: "Theorie- & Konzept-Quiz",
  description:
    "Multiple-Choice-Quiz zu Verbrauchsfolgen, Kostenverläufen, Abschreibung, ILV, GKV/UKV, Make-or-Buy und Break-Even.",
  schemaVersion: 1,
  generate: generateTheorieQuiz,
  solve: solveTheorieQuiz,
  check: checkTheorieQuiz,
  Component: TheorieQuizComponent,
  renderSolution: (params, solution) => (
    <TheorieQuizSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildTheorieQuizPrompt,
  // raw inputs depend on the params (number of questions); we keep this generic
  // and rely on the component-level validator that knows the params.
  validateRawInput: () => ({}),
};
