import type { TaskDefinition } from "@/lib/tasks/types";
import { generateKalkZinsen, type KalkZinsenParams } from "./generate";
import { solveKalkZinsen, type KalkZinsenSolution } from "./solve";
import { checkKalkZinsen, type KalkZinsenAnswer } from "./check";
import { KalkZinsenComponent, KalkZinsenSolutionView } from "./Component";
import { buildKalkZinsenPrompt } from "./prompt";
import { validateKalkZinsenInput } from "./validate";

export const kalkZinsenTask: TaskDefinition<
  KalkZinsenParams,
  KalkZinsenSolution,
  KalkZinsenAnswer
> = {
  kind: "kalk-zinsen",
  tutorium: "Tutorium 3 · Aufgabe 3.3",
  title: "Kalkulatorische Zinsen & BN-Kapital",
  description:
    "Aus Bilanzposten BN-Vermögen, Abzugskapital, BN-Kapital und kalk. Zinsen ermitteln.",
  schemaVersion: 1,
  generate: generateKalkZinsen,
  solve: solveKalkZinsen,
  check: checkKalkZinsen,
  Component: KalkZinsenComponent,
  renderSolution: (params, solution) => (
    <KalkZinsenSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildKalkZinsenPrompt,
  validateRawInput: validateKalkZinsenInput,
};
