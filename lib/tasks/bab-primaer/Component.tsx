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
import { Input } from "@/components/ui/input";
import { Formula } from "@/components/Formula";
import { cn } from "@/lib/utils";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { BabPrimaerParams } from "./generate";
import type { BabPrimaerSolution } from "./solve";
import { checkBabPrimaer, fieldKey, type BabPrimaerAnswer } from "./check";
import { buildBabPrimaerPrompt } from "./prompt";
import { validateBabPrimaerInput } from "./validate";

export function BabPrimaerComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<BabPrimaerParams, BabPrimaerSolution>) {
  const blank = React.useMemo<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    params.kostenarten.forEach((_, i) => {
      params.stellen.forEach((_s, j) => (o[fieldKey(i, j)] = ""));
    });
    return o;
  }, [params.kostenarten, params.stellen]);

  const [raw, setRaw] = React.useState<Record<string, string>>(blank);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateBabPrimaerInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const answer: BabPrimaerAnswer = params.kostenarten.map((_, i) =>
      params.stellen.map((_s, j) => parseLocaleNumber(raw[fieldKey(i, j)])),
    );
    setCheckResult(checkBabPrimaer(solution, answer));
  };

  const onReset = () => {
    setRaw(blank);
    setInputErrors({});
    setCheckResult(null);
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="bab-primaer"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Primärkostenverteilung"
      description="Beträge der Kostenarten auf die Kostenstellen verteilen."
      buildPromptText={() => buildBabPrimaerPrompt(params)}
      problem={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kostenart</TableHead>
              <TableHead className="text-right">Betrag</TableHead>
              {params.stellen.map((s) => (
                <TableHead key={s} className="text-right">
                  Schl. {s}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.kostenarten.map((ka, i) => (
              <TableRow key={i}>
                <TableCell>{ka.name}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(ka.betrag)}</TableCell>
                {params.schluessel[i].map((s, j) => (
                  <TableCell key={j} className="text-right tabular-nums">
                    {fmt(s)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      learnHelp={
        <div className="space-y-2 text-sm">
          <p>Umlagesatz pro Kostenart:</p>
          <Formula expr="u_j = \dfrac{\text{Betrag}_j}{\sum_i s_{ij}}" />
          <p>Anteil einer Stelle:</p>
          <Formula expr="\text{Anteil}_{ij} = u_j \cdot s_{ij}" />
        </div>
      }
      form={
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kostenart</TableHead>
                {params.stellen.map((s) => (
                  <TableHead key={s} className="text-right">
                    {s} (€)
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.kostenarten.map((ka, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{ka.name}</TableCell>
                  {params.stellen.map((_s, j) => {
                    const key = fieldKey(i, j);
                    const status = checkResult?.fields[key];
                    const inputErr = inputErrors[key];
                    return (
                      <TableCell key={j} className="p-1.5">
                        <Input
                          inputMode="decimal"
                          value={raw[key]}
                          onChange={(e) => {
                            const v = e.target.value;
                            setRaw((s) => ({ ...s, [key]: v }));
                            if (inputErrors[key]) {
                              setInputErrors((s) => {
                                const n = { ...s };
                                delete n[key];
                                return n;
                              });
                            }
                          }}
                          className={cn(
                            "h-8 text-right text-sm tabular-nums",
                            inputErr && "border-destructive",
                            status?.ok && "border-success",
                            status &&
                              !status.ok &&
                              !inputErr &&
                              "border-destructive",
                          )}
                        />
                        {status && !status.ok && !inputErr && (
                          <p className="mt-0.5 text-[10px] text-destructive">
                            {eur(Number(status.expected))}
                          </p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-2 text-xs text-muted-foreground">
            Toleranz pro Zelle ±0,05 €.
          </p>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<BabPrimaerSolutionView params={params} solution={solution} />}
    />
  );
}

export function BabPrimaerSolutionView({
  params,
  solution,
}: {
  params: BabPrimaerParams;
  solution: BabPrimaerSolution;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kostenart</TableHead>
          {params.stellen.map((s) => (
            <TableHead key={s} className="text-right">
              {s}
            </TableHead>
          ))}
          <TableHead className="text-right">Σ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {params.kostenarten.map((ka, i) => {
          const rowSum = solution.matrix[i].reduce((a, b) => a + b, 0);
          return (
            <TableRow key={i}>
              <TableCell>{ka.name}</TableCell>
              {solution.matrix[i].map((v, j) => (
                <TableCell key={j} className="text-right tabular-nums">
                  {eur(v)}
                </TableCell>
              ))}
              <TableCell className="text-right tabular-nums font-medium">
                {eur(rowSum)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
