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
import type { IlvTreppeParams } from "./generate";
import type { IlvTreppeSolution } from "./solve";
import { checkIlvTreppe, type IlvTreppeAnswer } from "./check";
import { buildIlvTreppePrompt } from "./prompt";
import { validateIlvTreppeInput } from "./validate";

type Field = keyof IlvTreppeAnswer;
const BLANK: Record<Field, string> = { kA: "", kB: "", kC: "", E1: "", E2: "" };

export function IlvTreppeComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<IlvTreppeParams, IlvTreppeSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateIlvTreppeInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: IlvTreppeAnswer = {
      kA: parseLocaleNumber(raw.kA),
      kB: parseLocaleNumber(raw.kB),
      kC: parseLocaleNumber(raw.kC),
      E1: parseLocaleNumber(raw.E1),
      E2: parseLocaleNumber(raw.E2),
    };
    setCheckResult(checkIlvTreppe(solution, ans));
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
      taskKind="ilv-treppe"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Treppenumlage"
      description="Stufenweise Verrechnung in fester Reihenfolge A → B → C."
      buildPromptText={() => buildIlvTreppePrompt(params)}
      problem={
        <div className="space-y-2">
          <p>
            Primärkosten: PK(A) = <strong>{eur(params.PK.A)}</strong>, PK(B) = <strong>{eur(params.PK.B)}</strong>, PK(C) = <strong>{eur(params.PK.C)}</strong>.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>von ↓ / an →</TableHead>
                <TableHead className="text-right">B</TableHead>
                <TableHead className="text-right">C</TableHead>
                <TableHead className="text-right">E1</TableHead>
                <TableHead className="text-right">E2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">A</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.A.b)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.A.c)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.A.e1)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.A.e2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">B</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.B.c)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.B.e1)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.B.e2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">C</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.C.e1)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.C.e2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Treppen-/Stufenleiterverfahren für drei Vorkostenstellen: Die Stellen werden in eine Reihenfolge gebracht; jede Stelle gibt nur an nachgelagerte Stellen ab. Rückläufige Leistungen werden ignoriert."
          variables={[
            { sym: "PK_A, PK_B, PK_C", desc: "Primäre Kosten der Vorkostenstellen A, B, C (€)" },
            { sym: "x_{AB}, x_{AC}, x_{BC}", desc: "Innerbetriebliche Leistungen entlang der Treppe" },
            { sym: "x_{AE_i}, x_{BE_i}, x_{CE_i}", desc: "Leistungen der Vorstellen an die Endkostenstellen E_i" },
            { sym: "k_A, k_B, k_C", desc: "Verrechnungspreise der Stellen A, B, C (€/Einheit)" },
          ]}
          formulas={[
            { expr: "k_A = \\dfrac{PK_A}{x_{AB} + x_{AC} + x_{AE_1} + x_{AE_2}}", desc: "Stelle A wird zuerst abgerechnet: Primärkosten auf alle abgegebenen Leistungen verteilen." },
            { expr: "k_B = \\dfrac{PK_B + x_{AB}\\cdot k_A}{x_{BC} + x_{BE_1} + x_{BE_2}}", desc: "Stelle B übernimmt Belastungen von A; die Rückleistung B → A bleibt unberücksichtigt." },
            { expr: "k_C = \\dfrac{PK_C + x_{AC}\\cdot k_A + x_{BC}\\cdot k_B}{x_{CE_1} + x_{CE_2}}", desc: "Stelle C nimmt Leistungen aus A und B auf, gibt aber nur an Endstellen ab." },
          ]}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldRow id="kA" label="k_A (€/Einheit)" value={raw.kA}
            onChange={setField("kA")} inputError={inputErrors.kA}
            checkStatus={checkResult?.fields.kA} format={eur} />
          <FieldRow id="kB" label="k_B (€/Einheit)" value={raw.kB}
            onChange={setField("kB")} inputError={inputErrors.kB}
            checkStatus={checkResult?.fields.kB} format={eur} />
          <FieldRow id="kC" label="k_C (€/Einheit)" value={raw.kC}
            onChange={setField("kC")} inputError={inputErrors.kC}
            checkStatus={checkResult?.fields.kC} format={eur} />
          <FieldRow id="E1" label="Belastung E1 (€)" value={raw.E1}
            onChange={setField("E1")} inputError={inputErrors.E1}
            checkStatus={checkResult?.fields.E1} format={eur} />
          <FieldRow id="E2" label="Belastung E2 (€)" value={raw.E2}
            onChange={setField("E2")} inputError={inputErrors.E2}
            checkStatus={checkResult?.fields.E2} format={eur} />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<IlvTreppeSolutionView solution={solution} />}
    />
  );
}

export function IlvTreppeSolutionView({
  solution,
}: {
  solution: IlvTreppeSolution;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Größe</TableHead>
          <TableHead className="text-right">Wert</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow><TableCell>k_A</TableCell><TableCell className="text-right tabular-nums">{eur(solution.kA)}</TableCell></TableRow>
        <TableRow><TableCell>k_B</TableCell><TableCell className="text-right tabular-nums">{eur(solution.kB)}</TableCell></TableRow>
        <TableRow><TableCell>k_C</TableCell><TableCell className="text-right tabular-nums">{eur(solution.kC)}</TableCell></TableRow>
        <TableRow><TableCell>E1</TableCell><TableCell className="text-right tabular-nums">{eur(solution.E1)}</TableCell></TableRow>
        <TableRow><TableCell>E2</TableCell><TableCell className="text-right tabular-nums">{eur(solution.E2)}</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}
