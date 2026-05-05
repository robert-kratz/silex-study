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
import type { IlvAufstellenParams } from "./generate";
import type { IlvAufstellenSolution } from "./solve";
import { checkIlvAufstellen, type IlvAufstellenAnswer } from "./check";
import { buildIlvAufstellenPrompt } from "./prompt";
import { validateIlvAufstellenInput } from "./validate";

interface Block {
  id: string;
  label: string;
}

function buildBlocks(p: IlvAufstellenParams): Block[] {
  const blocks: Block[] = [];
  for (let j = 0; j < 3; j++) {
    blocks.push({ id: `PK${j + 1}`, label: `PK_${j + 1} = ${eur(p.PK[j])}` });
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === j) continue;
      blocks.push({
        id: `${i + 1}${j + 1}`,
        label: `(V${i + 1}→V${j + 1}) · k_${i + 1} = ${fmt(p.cross[i][j])} · k_${i + 1}`,
      });
    }
  }
  return blocks;
}

type NumField = "k1" | "k2" | "k3";

export function IlvAufstellenComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<IlvAufstellenParams, IlvAufstellenSolution>) {
  const blocks = React.useMemo(() => buildBlocks(params), [params]);
  const [selected, setSelected] = React.useState<[Set<string>, Set<string>, Set<string>]>([
    new Set(), new Set(), new Set(),
  ]);
  const [raw, setRaw] = React.useState<Record<NumField, string>>({ k1: "", k2: "", k3: "" });
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<NumField, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const toggleBlock = (eqIdx: number, blockId: string) => {
    setSelected((prev) => {
      const next = prev.map((s) => new Set(s)) as [Set<string>, Set<string>, Set<string>];
      if (next[eqIdx].has(blockId)) next[eqIdx].delete(blockId);
      else next[eqIdx].add(blockId);
      return next;
    });
  };

  const onSubmit = () => {
    const errs = validateIlvAufstellenInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<NumField, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: IlvAufstellenAnswer = {
      selected,
      k1: parseLocaleNumber(raw.k1),
      k2: parseLocaleNumber(raw.k2),
      k3: parseLocaleNumber(raw.k3),
    };
    setCheckResult(checkIlvAufstellen(solution, ans));
  };

  const onReset = () => {
    setSelected([new Set(), new Set(), new Set()]);
    setRaw({ k1: "", k2: "", k3: "" });
    setInputErrors({});
    setCheckResult(null);
  };

  const setNum = (k: NumField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaw((s) => ({ ...s, [k]: e.target.value }));
    if (inputErrors[k]) {
      setInputErrors((s) => { const n = { ...s }; delete n[k]; return n; });
    }
  };

  return (
    <TaskShell
      courseId={courseId}
      taskKind="ilv-aufstellen"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Gleichungen aufstellen"
      description="Bausteine je Gleichung auswählen und das LGS lösen."
      buildPromptText={() => buildIlvAufstellenPrompt(params)}
      problem={
        <div className="space-y-3">
          <p className="text-sm">
            Drei Vorkostenstellen V1, V2, V3 mit folgenden Leistungsmengen
            (Zeile = abgebende Stelle, Spalte = empfangende Stelle):
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>von ↓ / an →</TableHead>
                <TableHead className="text-right">V1</TableHead>
                <TableHead className="text-right">V2</TableHead>
                <TableHead className="text-right">V3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[0, 1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">V{i + 1}</TableCell>
                  {[0, 1, 2].map((j) => (
                    <TableCell key={j} className="text-right tabular-nums">
                      {i === j ? "—" : fmt(params.cross[i][j])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stelle</TableHead>
                <TableHead className="text-right">PK</TableHead>
                <TableHead className="text-right">Gesamtleistung x_j</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[0, 1, 2].map((j) => (
                <TableRow key={j}>
                  <TableCell className="font-medium">V{j + 1}</TableCell>
                  <TableCell className="text-right tabular-nums">{eur(params.PK[j])}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(params.total[j])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <>
          <Formula expr="x_j\,k_j = PK_j + \sum_{i\ne j} (V_i\to V_j)\,k_i" />
          <p className="text-sm">
            Pro Gleichung gehören genau drei Bausteine auf die rechte Seite: das jeweilige PK plus
            die zwei eingehenden Verrechnungsterme.
          </p>
        </>
      }
      form={
        <div className="space-y-6">
          {[0, 1, 2].map((j) => {
            const status = checkResult?.fields[`eq${j + 1}`];
            return (
              <fieldset key={j} className="space-y-2 rounded-lg border p-4">
                <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Gleichung V{j + 1}: {fmt(params.total[j])} · k_{j + 1} =
                </legend>
                <p className="text-sm text-muted-foreground">
                  Wähle alle Bausteine, die auf der rechten Seite vorkommen.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {blocks.map((b) => {
                    const checked = selected[j].has(b.id);
                    const isCorrectMember = solution.correctBlocks[j].has(b.id);
                    const showOk = status && checked && isCorrectMember;
                    const showErr = status && checked && !isCorrectMember;
                    const showMissing = status && !checked && isCorrectMember;
                    return (
                      <label
                        key={b.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                          checked && "border-primary bg-primary/5",
                          showOk && "border-success bg-success/5",
                          showErr && "border-destructive bg-destructive/5",
                          showMissing && "border-amber-500 bg-amber-500/5",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={checked}
                          onChange={() => toggleBlock(j, b.id)}
                        />
                        <span>{b.label}</span>
                      </label>
                    );
                  })}
                </div>
                {status && !status.ok && (
                  <p className="text-xs text-destructive">
                    Korrekte Auswahl: {String(status.expected)}.
                  </p>
                )}
                {status && status.ok && (
                  <p className="text-xs text-success">Gleichung korrekt aufgestellt.</p>
                )}
              </fieldset>
            );
          })}

          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Numerische Lösung
            </legend>
            <div className="grid gap-4 sm:grid-cols-3">
              <FieldRow id="k1" label="k_1 (€/Einh.)" value={raw.k1}
                onChange={setNum("k1")} inputError={inputErrors.k1}
                checkStatus={checkResult?.fields.k1} format={eur} />
              <FieldRow id="k2" label="k_2 (€/Einh.)" value={raw.k2}
                onChange={setNum("k2")} inputError={inputErrors.k2}
                checkStatus={checkResult?.fields.k2} format={eur} />
              <FieldRow id="k3" label="k_3 (€/Einh.)" value={raw.k3}
                onChange={setNum("k3")} inputError={inputErrors.k3}
                checkStatus={checkResult?.fields.k3} format={eur} />
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<IlvAufstellenSolutionView params={params} solution={solution} />}
    />
  );
}

export function IlvAufstellenSolutionView({
  params,
  solution,
}: {
  params: IlvAufstellenParams;
  solution: IlvAufstellenSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      {[0, 1, 2].map((j) => {
        const others = [0, 1, 2].filter((i) => i !== j);
        const expr = `${params.total[j]} \\cdot k_${j + 1} = ${params.PK[j]} + ${others
          .map((i) => `${params.cross[i][j]}\\,k_${i + 1}`)
          .join(" + ")}`;
        return <Formula key={j} expr={expr} />;
      })}
      <p>
        Lösung: k_1 = <strong>{eur(solution.k[0])}</strong>, k_2 = <strong>{eur(solution.k[1])}</strong>,
        k_3 = <strong>{eur(solution.k[2])}</strong>.
      </p>
    </div>
  );
}
