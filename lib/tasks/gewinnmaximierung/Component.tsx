"use client";

import * as React from "react";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type {
  GewinnmaximierungParams,
  GewinnmaximierungSolution,
} from "./generate";
import {
  checkGewinnmaximierung,
  type GewinnmaximierungAnswer,
} from "./check";
import { buildGewinnmaximierungPrompt } from "./prompt";
import { validateGewinnmaximierungInput } from "./validate";

type Field = keyof GewinnmaximierungAnswer;
const BLANK: Record<Field, string> = { xStar: "", pi: "" };

export function GewinnmaximierungComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<GewinnmaximierungParams, GewinnmaximierungSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateGewinnmaximierungInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: GewinnmaximierungAnswer = {
      xStar: parseLocaleNumber(raw.xStar),
      pi: parseLocaleNumber(raw.pi),
    };
    setCheckResult(checkGewinnmaximierung(solution, ans));
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
      taskKind="gewinnmaximierung"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Lösung eingeben"
      description="Gewinnmaximaler Inputeinsatz und maximaler Gewinn."
      buildPromptText={() => buildGewinnmaximierungPrompt(params)}
      problem={
        <div className="space-y-2">
          <p>
            Produktionsfunktion <Formula block={false} expr={`f(x) = ${params.a}\\sqrt{x}`} />,
            Marktpreis p = {eur(params.p)}, Lohnsatz w = {eur(params.w)}.
          </p>
          <p>
            Berechne den gewinnmaximalen Inputeinsatz x* sowie den maximalen Gewinn π*.
          </p>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Gewinnmaximierung mit Wurzelproduktionsfunktion: Aus dem Optimalitätskriterium π′(x)=0 wird der gewinnmaximale Inputeinsatz x* analytisch bestimmt."
          variables={[
            { sym: "x", desc: "Eingesetzte Inputmenge (z. B. Faktorstunden)" },
            { sym: "a", desc: "Produktivitätskonstante der Produktionsfunktion y = a\u221ax" },
            { sym: "p", desc: "Outputpreis (€ pro Outputeinheit)" },
            { sym: "w", desc: "Inputpreis (€ pro Inputeinheit)" },
            { sym: "\\pi(x)", desc: "Gewinnfunktion (€)" },
            { sym: "x^*", desc: "Gewinnmaximaler Inputeinsatz" },
          ]}
          formulas={[
            { expr: "\\pi(x) = p\\cdot a\\sqrt{x} - w\\cdot x", desc: "Gewinn = Erlös minus Faktorkosten bei Wurzelproduktionsfunktion." },
            { expr: "\\pi'(x) = \\frac{p\\cdot a}{2\\sqrt{x}} - w \\stackrel{!}{=} 0", desc: "Bedingung erster Ordnung: Grenzerlös = Grenzkosten." },
            { expr: "x^* = \\left(\\frac{p\\cdot a}{2w}\\right)^2", desc: "Aufgelöst nach x: gewinnmaximaler Inputeinsatz." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow
            id="xStar"
            label="Optimaler Inputeinsatz x*"
            value={raw.xStar}
            onChange={setField("xStar")}
            inputError={inputErrors.xStar}
            checkStatus={checkResult?.fields.xStar}
            format={fmt}
          />
          <FieldRow
            id="pi"
            label="Maximaler Gewinn π* (€)"
            value={raw.pi}
            onChange={setField("pi")}
            inputError={inputErrors.pi}
            checkStatus={checkResult?.fields.pi}
            format={eur}
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={
        <GewinnmaximierungSolutionView params={params} solution={solution} />
      }
    />
  );
}

export function GewinnmaximierungSolutionView({
  params,
  solution,
}: {
  params: GewinnmaximierungParams;
  solution: GewinnmaximierungSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Formula
        expr={`x^* = \\left(\\frac{${params.p}\\cdot ${params.a}}{2\\cdot ${params.w}}\\right)^2 = ${solution.xStar}`}
      />
      <Formula
        expr={`f(x^*) = ${params.a}\\sqrt{${solution.xStar}} = ${solution.outputStar}`}
      />
      <Formula
        expr={`\\pi^* = ${params.p}\\cdot ${solution.outputStar} - ${params.w}\\cdot ${solution.xStar} = ${solution.pi}`}
      />
    </div>
  );
}
