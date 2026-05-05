import type { TaskDefinition } from "@/lib/tasks/types";
import { generateIlvGleichung, type IlvGleichungParams } from "./generate";
import { solveIlvGleichung, type IlvGleichungSolution } from "./solve";
import { checkIlvGleichung, type IlvGleichungAnswer } from "./check";
import { IlvGleichungComponent, IlvGleichungSolutionView } from "./Component";
import { buildIlvGleichungPrompt } from "./prompt";
import { validateIlvGleichungInput } from "./validate";

export const ilvGleichungTask: TaskDefinition<
  IlvGleichungParams,
  IlvGleichungSolution,
  IlvGleichungAnswer
> = {
  kind: "ilv-gleichung",
  tutorium: "Tutorium 4 · Aufgabe 4.4",
  title: "ILV – Gleichungsverfahren",
  description: "Wechselseitige Verrechnung über ein 2×2-LGS.",
  schemaVersion: 1,
  generate: generateIlvGleichung,
  solve: solveIlvGleichung,
  check: checkIlvGleichung,
  Component: IlvGleichungComponent,
  renderSolution: (params, solution) => (
    <IlvGleichungSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildIlvGleichungPrompt,
  validateRawInput: validateIlvGleichungInput,
};
