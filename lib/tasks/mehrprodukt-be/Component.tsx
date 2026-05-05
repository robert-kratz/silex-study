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
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { MehrproduktBeParams } from "./generate";
import type { MehrproduktBeSolution } from "./solve";
import { checkMehrproduktBe, type MehrproduktBeAnswer } from "./check";
import { buildMehrproduktBePrompt } from "./prompt";
import { validateMehrproduktBeInput } from "./validate";

const BLANK = { x1: "", x2: "", hoehererDb: "" };

export function MehrproduktBeComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<MehrproduktBeParams, MehrproduktBeSolution>) {
  const [raw, setRaw] = React.useState(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateMehrproduktBeInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: MehrproduktBeAnswer = {
      x1: parseLocaleNumber(raw.x1),
      x2: parseLocaleNumber(raw.x2),
      hoehererDb: raw.hoehererDb,
    };
    setCheckResult(checkMehrproduktBe(solution, ans));
  };

  const onReset = () => { setRaw(BLANK); setInputErrors({}); setCheckResult(null); };

  const setField = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
  };

  const dbStatus = checkResult?.fields.hoehererDb;
  const DB_OPTIONS = [
    { value: "1", label: `${params.produkte[0].name}` },
    { value: "2", label: `${params.produkte[1].name}` },
  ];

  return (
    <TaskShell
      courseId={courseId}
      taskKind="mehrprodukt-be"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Mehrprodukt-Break-Even"
      description="Break-Even-Mengen bei festem Verkaufsverhältnis."
      buildPromptText={() => buildMehrproduktBePrompt(params)}
      problem={
        <div className="space-y-2">
          <p className="text-sm">
            Fixkosten K_f = <strong>{eur(params.Kf)}</strong>, Verkaufsverhältnis v = x_1/x_2 = <strong>{params.v}</strong>
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produkt</TableHead>
                <TableHead className="text-right">Preis</TableHead>
                <TableHead className="text-right">k_var</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.produkte.map((x) => (
                <TableRow key={x.name}>
                  <TableCell className="font-medium">{x.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(x.preis)}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(x.kv)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <>
          <Formula expr="d_i = p_i - k_{v,i}" />
          <Formula expr="x_1 = \dfrac{K_f}{d_1 + d_2/v},\quad x_2 = \dfrac{x_1}{v}" />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldRow id="x1" label="Break-Even-Menge x₁ (Stück)"
              value={raw.x1} onChange={setField("x1")}
              inputError={inputErrors.x1} checkStatus={checkResult?.fields.x1} format={fmt} />
            <FieldRow id="x2" label="Break-Even-Menge x₂ (Stück)"
              value={raw.x2} onChange={setField("x2")}
              inputError={inputErrors.x2} checkStatus={checkResult?.fields.x2} format={fmt} />
          </div>
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Welches Produkt hat den höheren Stückdeckungsbeitrag?
            </legend>
            <div className="space-y-1.5">
              {DB_OPTIONS.map((u) => {
                const isCorrect = dbStatus && u.value === dbStatus.expected;
                const isWrongPick = dbStatus && !dbStatus.ok && raw.hoehererDb === u.value;
                return (
                  <label key={u.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      raw.hoehererDb === u.value && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/5",
                      isWrongPick && "border-destructive bg-destructive/5",
                    )}>
                    <input type="radio" className="mt-1" name="hoehererDb" value={u.value}
                      checked={raw.hoehererDb === u.value}
                      onChange={() => {
                        setRaw((s) => ({ ...s, hoehererDb: u.value }));
                        if (inputErrors.hoehererDb) setInputErrors((s) => { const n = { ...s }; delete n.hoehererDb; return n; });
                      }} />
                    <span>{u.label}</span>
                  </label>
                );
              })}
              {inputErrors.hoehererDb && <p className="text-xs text-destructive">{inputErrors.hoehererDb}</p>}
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<MehrproduktBeSolutionView params={params} solution={solution} />}
    />
  );
}

export function MehrproduktBeSolutionView({
  params,
  solution,
}: {
  params: MehrproduktBeParams;
  solution: MehrproduktBeSolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <Formula expr={`d_1 = ${solution.d1},\\quad d_2 = ${solution.d2}`} />
      <Formula expr={`x_1 = ${solution.x1},\\quad x_2 = ${solution.x2}`} />
      <p>
        Höherer Stückdeckungsbeitrag: <strong>{params.produkte[Number(solution.hoehererDb) - 1].name}</strong>
      </p>
    </div>
  );
}
