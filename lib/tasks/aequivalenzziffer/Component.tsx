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
import { eur, fmt, fmt4, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { AequivalenzzifferParams } from "./generate";
import type { AequivalenzzifferSolution } from "./solve";
import {
  checkAequivalenzziffer,
  type AequivalenzzifferAnswer,
} from "./check";
import { buildAequivalenzzifferPrompt } from "./prompt";
import { validateAequivalenzzifferInput } from "./validate";

const N = 3;

type Field = string;
const initialBlank = (): Record<Field, string> => {
  const o: Record<Field, string> = {};
  for (let i = 0; i < N; i++) {
    o[`AZ${i}`] = "";
    o[`S${i}`] = "";
    o[`k${i}`] = "";
  }
  return o;
};

export function AequivalenzzifferComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<AequivalenzzifferParams, AequivalenzzifferSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(initialBlank());
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateAequivalenzzifferInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: AequivalenzzifferAnswer = {
      AZ: Array.from({ length: N }, (_, i) => parseLocaleNumber(raw[`AZ${i}`])),
      S: Array.from({ length: N }, (_, i) => parseLocaleNumber(raw[`S${i}`])),
      k: Array.from({ length: N }, (_, i) => parseLocaleNumber(raw[`k${i}`])),
    };
    setCheckResult(checkAequivalenzziffer(solution, ans));
  };

  const onReset = () => {
    setRaw(initialBlank());
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="aequivalenzziffer"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Äquivalenzziffernrechnung – Eingabe"
      description="Sortenfertigung mit Äquivalenzziffer, Schlüsselzahl und Stückkosten."
      buildPromptText={() => buildAequivalenzzifferPrompt(params)}
      problem={
        <div className="space-y-2">
          <p className="text-sm">
            Grundsorte: <strong>{params.sorten[params.grundIdx].name}</strong>;
            Gesamtkosten <strong>{eur(params.K)}</strong>.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sorte</TableHead>
                <TableHead className="text-right">Länge</TableHead>
                <TableHead className="text-right">Breite</TableHead>
                <TableHead className="text-right">Stückzahl</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.sorten.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(s.L)} cm</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(s.B)} cm</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(s.menge)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <>
          <Formula expr="\text{Ä}Z_i = \dfrac{L_i \cdot B_i}{L_{\text{Grund}}\cdot B_{\text{Grund}}}" />
          <Formula expr="S_i = \text{Stückzahl}_i \cdot \text{Ä}Z_i" />
          <Formula expr="k_i = \dfrac{K}{\sum_i S_i} \cdot \text{Ä}Z_i" />
        </>
      }
      form={
        <div className="space-y-4">
          {params.sorten.map((s, i) => (
            <fieldset key={s.name} className="space-y-2 rounded-lg border p-4">
              <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sorte {s.name}
              </legend>
              <div className="grid gap-4 sm:grid-cols-3">
                <FieldRow id={`AZ${i}`} label="ÄZ" value={raw[`AZ${i}`]}
                  onChange={setField(`AZ${i}`)} inputError={inputErrors[`AZ${i}`]}
                  checkStatus={checkResult?.fields[`AZ${i}`]} format={fmt4} />
                <FieldRow id={`S${i}`} label="Schlüsselzahl S" value={raw[`S${i}`]}
                  onChange={setField(`S${i}`)} inputError={inputErrors[`S${i}`]}
                  checkStatus={checkResult?.fields[`S${i}`]} format={fmt} />
                <FieldRow id={`k${i}`} label="Stückkosten k (€)" value={raw[`k${i}`]}
                  onChange={setField(`k${i}`)} inputError={inputErrors[`k${i}`]}
                  checkStatus={checkResult?.fields[`k${i}`]} format={eur} />
              </div>
            </fieldset>
          ))}
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<AequivalenzzifferSolutionView params={params} solution={solution} />}
    />
  );
}

export function AequivalenzzifferSolutionView({
  params,
  solution,
}: {
  params: AequivalenzzifferParams;
  solution: AequivalenzzifferSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <p>
        Σ S = <strong>{fmt(solution.sumS)}</strong>, K / Σ S = <strong>{eur(solution.kBezug)}</strong>.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sorte</TableHead>
            <TableHead className="text-right">ÄZ</TableHead>
            <TableHead className="text-right">S</TableHead>
            <TableHead className="text-right">k</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.sorten.map((s, i) => (
            <TableRow key={s.name}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell className="text-right tabular-nums">{fmt4(solution.rows[i].AZ)}</TableCell>
              <TableCell className="text-right tabular-nums">{fmt(solution.rows[i].S)}</TableCell>
              <TableCell className="text-right tabular-nums">{eur(solution.rows[i].k)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
