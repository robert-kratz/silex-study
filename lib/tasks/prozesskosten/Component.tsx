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
import type { ProzesskostenParams } from "./generate";
import type { ProzesskostenSolution } from "./solve";
import { checkProzesskosten, type ProzesskostenAnswer } from "./check";
import { buildProzesskostenPrompt } from "./prompt";
import { validateProzesskostenInput } from "./validate";

const NPROZ = 3;
const NAUF = 2;

const blank = (): Record<string, string> => {
  const o: Record<string, string> = {};
  for (let i = 0; i < NPROZ; i++) o[`PKS${i}`] = "";
  for (let i = 0; i < NAUF; i++) o[`A${i}`] = "";
  return o;
};

export function ProzesskostenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<ProzesskostenParams, ProzesskostenSolution>) {
  const [raw, setRaw] = React.useState<Record<string, string>>(blank());
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateProzesskostenInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: ProzesskostenAnswer = {
      PKS: Array.from({ length: NPROZ }, (_, i) => parseLocaleNumber(raw[`PKS${i}`])),
      auftragKosten: Array.from({ length: NAUF }, (_, i) => parseLocaleNumber(raw[`A${i}`])),
    };
    setCheckResult(checkProzesskosten(solution, ans));
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
      taskKind="prozesskosten"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Prozesskostenrechnung – Eingabe"
      description="Prozesskostensätze und Auftragskosten berechnen."
      buildPromptText={() => buildProzesskostenPrompt(params)}
      problem={
        <div className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prozess</TableHead>
                <TableHead className="text-right">Prozesskosten</TableHead>
                <TableHead className="text-right">Prozessmenge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.prozesse.map((x) => (
                <TableRow key={x.name}>
                  <TableCell className="font-medium">{x.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(x.K)}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(x.M)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auftrag</TableHead>
                {params.prozesse.map((p) => (
                  <TableHead key={p.name} className="text-right">{p.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.auftraege.map((a) => (
                <TableRow key={a.name}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  {a.inanspruchnahme.map((m, i) => (
                    <TableCell key={i} className="text-right tabular-nums">{fmt(m)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <>
          <Formula expr="\text{PKS}_p = \dfrac{K_p}{M_p}" />
          <Formula expr="K_{Auftrag} = \sum_p \text{PKS}_p \cdot m_{p,Auftrag}" />
        </>
      }
      form={
        <div className="space-y-4">
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Prozesskostensätze
            </legend>
            <div className="grid gap-4 sm:grid-cols-3">
              {params.prozesse.map((p, i) => (
                <FieldRow key={p.name} id={`PKS${i}`} label={`PKS ${p.name} (€)`}
                  value={raw[`PKS${i}`]} onChange={setField(`PKS${i}`)}
                  inputError={inputErrors[`PKS${i}`]}
                  checkStatus={checkResult?.fields[`PKS${i}`]} format={eur} />
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Auftragskosten
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {params.auftraege.map((a, i) => (
                <FieldRow key={a.name} id={`A${i}`} label={`Kosten ${a.name} (€)`}
                  value={raw[`A${i}`]} onChange={setField(`A${i}`)}
                  inputError={inputErrors[`A${i}`]}
                  checkStatus={checkResult?.fields[`A${i}`]} format={eur} />
              ))}
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<ProzesskostenSolutionView params={params} solution={solution} />}
    />
  );
}

export function ProzesskostenSolutionView({
  params,
  solution,
}: {
  params: ProzesskostenParams;
  solution: ProzesskostenSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prozess</TableHead>
            <TableHead className="text-right">PKS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.prozesse.map((p, i) => (
            <TableRow key={p.name}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.PKS[i])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auftrag</TableHead>
            <TableHead className="text-right">Gesamtkosten</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.auftraege.map((a, i) => (
            <TableRow key={a.name}>
              <TableCell className="font-medium">{a.name}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.auftragKosten[i])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
