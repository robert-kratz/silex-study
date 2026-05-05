import type { TaskDefinition } from "@/lib/tasks/types";
import {
  generatePolynomGrenzkosten,
  type PolynomGrenzkostenParams,
  type PolynomGrenzkostenSolution,
} from "./generate";
import { solvePolynomGrenzkosten } from "./solve";
import {
  checkPolynomGrenzkosten,
  type PolynomGrenzkostenAnswer,
} from "./check";
import {
  PolynomGrenzkostenComponent,
  PolynomGrenzkostenSolutionView,
} from "./Component";
import { buildPolynomGrenzkostenPrompt } from "./prompt";
import { validatePolynomGrenzkostenInput } from "./validate";

export const polynomGrenzkostenTask: TaskDefinition<
  PolynomGrenzkostenParams,
  PolynomGrenzkostenSolution,
  PolynomGrenzkostenAnswer
> = {
  kind: "polynom-grenzkosten",
  tutorium: "Tutorium 2 · Aufgabe 2.5",
  title: "Polynom-Kostenfunktion: Grenz- und Durchschnittskosten",
  description: "K(x) = a + b·x − c·x² + d·x³ — Grenz- und Stückkosten am Punkt.",
  schemaVersion: 1,
  generate: generatePolynomGrenzkosten,
  solve: solvePolynomGrenzkosten,
  check: checkPolynomGrenzkosten,
  Component: PolynomGrenzkostenComponent,
  renderSolution: (params, solution) => (
    <PolynomGrenzkostenSolutionView params={params} solution={solution} />
  ),
  buildPrompt: buildPolynomGrenzkostenPrompt,
  validateRawInput: validatePolynomGrenzkostenInput,
};
