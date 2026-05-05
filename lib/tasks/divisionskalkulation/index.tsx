import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateDivisionskalkulation,
  type DivisionskalkulationParams,
} from "./generate";
import {
  solveDivisionskalkulation,
  type DivisionskalkulationSolution,
} from "./solve";
import {
  checkDivisionskalkulation,
  type DivisionskalkulationAnswer,
} from "./check";
import {
  DivisionskalkulationComponent,
  DivisionskalkulationSolutionView,
} from "./Component";
import { buildDivisionskalkulationPrompt } from "./prompt";
import { validateDivisionskalkulationInput } from "./validate";

export const divisionskalkulationTask: TaskDefinition<
  DivisionskalkulationParams,
  DivisionskalkulationSolution,
  DivisionskalkulationAnswer
> = {
  kind: "divisionskalkulation",
  tutorium: "Tutorium 6 · Aufgabe 6.1",
  title: "Mehrstufige Divisionskalkulation",
  description:
    "Stufenkosten, Lagerveränderungen und Vertriebskosten in eine Selbstkostenrechnung pro Einheit überführen.",
  schemaVersion: 1,
  generate: generateDivisionskalkulation,
  solve: solveDivisionskalkulation,
  check: checkDivisionskalkulation,
  Component: DivisionskalkulationComponent,
  renderSolution: (params, solution) => (
    <DivisionskalkulationSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildDivisionskalkulationPrompt,
  validateRawInput: validateDivisionskalkulationInput,
};
