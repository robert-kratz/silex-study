import type { TaskDefinition } from "@/lib/tasks/types";
import { generateMehrproduktBe, type MehrproduktBeParams } from "./generate";
import { solveMehrproduktBe, type MehrproduktBeSolution } from "./solve";
import { checkMehrproduktBe, type MehrproduktBeAnswer } from "./check";
import { MehrproduktBeComponent, MehrproduktBeSolutionView } from "./Component";
import { buildMehrproduktBePrompt } from "./prompt";
import { validateMehrproduktBeInput } from "./validate";

export const mehrproduktBeTask: TaskDefinition<
  MehrproduktBeParams,
  MehrproduktBeSolution,
  MehrproduktBeAnswer
> = {
  kind: "mehrprodukt-be",
  tutorium: "Tutorium 10 · Aufgabe 10.3",
  title: "Mehrprodukt-Break-Even",
  description:
    "Break-Even-Mengen für zwei Produkte mit konstantem Verkaufsverhältnis bestimmen.",
  schemaVersion: 1,
  generate: generateMehrproduktBe,
  solve: solveMehrproduktBe,
  check: checkMehrproduktBe,
  Component: MehrproduktBeComponent,
  renderSolution: (params, solution) => (
    <MehrproduktBeSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildMehrproduktBePrompt,
  validateRawInput: validateMehrproduktBeInput,
};
