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
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { KuppelMarktwertParams } from "./generate";
import type { KuppelMarktwertSolution } from "./solve";
import {
  checkKuppelMarktwert,
  type KuppelMarktwertAnswer,
} from "./check";
import { buildKuppelMarktwertPrompt } from "./prompt";
import { validateKuppelMarktwertInput } from "./validate";

const N = 3;

const blank = (): Record<string, string> => {
  const o: Record<string, string> = {};
  for (let i = 0; i < N; i++) {
    o[`anteil${i}`] = "";
    o[`k${i}`] = "";
  }
  return o;
};

export function KuppelMarktwertComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<KuppelMarktwertParams, KuppelMarktwertSolution>) {
  const [raw, setRaw] = React.useState<Record<string, string>>(blank());
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<import("@/lib/tasks/types").CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateKuppelMarktwertInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: KuppelMarktwertAnswer = {
      anteil: Array.from({ length: N }, (_, i) => parseLocaleNumber(raw[`anteil${i}`])),
      k: Array.from({ length: N }, (_, i) => parseLocaleNumber(raw[`k${i}`])),
    };
    setCheckResult(checkKuppelMarktwert(solution, ans));
  };

  const onReset = () => {
    setRaw(blank());
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="kuppel-marktwert"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Marktwertmethode – Eingabe"
      description="Kuppelkosten im Verhältnis der Markterlöse aufteilen."
      buildPromptText={() => buildKuppelMarktwertPrompt(params)}
      problem={
        <div className="space-y-2">
          <p className="text-sm">Kuppelkosten K = <strong>{eur(params.K)}</strong>.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead className="text-right">Menge</TableHead>
                <TableHead className="text-right">Preis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.produkte.map((x) => (
                <TableRow key={x.name}>
                  <TableCell className="font-medium">{x.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(x.menge)}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(x.preis)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <>
          <Formula expr="\text{Anteil}_i = \dfrac{E_i}{\sum_j E_j} \cdot K" />
          <Formula expr="k_i = \dfrac{\text{Anteil}_i}{Menge_i}" />
        </>
      }
      form={
        <div className="space-y-4">
          {params.produkte.map((x, i) => (
            <fieldset key={x.name} className="space-y-2 rounded-lg border p-4">
              <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {x.name}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow id={`anteil${i}`} label="Anteil an Kuppelkosten (€)"
                  value={raw[`anteil${i}`]} onChange={setField(`anteil${i}`)}
                  inputError={inputErrors[`anteil${i}`]}
                  checkStatus={checkResult?.fields[`anteil${i}`]} format={eur} />
                <FieldRow id={`k${i}`} label="Stückkosten (€)"
                  value={raw[`k${i}`]} onChange={setField(`k${i}`)}
                  inputError={inputErrors[`k${i}`]}
                  checkStatus={checkResult?.fields[`k${i}`]} format={eur} />
              </div>
            </fieldset>
          ))}
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<KuppelMarktwertSolutionView params={params} solution={solution} />}
    />
  );
}

export function KuppelMarktwertSolutionView({
  params,
  solution,
}: {
  params: KuppelMarktwertParams;
  solution: KuppelMarktwertSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <p>Σ Erlöse = <strong>{eur(solution.sumErloese)}</strong>.</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produkt</TableHead>
            <TableHead className="text-right">Erlös</TableHead>
            <TableHead className="text-right">Anteil</TableHead>
            <TableHead className="text-right">k</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.produkte.map((x, i) => (
            <TableRow key={x.name}>
              <TableCell className="font-medium">{x.name}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(x.menge * x.preis)}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.rows[i].anteil)}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.rows[i].k)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
