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
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { cn } from "@/lib/utils";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { eur, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import {
  KATEGORIEN,
  KATEGORIE_LABEL,
  type Kategorie,
  type WertabgrenzungParams,
} from "./generate";
import type { WertabgrenzungSolution } from "./solve";
import {
  checkWertabgrenzung,
  fieldKey,
  type WertabgrenzungAnswer,
} from "./check";
import { buildWertabgrenzungPrompt } from "./prompt";
import { validateWertabgrenzungInput } from "./validate";

export function WertabgrenzungComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<WertabgrenzungParams, WertabgrenzungSolution>) {
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
    const errs = validateWertabgrenzungInput(raw);
    setInputErrors(errs);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const answer: WertabgrenzungAnswer = params.vorfaelle.map((_, i) => {
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
        if (v === undefined || v === "") {
          row[k] = 0;
        } else {
          row[k] = parseLocaleNumber(v);
        }
      });
      return row;
    });
    setCheckResult(checkWertabgrenzung(solution, answer));
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
      taskKind="wertabgrenzung"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Matrix ausfüllen"
      description="Ordne jeden Vorfall den betroffenen Kategorien zu (leeres Feld = 0 €)."
      buildPromptText={() => buildWertabgrenzungPrompt(params)}
      problem={
        <ol className="list-decimal space-y-1 pl-5">
          {params.vorfaelle.map((v, i) => (
            <li key={i}>{v.text}</li>
          ))}
        </ol>
      }
      learnHelp={
        <LearnLegend
          intro="Abgrenzung von Aufwand und Kosten: Aufwendungen folgen handelsrechtlichen Vorschriften, Kosten dem betrieblichen Sachziel. Daraus ergeben sich Zusatz- und Anderskosten als kalkulatorische Korrekturen."
          variables={[
            { sym: "\\text{Aufwand}", desc: "Periodisierter Werteverzehr nach HGB / IFRS" },
            { sym: "\\text{Kosten}", desc: "Bewerteter, betriebszielbezogener Werteverzehr" },
            { sym: "\\text{Zusatzkosten}", desc: "Kosten ohne entsprechenden Aufwand (z. B. kalk. Unternehmerlohn)" },
            { sym: "\\text{Anderskosten}", desc: "Kosten in anderer Höhe als der zugehörige Aufwand (z. B. kalk. Abschreibung > bilanzielle AfA)" },
          ]}
          formulas={[
            { expr: "\\text{Aufwand} \\subseteq \\text{HGB}\\quad\\text{Kosten} \\subseteq \\text{Sachziel}", desc: "Konzeptionelle Trennung: extern bilanziell vs. intern entscheidungsorientiert." },
          ]}
          notes={<p>Faustregel: Was ist betriebszielbezogen und periodengerecht? Nur das gehört zu den Kosten.</p>}
        />
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
                          onChange={(e) => setField(key, e.target.value)}
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
            Leere Zellen werden als 0 € gewertet. Toleranz pro Zelle ±0,005 €.
          </p>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<WertabgrenzungSolutionView params={params} solution={solution} />}
    />
  );
}

export function WertabgrenzungSolutionView({
  params,
  solution,
}: {
  params: WertabgrenzungParams;
  solution: WertabgrenzungSolution;
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
