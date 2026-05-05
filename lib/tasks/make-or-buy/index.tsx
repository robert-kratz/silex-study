import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generateMakeOrBuy,
  type MakeOrBuyParams,
  type MakeOrBuySolution,
} from "./generate";
import { solveMakeOrBuy } from "./solve";
import { checkMakeOrBuy, type MakeOrBuyAnswer } from "./check";
import { MakeOrBuyComponent, MakeOrBuySolutionView } from "./Component";
import { buildMakeOrBuyPrompt } from "./prompt";
import { validateMakeOrBuyInput } from "./validate";

export const makeOrBuyTask: TaskDefinition<
  MakeOrBuyParams,
  MakeOrBuySolution,
  MakeOrBuyAnswer
> = {
  kind: "make-or-buy",
  tutorium: "Tutorium 2 · Aufgabe 2.4",
  title: "Make-or-Buy Entscheidung",
  description: "Eigenfertigung vs. Fremdbezug auf Basis relevanter Kosten.",
  schemaVersion: 1,
  generate: generateMakeOrBuy,
  solve: solveMakeOrBuy,
  check: checkMakeOrBuy,
  Component: MakeOrBuyComponent,
  renderSolution: (params, solution) => (
    <MakeOrBuySolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildMakeOrBuyPrompt,
  validateRawInput: validateMakeOrBuyInput,
};
