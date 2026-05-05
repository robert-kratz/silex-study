"use client";

import * as React from "react";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type {
  PolynomGrenzkostenParams,
  PolynomGrenzkostenSolution,
} from "./generate";
import {
  checkPolynomGrenzkosten,
  type PolynomGrenzkostenAnswer,
} from "./check";
import { buildPolynomGrenzkostenPrompt } from "./prompt";
import { validatePolynomGrenzkostenInput } from "./validate";

type Field = keyof PolynomGrenzkostenAnswer;
const BLANK: Record<Field, string> = { Kstrich: "", kAvg: "" };

export function PolynomGrenzkostenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<PolynomGrenzkostenParams, PolynomGrenzkostenSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validatePolynomGrenzkostenInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: PolynomGrenzkostenAnswer = {
      Kstrich: parseLocaleNumber(raw.Kstrich),
      kAvg: parseLocaleNumber(raw.kAvg),
    };
    setCheckResult(checkPolynomGrenzkosten(solution, ans));
  };

  const onReset = () => {
    setRaw(BLANK);
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[k];
        return n;
      });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="polynom-grenzkosten"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Lösung eingeben"
      description="Grenz- und Durchschnittskosten an einem Punkt."
      buildPromptText={() => buildPolynomGrenzkostenPrompt(params)}
      problem={
        <div className="space-y-2">
          <Formula
            expr={`K(x) = ${params.a} + ${params.b}x - ${params.c}x^{2} + ${params.d}x^{3}`}
          />
          <p>
            Auswertungspunkt: x = <strong>{params.x}</strong>.
          </p>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Polynomiale Kostenfunktion 3. Grades: Aus K(x) lassen sich Grenzkosten K′(x) als 1. Ableitung und durchschnittliche Stückkosten k(x) durch Division ableiten."
          variables={[
            { sym: "K(x)", desc: "Gesamtkosten als Funktion der Menge: a + b\u202fx − c\u202fx² + d\u202fx\u00b3" },
            { sym: "a, b, c, d", desc: "Konstante / lineare / quadratische / kubische Koeffizienten" },
            { sym: "K'(x)", desc: "Grenzkosten = 1. Ableitung von K nach x (€/Stück)" },
            { sym: "k(x)", desc: "Durchschnittliche Stückkosten = K(x)/x (€/Stück)" },
          ]}
          formulas={[
            { expr: "K'(x) = b - 2c\\,x + 3d\\,x^{2}", desc: "1. Ableitung gibt die Kostensteigerung pro zusätzlich produzierter Einheit." },
            { expr: "k(x) = \\dfrac{K(x)}{x}", desc: "Durchschnittliche Stückkosten: Gesamtkosten auf die Menge umgelegt." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow
            id="Kstrich"
            label="Grenzkosten K'(x) (€/Stück)"
            value={raw.Kstrich}
            onChange={setField("Kstrich")}
            inputError={inputErrors.Kstrich}
            checkStatus={checkResult?.fields.Kstrich}
            format={eur}
          />
          <FieldRow
            id="kAvg"
            label="Stückkosten k(x) (€/Stück)"
            value={raw.kAvg}
            onChange={setField("kAvg")}
            inputError={inputErrors.kAvg}
            checkStatus={checkResult?.fields.kAvg}
            format={eur}
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={
        <PolynomGrenzkostenSolutionView params={params} solution={solution} />
      }
    />
  );
}

export function PolynomGrenzkostenSolutionView({
  params,
  solution,
}: {
  params: PolynomGrenzkostenParams;
  solution: PolynomGrenzkostenSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Formula
        expr={`K(${params.x}) = ${solution.Kx}`}
      />
      <Formula
        expr={`K'(${params.x}) = ${params.b} - 2\\cdot ${params.c}\\cdot ${params.x} + 3\\cdot ${params.d}\\cdot ${params.x}^{2} = ${solution.Kstrich}`}
      />
      <Formula
        expr={`k(${params.x}) = \\dfrac{${solution.Kx}}{${params.x}} = ${solution.kAvg}`}
      />
    </div>
  );
}
