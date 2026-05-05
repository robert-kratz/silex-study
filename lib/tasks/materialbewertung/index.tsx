import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateMaterialbewertung,
  type MaterialbewertungParams,
} from "./generate";
import {
  solveMaterialbewertung,
  type MaterialbewertungSolution,
} from "./solve";
import {
  checkMaterialbewertung,
  type MaterialbewertungAnswer,
} from "./check";
import {
  MaterialbewertungComponent,
  MaterialbewertungSolutionView,
} from "./Component";
import { buildMaterialbewertungPrompt } from "./prompt";
import { validateMaterialbewertungInput } from "./validate";

export const materialbewertungTask: TaskDefinition<
  MaterialbewertungParams,
  MaterialbewertungSolution,
  MaterialbewertungAnswer
> = {
  kind: "materialbewertung",
  tutorium: "Tutorium 3 · Aufgabe 3.2",
  title: "Materialbewertung – FIFO & LIFO",
  description:
    "Verbrauchswert und Endbestand bei FIFO und permanentem LIFO.",
  schemaVersion: 1,
  generate: generateMaterialbewertung,
  solve: solveMaterialbewertung,
  check: checkMaterialbewertung,
  Component: MaterialbewertungComponent,
  renderSolution: (_params, solution) => (
    <MaterialbewertungSolutionView solution={solution} />
  ),
  buildPrompt: buildMaterialbewertungPrompt,
  validateRawInput: validateMaterialbewertungInput,
};
