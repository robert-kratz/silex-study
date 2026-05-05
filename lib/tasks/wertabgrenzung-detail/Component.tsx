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
import { cn } from "@/lib/utils";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { eur, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import {
  KATEGORIEN,
  KATEGORIE_LABEL,
  type Kategorie,
  type WertabgrenzungDetailParams,
} from "./generate";
import type { WertabgrenzungDetailSolution } from "./solve";
import {
  checkWertabgrenzungDetail,
  fieldKey,
  type WertabgrenzungDetailAnswer,
} from "./check";
import { buildWertabgrenzungDetailPrompt } from "./prompt";
import { validateWertabgrenzungDetailInput } from "./validate";

export function WertabgrenzungDetailComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<WertabgrenzungDetailParams, WertabgrenzungDetailSolution>) {
  const blank = React.useMemo<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    params.vorfaelle.forEach((_, i) => {
      KATEGORIEN.forEach((k) => (o[fieldKey(i, k)] = ""));
    });
    return o;
  }, [params.vorfaelle]);

  const [raw, setRaw] = React.useState<Record<string, string>>(blank);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<string, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateWertabgrenzungDetailInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const answer: WertabgrenzungDetailAnswer = params.vorfaelle.map((_, i) => {
      const row: Record<Kategorie, number | null> = {
        einzahlung: 0,
        auszahlung: 0,
        ertrag: 0,
        aufwand: 0,
        erloes: 0,
        kosten: 0,
      };
      KATEGORIEN.forEach((k) => {
        const v = raw[fieldKey(i, k)];
        row[k] = v === undefined || v === "" ? 0 : parseLocaleNumber(v);
      });
      return row;
    });
    setCheckResult(checkWertabgrenzungDetail(solution, answer));
  };

  const onReset = () => {
    setRaw(blank);
    setInputErrors({});
    setCheckResult(null);
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="wertabgrenzung-detail"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Beträge je Kategorie"
      description="Aufgabe wie 1.2 mit getrennten Beträgen für Aufwand vs. Kosten (Anders-/Zusatzkosten)."
      buildPromptText={() => buildWertabgrenzungDetailPrompt(params)}
      problem={
        <ol className="list-decimal space-y-1 pl-5">
          {params.vorfaelle.map((v, i) => (
            <li key={i}>{v.text}</li>
          ))}
        </ol>
      }
      learnHelp={
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Zusatzkosten haben keinen Aufwand (z. B. kalk. Unternehmerlohn).</li>
          <li>Anderskosten weichen wertmäßig vom Aufwand ab (z. B. kalk. AfA).</li>
          <li>Kreditzu-/abflüsse berühren nur Ein-/Auszahlung.</li>
        </ul>
      }
      form={
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                {KATEGORIEN.map((k) => (
                  <TableHead key={k} className="text-right">
                    {KATEGORIE_LABEL[k]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {params.vorfaelle.map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  {KATEGORIEN.map((k) => {
                    const key = fieldKey(i, k);
                    const status = checkResult?.fields[key];
                    const inputErr = inputErrors[key];
                    return (
                      <TableCell key={k} className="p-1.5">
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
                          placeholder="0"
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
            Leere Zellen = 0 €. Toleranz pro Zelle ±0,01 €.
          </p>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={
        <WertabgrenzungDetailSolutionView params={params} solution={solution} />
      }
    />
  );
}

export function WertabgrenzungDetailSolutionView({
  params,
  solution,
}: {
  params: WertabgrenzungDetailParams;
  solution: WertabgrenzungDetailSolution;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Vorfall</TableHead>
            {KATEGORIEN.map((k) => (
              <TableHead key={k} className="text-right">
                {KATEGORIE_LABEL[k]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {params.vorfaelle.map((v, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell className="text-xs">{v.text}</TableCell>
              {KATEGORIEN.map((k) => (
                <TableCell key={k} className="text-right tabular-nums">
                  {solution.matrix[i][k] === 0 ? "—" : eur(solution.matrix[i][k])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
