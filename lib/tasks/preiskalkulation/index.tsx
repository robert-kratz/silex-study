import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generatePreiskalkulation,
  type PreiskalkulationParams,
  type PreiskalkulationSolution,
} from "./generate";
import { solvePreiskalkulation } from "./solve";
import { checkPreiskalkulation, type PreiskalkulationAnswer } from "./check";
import {
  PreiskalkulationComponent,
  PreiskalkulationSolutionView,
} from "./Component";
import { buildPreiskalkulationPrompt } from "./prompt";
import { validatePreiskalkulationInput } from "./validate";

export const preiskalkulationTask: TaskDefinition<
  PreiskalkulationParams,
  PreiskalkulationSolution,
  PreiskalkulationAnswer
> = {
  kind: "preiskalkulation",
  tutorium: "Tutorium 1 · Aufgabe 1.3",
  title: "Preiskalkulation (progressiv)",
  description:
    "Vom Herstellkosten-Wert über Selbstkosten, Bar-, Ziel- und Listenverkaufspreis.",
  schemaVersion: 1,
  generate: generatePreiskalkulation,
  solve: solvePreiskalkulation,
  check: checkPreiskalkulation,
  Component: PreiskalkulationComponent,
  renderSolution: (params, solution) => (
    <PreiskalkulationSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildPreiskalkulationPrompt,
  validateRawInput: validatePreiskalkulationInput,
};
