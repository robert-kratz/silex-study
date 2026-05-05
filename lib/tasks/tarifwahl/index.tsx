import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateTarifwahl,
  type TarifwahlParams,
  type TarifwahlSolution,
} from "./generate";
import { solveTarifwahl } from "./solve";
import { checkTarifwahl, type TarifwahlAnswer } from "./check";
import { TarifwahlComponent, TarifwahlSolutionView } from "./Component";
import { buildTarifwahlPrompt } from "./prompt";

export const tarifwahlTask: TaskDefinition<
  TarifwahlParams,
  TarifwahlSolution,
  TarifwahlAnswer
> = {
  kind: "tarifwahl",
  tutorium: "Tutorium 1 · Aufgabe 1.1",
  title: "Tarifwahl & Kostenvergleich",
  description:
    "Wähle für drei Mengen jeweils den günstigsten Tarif und berechne die Stückkosten.",
  schemaVersion: 1,
  generate: generateTarifwahl,
  solve: solveTarifwahl,
  check: checkTarifwahl,
  Component: TarifwahlComponent,
  renderSolution: (params, solution) => (
    <TarifwahlSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildTarifwahlPrompt,
  validateRawInput: () => ({}),
};
