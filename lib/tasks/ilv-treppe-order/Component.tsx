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
import { Label } from "@/components/ui/label";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { fmt } from "@/lib/tasks/_shared/format";
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { IlvTreppeOrderParams } from "./generate";
import type { IlvTreppeOrderSolution } from "./solve";
import { checkIlvTreppeOrder, type IlvTreppeOrderAnswer } from "./check";
import { buildIlvTreppeOrderPrompt } from "./prompt";
import { validateIlvTreppeOrderInput } from "./validate";

const NAMES = ["A", "B", "C", "D"] as const;
type StationKey = `pos${(typeof NAMES)[number]}`;
const FIELDS: StationKey[] = ["posA", "posB", "posC", "posD"];
const BLANK: Record<StationKey, string> = { posA: "", posB: "", posC: "", posD: "" };

export function IlvTreppeOrderComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<IlvTreppeOrderParams, IlvTreppeOrderSolution>) {
  const [raw, setRaw] = React.useState<Record<StationKey, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<StationKey, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateIlvTreppeOrderInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<StationKey, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    // Convert per-station position into per-position station index.
    const order: number[] = Array(4).fill(-1);
    FIELDS.forEach((f, stationIdx) => {
      const pos = Number(raw[f]) - 1;
      order[pos] = stationIdx;
    });
    const ans: IlvTreppeOrderAnswer = { order };
    setCheckResult(checkIlvTreppeOrder(solution, ans));
  };

  const onReset = () => {
    setRaw(BLANK);
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (k: StationKey) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
    }
  };

  // Per-station status (correct iff its station appears at the right position).
  const stationStatus = (stationIdx: number): { ok: boolean; expectedPos: number } | null => {
    if (!checkResult) return null;
    const expectedPos = solution.order.indexOf(stationIdx) + 1;
    const givenPos = Number(raw[FIELDS[stationIdx]]);
    return { ok: givenPos === expectedPos, expectedPos };
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="ilv-treppe-order"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Reihenfolge angeben"
      description="Optimale Treppen-Reihenfolge bei 4 Vorkostenstellen."
      buildPromptText={() => buildIlvTreppeOrderPrompt(params)}
      problem={
        <div className="space-y-3">
          <p className="text-sm">
            Aus 4 Vorkostenstellen ist die Reihenfolge für das Treppenverfahren zu bestimmen.
            <strong> Stelle mit den meisten Abgaben an andere Vorkostenstellen zuerst.</strong>
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>von ↓ / an →</TableHead>
                {NAMES.map((n) => (
                  <TableHead key={n} className="text-right">{n}</TableHead>
                ))}
                <TableHead className="text-right">Endstellen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NAMES.map((n, i) => (
                <TableRow key={n}>
                  <TableCell className="font-medium">{n}</TableCell>
                  {NAMES.map((_, j) => (
                    <TableCell key={j} className="text-right tabular-nums">
                      {i === j ? "—" : fmt(params.matrix[i][j])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right tabular-nums">
                    {fmt(params.endTotals[i])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          {NAMES.map((n, idx) => {
            const key = FIELDS[idx];
            const status = stationStatus(idx);
            const showOk = status?.ok;
            const showErr = status && !status.ok;
            return (
              <div key={n} className="space-y-1.5">
                <Label htmlFor={key}>Position für Stelle {n}</Label>
                <select
                  id={key}
                  value={raw[key]}
                  onChange={setField(key)}
                  aria-invalid={!!inputErrors[key] || !!showErr}
                  className={cn(
                    "h-9 w-full rounded-md border bg-background px-3 text-sm",
                    inputErrors[key] && "border-destructive",
                    showOk && "border-success",
                    showErr && "border-destructive",
                  )}
                >
                  <option value="">– wählen –</option>
                  <option value="1">1 (zuerst)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4 (zuletzt)</option>
                </select>
                {inputErrors[key] && (
                  <p className="text-xs text-destructive">{inputErrors[key]}</p>
                )}
                {showErr && !inputErrors[key] && (
                  <p className="text-xs text-destructive">
                    Korrekt wäre: Position {status!.expectedPos}.
                  </p>
                )}
                {showOk && <p className="text-xs text-success">Korrekt.</p>}
              </div>
            );
          })}
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<IlvTreppeOrderSolutionView params={params} solution={solution} />}
    />
  );
}

export function IlvTreppeOrderSolutionView({
  params,
  solution,
}: {
  params: IlvTreppeOrderParams;
  solution: IlvTreppeOrderSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <p>
        Optimale Reihenfolge:{" "}
        <strong>
          {solution.order.map((i) => params.names[i]).join(" → ")}
        </strong>
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stelle</TableHead>
            <TableHead className="text-right">Abgaben an andere Vorstellen</TableHead>
            <TableHead className="text-right">Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solution.order.map((stationIdx, pos) => (
            <TableRow key={stationIdx}>
              <TableCell className="font-medium">{params.names[stationIdx]}</TableCell>
              <TableCell className="text-right tabular-nums">
                {fmt(solution.rowSums[stationIdx])}
              </TableCell>
              <TableCell className="text-right tabular-nums">{pos + 1}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
