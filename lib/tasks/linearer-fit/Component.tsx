"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { LinearerFitParams, LinearerFitSolution } from "./generate";
import { checkLinearerFit, type LinearerFitAnswer } from "./check";
import { buildLinearerFitPrompt } from "./prompt";
import { validateLinearerFitInput } from "./validate";

type Field = keyof LinearerFitAnswer;
const BLANK: Record<Field, string> = { Kfix: "", kVar: "" };

export function LinearerFitComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<LinearerFitParams, LinearerFitSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateLinearerFitInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: LinearerFitAnswer = {
      Kfix: parseLocaleNumber(raw.Kfix),
      kVar: parseLocaleNumber(raw.kVar),
    };
    setCheckResult(checkLinearerFit(solution, ans));
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
      taskKind="linearer-fit"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Lösung eingeben"
      description="Lineare Kostenfunktion aus Durchschnitts- und Grenzkosten rekonstruieren."
      buildPromptText={() => buildLinearerFitPrompt(params)}
      problem={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Größe</TableHead>
              <TableHead className="text-right">Wert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Auslastung x</TableCell>
              <TableCell className="text-right tabular-nums">{fmt(params.x)} Stück</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Durchschnittskosten k</TableCell>
              <TableCell className="text-right tabular-nums">{eur(params.kDurchschnitt)} / Stück</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grenzkosten k_var</TableCell>
              <TableCell className="text-right tabular-nums">{eur(params.kVar)} / Stück</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
      learnHelp={
        <LearnLegend
          intro="Aus Durchschnittskosten und variablen Grenzkosten lässt sich der Fixkostenblock einer linearen Kostenfunktion herausrechnen."
          variables={[
            { sym: "K(x)", desc: "Gesamtkosten in Abhängigkeit von der Menge x (€)" },
            { sym: "K_{fix}", desc: "Fixkosten der Periode (€)" },
            { sym: "k_{var}", desc: "Variable Stückkosten (€/Stück) = Steigung der Kostengerade" },
            { sym: "k_{\\text{durchschnitt}}", desc: "Durchschnittliche Stückkosten = K(x)/x (€/Stück)" },
            { sym: "x", desc: "Produzierte Menge (Stück)" },
          ]}
          formulas={[
            { expr: "K(x) = K_{fix} + k_{var}\\cdot x", desc: "Lineare Kostenfunktion: Fixkosten plus mengenproportionale variable Kosten." },
            { expr: "K_{fix} = (k_{\\text{durchschnitt}} - k_{var})\\cdot x", desc: "Fixkostenermittlung aus Durchschnitts- und Grenzkosten für eine bekannte Menge." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow
            id="Kfix"
            label="Fixkosten K_fix (€)"
            value={raw.Kfix}
            onChange={setField("Kfix")}
            inputError={inputErrors.Kfix}
            checkStatus={checkResult?.fields.Kfix}
            format={eur}
          />
          <FieldRow
            id="kVar"
            label="Variable Stückkosten k_var (€/Stück)"
            value={raw.kVar}
            onChange={setField("kVar")}
            inputError={inputErrors.kVar}
            checkStatus={checkResult?.fields.kVar}
            format={eur}
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<LinearerFitSolutionView params={params} solution={solution} />}
    />
  );
}

export function LinearerFitSolutionView({
  params,
  solution,
}: {
  params: LinearerFitParams;
  solution: LinearerFitSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Formula
        expr={`k_{var} = ${params.kVar}\\;(\\text{Grenzkosten})`}
      />
      <Formula
        expr={`K_{fix} = (${params.kDurchschnitt} - ${params.kVar})\\cdot ${params.x} = ${solution.Kfix}`}
      />
      <Formula
        expr={`K(x) = ${solution.Kfix} + ${solution.kVar}\\cdot x`}
      />
    </div>
  );
}
