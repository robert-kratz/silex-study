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
import type { IlvBlockParams } from "./generate";
import type { IlvBlockSolution } from "./solve";
import { checkIlvBlock, type IlvBlockAnswer } from "./check";
import { buildIlvBlockPrompt } from "./prompt";
import { validateIlvBlockInput } from "./validate";

type Field = keyof IlvBlockAnswer;
const BLANK: Record<Field, string> = { k1: "", k2: "", E1: "", E2: "" };

export function IlvBlockComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<IlvBlockParams, IlvBlockSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateIlvBlockInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: IlvBlockAnswer = {
      k1: parseLocaleNumber(raw.k1),
      k2: parseLocaleNumber(raw.k2),
      E1: parseLocaleNumber(raw.E1),
      E2: parseLocaleNumber(raw.E2),
    };
    setCheckResult(checkIlvBlock(solution, ans));
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
      taskKind="ilv-block"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Verrechnungspreise und Endstellenbelastung"
      description="Blockumlage: gegenseitige Vorstellen-Leistungen werden ignoriert."
      buildPromptText={() => buildIlvBlockPrompt(params)}
      problem={
        <div className="space-y-2">
          <p>
            Primärkosten: PK(V1) = <strong>{eur(params.PK[0])}</strong>, PK(V2) = <strong>{eur(params.PK[1])}</strong>.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>von ↓ / an →</TableHead>
                <TableHead className="text-right">V1</TableHead>
                <TableHead className="text-right">V2</TableHead>
                <TableHead className="text-right">E1</TableHead>
                <TableHead className="text-right">E2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">V1</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.v1.v2)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.v1.e1)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.v1.e2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">V2</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.v2.v1)}</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.v2.e1)}</TableCell>
                <TableCell className="text-right tabular-nums">{fmt(params.v2.e2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      }
      learnHelp={
        <LearnLegend
          intro="Innerbetriebliche Leistungsverrechnung mit dem Blockverfahren: Wechselseitige Leistungen zwischen den Vorkostenstellen werden ignoriert; verrechnet wird ausschließlich auf die Endkostenstellen."
          variables={[
            { sym: "j", desc: "Index der Vorkostenstelle" },
            { sym: "PK_j", desc: "Primäre Kosten der Vorkostenstelle j (€)" },
            { sym: "x_{ji}", desc: "Leistung von Stelle j an Endkostenstelle i" },
            { sym: "k_j", desc: "Verrechnungspreis je Leistungseinheit der Stelle j (€)" },
            { sym: "E_i", desc: "Belastung der Endkostenstelle i (€)" },
          ]}
          formulas={[
            { expr: "k_j = \\dfrac{PK_j}{\\sum_{i\\in\\text{End}} x_{ji}}", desc: "Verrechnungspreis = Primärkosten geteilt durch Summe der an Endstellen abgegebenen Leistungen." },
          ]}
          notes={<p>Wichtig: V ↔ V-Leistungen werden im Blockverfahren <strong>nicht</strong> berücksichtigt – daher der „Block“.</p>}
        />
      }
      form={
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow id="k1" label="k_V1 (€/Einheit)" value={raw.k1}
            onChange={setField("k1")} inputError={inputErrors.k1}
            checkStatus={checkResult?.fields.k1} format={eur} />
          <FieldRow id="k2" label="k_V2 (€/Einheit)" value={raw.k2}
            onChange={setField("k2")} inputError={inputErrors.k2}
            checkStatus={checkResult?.fields.k2} format={eur} />
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
      solutionView={<IlvBlockSolutionView params={params} solution={solution} />}
    />
  );
}

export function IlvBlockSolutionView({
  params,
  solution,
}: {
  params: IlvBlockParams;
  solution: IlvBlockSolution;
}) {
  return (
    <div className="space-y-2 text-sm">
      <p>k_V1 = {eur(params.PK[0])} / ({fmt(params.v1.e1)} + {fmt(params.v1.e2)}) = <strong>{eur(solution.k1)}</strong>/Einheit</p>
      <p>k_V2 = {eur(params.PK[1])} / ({fmt(params.v2.e1)} + {fmt(params.v2.e2)}) = <strong>{eur(solution.k2)}</strong>/Einheit</p>
      <p>E1 = {fmt(params.v1.e1)}·k_V1 + {fmt(params.v2.e1)}·k_V2 = <strong>{eur(solution.E1)}</strong></p>
      <p>E2 = {fmt(params.v1.e2)}·k_V1 + {fmt(params.v2.e2)}·k_V2 = <strong>{eur(solution.E2)}</strong></p>
    </div>
  );
}
