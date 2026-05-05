"use client";

import * as React from "react";
import { Formula } from "@/components/Formula";
import { LearnLegend } from "@/lib/tasks/_shared/LearnLegend";
import { TaskShell } from "@/lib/tasks/_shared/TaskShell";
import { FieldRow } from "@/lib/tasks/_shared/FieldRow";
import { eur, fmt, parseLocaleNumber } from "@/lib/tasks/_shared/format";
import { cn } from "@/lib/utils";
import type { TaskComponentProps, CheckResult } from "@/lib/tasks/types";
import type { IlvVergleichParams } from "./generate";
import type { IlvVergleichSolution } from "./solve";
import { checkIlvVergleich, type IlvVergleichAnswer } from "./check";
import { buildIlvVergleichPrompt } from "./prompt";
import { validateIlvVergleichInput } from "./validate";

type Field = "bk1" | "bk2" | "tk1" | "tk2" | "gk1" | "gk2" | "exakt";
const BLANK: Record<Field, string> = {
  bk1: "", bk2: "", tk1: "", tk2: "", gk1: "", gk2: "", exakt: "",
};

const VERFAHREN: { value: "block" | "treppe" | "gleichung"; label: string }[] = [
  { value: "block", label: "Blockverfahren" },
  { value: "treppe", label: "Treppenverfahren" },
  { value: "gleichung", label: "Gleichungsverfahren" },
];

export function IlvVergleichComponent({
  params,
  solution,
  seed,
  shareUrl,
  courseId,
}: TaskComponentProps<IlvVergleichParams, IlvVergleichSolution>) {
  const [raw, setRaw] = React.useState<Record<Field, string>>(BLANK);
  const [inputErrors, setInputErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [checkResult, setCheckResult] = React.useState<CheckResult | null>(null);

  const onSubmit = () => {
    const errs = validateIlvVergleichInput(raw as Record<string, string>);
    setInputErrors(errs as Partial<Record<Field, string>>);
    if (Object.keys(errs).length > 0) {
      setCheckResult(null);
      return;
    }
    const ans: IlvVergleichAnswer = {
      bk1: parseLocaleNumber(raw.bk1),
      bk2: parseLocaleNumber(raw.bk2),
      tk1: parseLocaleNumber(raw.tk1),
      tk2: parseLocaleNumber(raw.tk2),
      gk1: parseLocaleNumber(raw.gk1),
      gk2: parseLocaleNumber(raw.gk2),
      exakt: raw.exakt.trim().toLowerCase() || null,
    };
    setCheckResult(checkIlvVergleich(solution, ans));
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

  const exaktStatus = checkResult?.fields.exakt;

  return (
    <TaskShell
      courseId={courseId}
      taskKind="ilv-vergleich"
      schemaVersion={1}
      seed={seed}
      shareUrl={shareUrl}
      title="Verfahrensvergleich – Eingabe"
      description="Block-, Treppen- und Gleichungsverfahren auf identischer Datenbasis."
      buildPromptText={() => buildIlvVergleichPrompt(params)}
      problem={
        <ul className="space-y-1 text-sm">
          <li>
            Primärkosten: PK(V1) = <strong>{eur(params.PK[0])}</strong>,
            PK(V2) = <strong>{eur(params.PK[1])}</strong>.
          </li>
          <li>
            Wechselseitig: V1 → V2 = {fmt(params.x12)}, V2 → V1 = {fmt(params.x21)}.
          </li>
          <li>
            V1 → E1 = {fmt(params.v1End[0])}, V1 → E2 = {fmt(params.v1End[1])}.
          </li>
          <li>
            V2 → E1 = {fmt(params.v2End[0])}, V2 → E2 = {fmt(params.v2End[1])}.
          </li>
        </ul>
      }
      learnHelp={
        <LearnLegend
          intro="Vergleich der drei klassischen ILV-Verfahren für zwei Vorkostenstellen mit gegenseitigem Leistungsaustausch (V ↔ V)."
          variables={[
            { sym: "PK_1, PK_2", desc: "Primäre Kosten der Vorkostenstellen 1 und 2 (€)" },
            { sym: "x_{12}, x_{21}", desc: "Wechselseitig abgegebene Leistungsmengen" },
            { sym: "x_{1E_i}, x_{2E_i}", desc: "Leistungen an die Endkostenstellen E_i" },
            { sym: "x_1, x_2", desc: "Gesamtleistungen der Stellen 1 bzw. 2" },
            { sym: "k_1, k_2", desc: "Verrechnungspreise der Stellen 1 und 2 (€/Einheit)" },
          ]}
          formulas={[
            { expr: "k_1 = \\dfrac{PK_1}{x_{1E_1}+x_{1E_2}},\\quad k_2 = \\dfrac{PK_2}{x_{2E_1}+x_{2E_2}}", desc: "Block: V ↔ V wird ignoriert; Primärkosten nur auf Endstellenleistungen umlegen." },
            { expr: "k_1 = \\dfrac{PK_1}{x_{12}+x_{1E_1}+x_{1E_2}}", desc: "Treppe (Stelle 1 zuerst): k₁ auf alle abgegebenen Leistungen, danach k₂ unter Einbezug der übernommenen Belastung." },
            { expr: "k_2 = \\dfrac{PK_2 + x_{12}\\cdot k_1}{x_{2E_1}+x_{2E_2}}", desc: "Treppe Stelle 2: belastet mit dem Wert der von 1 empfangenen Leistung; Rückleistung 2 → 1 bleibt unberücksichtigt." },
            { expr: "x_1\\,k_1 - x_{21}\\,k_2 = PK_1", desc: "Gleichungsverfahren, Gleichung 1: Wert eigener Leistung minus von 2 empfangene Leistung = Primärkosten." },
            { expr: "-x_{12}\\,k_1 + x_2\\,k_2 = PK_2", desc: "Gleichungsverfahren, Gleichung 2: analog für Stelle 2; das 2×2-LGS löst die echten Verrechnungspreise." },
          ]}
          notes={<p>Nur das Gleichungsverfahren berücksichtigt wechselseitige Leistungen exakt; Block und Treppe sind Näherungen.</p>}
        />
      }
      form={
        <div className="space-y-6">
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Blockverfahren
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow id="bk1" label="k_1 (€/Einheit)" value={raw.bk1}
                onChange={setField("bk1")} inputError={inputErrors.bk1}
                checkStatus={checkResult?.fields.bk1} format={eur} />
              <FieldRow id="bk2" label="k_2 (€/Einheit)" value={raw.bk2}
                onChange={setField("bk2")} inputError={inputErrors.bk2}
                checkStatus={checkResult?.fields.bk2} format={eur} />
            </div>
          </fieldset>
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Treppenverfahren (V1 zuerst)
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow id="tk1" label="k_1 (€/Einheit)" value={raw.tk1}
                onChange={setField("tk1")} inputError={inputErrors.tk1}
                checkStatus={checkResult?.fields.tk1} format={eur} />
              <FieldRow id="tk2" label="k_2 (€/Einheit)" value={raw.tk2}
                onChange={setField("tk2")} inputError={inputErrors.tk2}
                checkStatus={checkResult?.fields.tk2} format={eur} />
            </div>
          </fieldset>
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Gleichungsverfahren
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldRow id="gk1" label="k_1 (€/Einheit)" value={raw.gk1}
                onChange={setField("gk1")} inputError={inputErrors.gk1}
                checkStatus={checkResult?.fields.gk1} format={eur} />
              <FieldRow id="gk2" label="k_2 (€/Einheit)" value={raw.gk2}
                onChange={setField("gk2")} inputError={inputErrors.gk2}
                checkStatus={checkResult?.fields.gk2} format={eur} />
            </div>
          </fieldset>
          <fieldset className="space-y-2 rounded-lg border p-4">
            <legend className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Welches Verfahren ist exakt?
            </legend>
            <div className="space-y-1.5">
              {VERFAHREN.map((v) => {
                const isCorrect = exaktStatus && v.value === exaktStatus.expected;
                const isWrongPick = exaktStatus && !exaktStatus.ok && raw.exakt === v.value;
                return (
                  <label
                    key={v.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      raw.exakt === v.value && "border-primary bg-primary/5",
                      isCorrect && "border-success bg-success/5",
                      isWrongPick && "border-destructive bg-destructive/5",
                    )}
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      name="exakt"
                      value={v.value}
                      checked={raw.exakt === v.value}
                      onChange={() => {
                        setRaw((s) => ({ ...s, exakt: v.value }));
                        if (inputErrors.exakt) {
                          setInputErrors((s) => { const n = { ...s }; delete n.exakt; return n; });
                        }
                      }}
                    />
                    <span>{v.label}</span>
                  </label>
                );
              })}
              {inputErrors.exakt && (
                <p className="text-xs text-destructive">{inputErrors.exakt}</p>
              )}
            </div>
          </fieldset>
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
      checkResult={checkResult}
      solutionView={<IlvVergleichSolutionView params={params} solution={solution} />}
    />
  );
}

export function IlvVergleichSolutionView({
  params,
  solution,
}: {
  params: IlvVergleichParams;
  solution: IlvVergleichSolution;
}) {
  return (
    <div className="space-y-3 text-sm">
      <p>
        <strong>Block:</strong> k_1 = {eur(solution.block.k1)}, k_2 = {eur(solution.block.k2)};
        E1 = {eur(solution.block.E1)}, E2 = {eur(solution.block.E2)}.
      </p>
      <p>
        <strong>Treppe (V1 → V2):</strong> k_1 = {eur(solution.treppe.k1)}, k_2 = {eur(solution.treppe.k2)};
        E1 = {eur(solution.treppe.E1)}, E2 = {eur(solution.treppe.E2)}.
      </p>
      <p>
        <strong>Gleichung:</strong> k_1 = {eur(solution.gleichung.k1)}, k_2 = {eur(solution.gleichung.k2)};
        E1 = {eur(solution.gleichung.E1)}, E2 = {eur(solution.gleichung.E2)}.
      </p>
      <p>
        Exakt ist nur das <strong>Gleichungsverfahren</strong> – Block ignoriert die V↔V-Verflechtung,
        Treppe vernachlässigt die Rückleistung V2 → V1 ({fmt(params.x21)} Einheiten).
      </p>
    </div>
  );
}
