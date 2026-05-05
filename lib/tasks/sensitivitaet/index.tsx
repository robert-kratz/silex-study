import type { TaskDefinition } from "@/lib/tasks/types";
import { generateSensitivitaet, type SensitivitaetParams } from "./generate";
import { solveSensitivitaet, type SensitivitaetSolution } from "./solve";
import { checkSensitivitaet, type SensitivitaetAnswer } from "./check";
import { SensitivitaetComponent, SensitivitaetSolutionView } from "./Component";
import { buildSensitivitaetPrompt } from "./prompt";
import { validateSensitivitaetInput } from "./validate";

export const sensitivitaetTask: TaskDefinition<
  SensitivitaetParams,
  SensitivitaetSolution,
  SensitivitaetAnswer
> = {
  kind: "sensitivitaet",
  tutorium: "Tutorium 10 · Aufgabe 10.2",
  title: "Sensitivität & Sicherheitskoeffizient",
  description:
    "Sicherheitsabstand zum Break-Even und Gewinnwirkung einer Werbemaßnahme.",
  schemaVersion: 1,
  generate: generateSensitivitaet,
  solve: solveSensitivitaet,
  check: checkSensitivitaet,
  Component: SensitivitaetComponent,
  renderSolution: (_params, solution) => (
    <SensitivitaetSolutionView solution={solution} />
  ),
  buildPrompt: buildSensitivitaetPrompt,
  validateRawInput: validateSensitivitaetInput,
};
