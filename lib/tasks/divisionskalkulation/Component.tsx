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
import type { DivisionskalkulationParams } from "./generate";
import type { DivisionskalkulationSolution } from "./solve";
import {
  checkDivisionskalkulation,
  type DivisionskalkulationAnswer,
} from "./check";
import { buildDivisionskalkulationPrompt } from "./prompt";
import { validateDivisionskalkulationInput } from "./validate";

type Field = keyof DivisionskalkulationAnswer;
const BLANK: Record<Field, string> = {
  k1: "", M2in: "", k2: "", absatz: "", kVertrieb: "",
};

export function DivisionskalkulationComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<DivisionskalkulationParams, DivisionskalkulationSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateDivisionskalkulationInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: DivisionskalkulationAnswer = {
      k1: parseLocaleNumber(raw.k1),
      M2in: parseLocaleNumber(raw.M2in),
      k2: parseLocaleNumber(raw.k2),
      absatz: parseLocaleNumber(raw.absatz),
      kVertrieb: parseLocaleNumber(raw.kVertrieb),
    };
    setCheckResult(checkDivisionskalkulation(solution, ans));
  };

  const onReset = () => {
    setRaw(BLANK);
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
      taskKind="divisionskalkulation"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Stufenkalkulation – Eingabe"
      description="Mehrstufige Divisionskalkulation mit Lagerveränderung."
      buildPromptText={() => buildDivisionskalkulationPrompt(params)}
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
              <TableCell>Ausgangsmenge Stufe 1 (M_1)</TableCell>
              <TableCell className="text-right tabular-nums">{fmt(params.M1)} Stück</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Kosten Stufe 1 (PK_1)</TableCell>
              <TableCell className="text-right tabular-nums">{eur(params.PK1)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lagerveränderung Halbfabrikate (ΔL_1)</TableCell>
              <TableCell className="text-right tabular-nums">{fmt(params.dL1)} Stück</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Kosten Stufe 2 (PK_2)</TableCell>
              <TableCell className="text-right tabular-nums">{eur(params.PK2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lagerveränderung Fertigfabrikate (ΔL_2)</TableCell>
              <TableCell className="text-right tabular-nums">{fmt(params.dL2)} Stück</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vertriebskosten (PK_v)</TableCell>
              <TableCell className="text-right tabular-nums">{eur(params.PKv)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
      learnHelp={
        <>
          <Formula expr="k_1 = \dfrac{PK_1}{M_1}" />
          <Formula expr="M_2^{Eingang} = M_1 - \Delta L_1" />
          <Formula expr="k_2 = \dfrac{PK_2 + k_1 \cdot M_2^{Eingang}}{M_2^{Eingang}}" />
          <Formula expr="M^{Absatz} = M_2^{Eingang} - \Delta L_2" />
          <Formula expr="k_{Vertrieb} = k_2 + \dfrac{PK_v}{M^{Absatz}}" />
        </>
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow id="k1" label="k_1 (€/Stück)" value={raw.k1}
            onChange={setField("k1")} inputError={inputErrors.k1}
            checkStatus={checkResult?.fields.k1} format={eur} />
          <FieldRow id="M2in" label="Eingangsmenge Stufe 2 (Stück)" value={raw.M2in}
            onChange={setField("M2in")} inputError={inputErrors.M2in}
            checkStatus={checkResult?.fields.M2in} format={fmt} />
          <FieldRow id="k2" label="k_2 kumuliert (€/Stück)" value={raw.k2}
            onChange={setField("k2")} inputError={inputErrors.k2}
            checkStatus={checkResult?.fields.k2} format={eur} />
          <FieldRow id="absatz" label="Absatzmenge (Stück)" value={raw.absatz}
            onChange={setField("absatz")} inputError={inputErrors.absatz}
            checkStatus={checkResult?.fields.absatz} format={fmt} />
          <FieldRow id="kVertrieb" label="Selbstkosten / Einheit (€)" value={raw.kVertrieb}
            onChange={setField("kVertrieb")} inputError={inputErrors.kVertrieb}
            checkStatus={checkResult?.fields.kVertrieb} format={eur}
            className="sm:col-span-2" />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<DivisionskalkulationSolutionView params={params} solution={solution} />}
    />
  );
}

export function DivisionskalkulationSolutionView({
  params,
  solution,
}: {
  params: DivisionskalkulationParams;
  solution: DivisionskalkulationSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <Formula expr={`k_1 = \\frac{${params.PK1}}{${params.M1}} = ${solution.k1}`} />
      <Formula expr={`M_2^{Eingang} = ${params.M1} - ${params.dL1} = ${solution.M2in}`} />
      <Formula
        expr={`k_2 = \\frac{${params.PK2} + ${solution.k1}\\cdot ${solution.M2in}}{${solution.M2in}} = ${solution.k2}`}
      />
      <Formula expr={`M^{Absatz} = ${solution.M2in} - ${params.dL2} = ${solution.absatz}`} />
      <Formula
        expr={`k_{Vertrieb} = ${solution.k2} + \\frac{${params.PKv}}{${solution.absatz}} = ${solution.kVertrieb}`}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Größe</TableHead>
            <TableHead className="text-right">Wert</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>k_1</TableCell><TableCell className="text-right tabular-nums">{eur(solution.k1)}</TableCell></TableRow>
          <TableRow><TableCell>Eingangsmenge Stufe 2</TableCell><TableCell className="text-right tabular-nums">{fmt(solution.M2in)}</TableCell></TableRow>
          <TableRow><TableCell>k_2</TableCell><TableCell className="text-right tabular-nums">{eur(solution.k2)}</TableCell></TableRow>
          <TableRow><TableCell>Absatzmenge</TableCell><TableCell className="text-right tabular-nums">{fmt(solution.absatz)}</TableCell></TableRow>
          <TableRow><TableCell>Selbstkosten / Einheit</TableCell><TableCell className="text-right tabular-nums">{eur(solution.kVertrieb)}</TableCell></TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
