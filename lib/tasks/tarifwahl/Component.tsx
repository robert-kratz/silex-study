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
import { Input } from "@/components/ui/input";
import { Formula } from "@/components/Formula";
import { cn } from "@/lib/utils";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import {
  eur,
  fmt,
  parseLocaleNumber,
} from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { TarifwahlParams, TarifwahlSolution } from "./generate";
import { checkTarifwahl, type TarifwahlAnswer } from "./check";
import { buildTarifwahlPrompt } from "./prompt";
import { validateTarifwahlInput } from "./validate";

export function TarifwahlComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<TarifwahlParams, TarifwahlSolution>) {
  const blank = React.useMemo<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    params.mengen.forEach((_, i) => {
      o[`tarif${i}`] = "";
      o[`k${i}`] = "";
    });
    return o;
  }, [params.mengen]);

  const [raw, setRaw] = React.useState<Record<string, string>>(blank);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateTarifwahlInput(raw, params.mengen.length);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const answer: TarifwahlAnswer = {
      tarif: params.mengen.map((_, i) => {
        const v = raw[`tarif${i}`];
        return v === "A" || v === "B" || v === "C" ? v : null;
      }),
      stueckkosten: params.mengen.map((_, i) => parseLocaleNumber(raw[`k${i}`])),
    };
    setCheckResult(checkTarifwahl(solution, answer));
  };

  const onReset = () => {
    setRaw(blank);
    setInputErrors({});
    setCheckResult(null);
  };

  const setField = (key: string, v: string) => {
    setRaw((s) => ({ ...s, [key]: v }));
    if (inputErrors[key]) {
      setInputErrors((s) => {
        const n = { ...s };
        delete n[key];
        return n;
      });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="tarifwahl"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Lösung eingeben"
      description="Vergleiche drei Tarife für unterschiedliche Mengen."
      buildPromptText={() => buildTarifwahlPrompt(params)}
      problem={
        <>
          <p>
            Drei Tarife stehen zur Auswahl. Bestimme für jede Menge den
            günstigsten Tarif sowie die Stückkosten.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarif</TableHead>
                <TableHead className="text-right">Grundgebühr</TableHead>
                <TableHead className="text-right">Variable Kosten / Stück</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(["A", "B", "C"] as const).map((k) => (
                <TableRow key={k}>
                  <TableCell>{k}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {eur(params.tarife[k].fix)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {eur(params.tarife[k].vk)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p>
            Zu prüfende Mengen:{" "}
            <span className="font-medium">
              {params.mengen.map((m) => `${fmt(m)} Stück`).join(", ")}
            </span>
            .
          </p>
        </>
      }
      learnHelp={
        <>
          <Formula expr="K = K_{fix} + k_{var}\cdot x" />
          <Formula expr="k = K / x" />
        </>
      }
      form={
        <div className="space-y-5">
          {params.mengen.map((m, i) => {
            const tarifKey = `tarif${i}`;
            const kKey = `k${i}`;
            const tarifStatus = checkResult?.fields[tarifKey];
            const kStatus = checkResult?.fields[kKey];
            return (
              <div key={i} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                <div className="sm:col-span-2 text-sm font-medium">
                  Menge: {fmt(m)} Stück
                </div>
                <div className="space-y-1.5">
                  <Label>Günstigster Tarif</Label>
                  <div className="flex gap-2">
                    {(["A", "B", "C"] as const).map((opt) => (
                      <label
                        key={opt}
                        className={cn(
                          "cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors",
                          raw[tarifKey] === opt && "border-primary bg-primary/5",
                          tarifStatus?.ok &&
                            tarifStatus.expected === opt &&
                            "border-success bg-success/10",
                          tarifStatus &&
                            !tarifStatus.ok &&
                            raw[tarifKey] === opt &&
                            "border-destructive bg-destructive/5",
                        )}
                      >
                        <input
                          type="radio"
                          name={tarifKey}
                          value={opt}
                          checked={raw[tarifKey] === opt}
                          onChange={() => setField(tarifKey, opt)}
                          className="mr-1"
                        />
                        Tarif {opt}
                      </label>
                    ))}
                  </div>
                  {inputErrors[tarifKey] && (
                    <p className="text-xs text-destructive">{inputErrors[tarifKey]}</p>
                  )}
                  {tarifStatus && !tarifStatus.ok && !inputErrors[tarifKey] && (
                    <p className="text-xs text-destructive">
                      Korrekt wäre: <span className="font-medium">Tarif {tarifStatus.expected}</span>
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={kKey}>Stückkosten (€/Stück)</Label>
                  <Input
                    id={kKey}
                    inputMode="decimal"
                    value={raw[kKey]}
                    onChange={(e) => setField(kKey, e.target.value)}
                    autoComplete="off"
                    aria-invalid={!!inputErrors[kKey] || (kStatus && !kStatus.ok)}
                    className={cn(
                      inputErrors[kKey] && "border-destructive",
                      kStatus?.ok && "border-success",
                      kStatus && !kStatus.ok && !inputErrors[kKey] && "border-destructive",
                    )}
                  />
                  {inputErrors[kKey] && (
                    <p className="text-xs text-destructive">{inputErrors[kKey]}</p>
                  )}
                  {kStatus && !kStatus.ok && !inputErrors[kKey] && (
                    <p className="text-xs text-destructive">
                      Korrekt wäre:{" "}
                      <span className="font-medium">
                        {eur(Number(kStatus.expected))}
                      </span>
                    </p>
                  )}
                  {kStatus?.ok && <p className="text-xs text-success">Korrekt.</p>}
                </div>
              </div>
            );
          })}
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<TarifwahlSolutionView params={params} solution={solution} />}
    />
  );
}

export function TarifwahlSolutionView({
  params,
  solution,
}: {
  params: TarifwahlParams;
  solution: TarifwahlSolution;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Menge</TableHead>
          <TableHead>K_A</TableHead>
          <TableHead>K_B</TableHead>
          <TableHead>K_C</TableHead>
          <TableHead>Günstig.</TableHead>
          <TableHead className="text-right">Stückkosten</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {params.mengen.map((x, i) => {
          const ka = params.tarife.A.fix + params.tarife.A.vk * x;
          const kb = params.tarife.B.fix + params.tarife.B.vk * x;
          const kc = params.tarife.C.fix + params.tarife.C.vk * x;
          const r = solution.results[i];
          return (
            <TableRow key={i}>
              <TableCell>{fmt(x)}</TableCell>
              <TableCell>{eur(ka)}</TableCell>
              <TableCell>{eur(kb)}</TableCell>
              <TableCell>{eur(kc)}</TableCell>
              <TableCell className="font-medium">{r.tarif}</TableCell>
              <TableCell className="text-right tabular-nums">
                {eur(r.stueckkosten)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
