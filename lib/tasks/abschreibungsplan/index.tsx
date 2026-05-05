import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateAbschreibungsplan,
  type AbschreibungsplanParams,
} from "./generate";
import {
  solveAbschreibungsplan,
  type AbschreibungsplanSolution,
} from "./solve";
import {
  checkAbschreibungsplan,
  type AbschreibungsplanAnswer,
} from "./check";
import {
  AbschreibungsplanComponent,
  AbschreibungsplanSolutionView,
} from "./Component";
import { buildAbschreibungsplanPrompt } from "./prompt";
import { validateAbschreibungsplanInput } from "./validate";

export const abschreibungsplanTask: TaskDefinition<
  AbschreibungsplanParams,
  AbschreibungsplanSolution,
  AbschreibungsplanAnswer
> = {
  kind: "abschreibungsplan",
  tutorium: "Tutorium 3 · Aufgabe 3.1",
  title: "Abschreibungsplan – 4 Verfahren",
  description:
    "Linear, geometrisch-degressiv, arithmetisch-degressiv, leistungsabhängig.",
  schemaVersion: 1,
  generate: generateAbschreibungsplan,
  solve: solveAbschreibungsplan,
  check: checkAbschreibungsplan,
  Component: AbschreibungsplanComponent,
  renderSolution: (params, solution) => (
    <AbschreibungsplanSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildAbschreibungsplanPrompt,
  validateRawInput: validateAbschreibungsplanInput,
};
