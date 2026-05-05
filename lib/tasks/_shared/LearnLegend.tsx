import * as React from "react";
import { Formula } from "@/components/Formula";

export interface LegendVariable {
  /** KaTeX-Ausdruck für das Symbol, z. B. "d" oder "k_v". */
  sym: string;
  /** Bedeutung des Symbols inkl. Einheit. */
  desc: React.ReactNode;
}

export interface LegendFormula {
  /** KaTeX-Ausdruck der Formel. */
  expr: string;
  /** Was berechnet die Formel und wofür wird sie genutzt? */
  desc: React.ReactNode;
}

export interface LearnLegendProps {
  /** Kurzer Erklärtext: wofür ist die Aufgabe / die Formelsammlung gedacht? */
  intro?: React.ReactNode;
  /** Erläuterung der verwendeten Variablen / Symbole. */
  variables?: LegendVariable[];
  /** Erläuterung der einzelnen Formeln (Bedeutung & Zweck). */
  formulas?: LegendFormula[];
  /** Optionale Hinweise oder Faustregeln. */
  notes?: React.ReactNode;
}

/**
 * Einheitliche Darstellung der Lernhilfe in jeder Aufgabe:
 *  - kurze Zweckbeschreibung
 *  - Variablenlegende
 *  - kommentierte Formeln
 *  - optionale Hinweise
 */
export function LearnLegend({ intro, variables, formulas, notes }: LearnLegendProps) {
  return (
    <div className="space-y-4 text-sm">
      {intro ? <p className="leading-relaxed">{intro}</p> : null}

      {variables && variables.length > 0 ? (
        <div className="space-y-1">
          <p className="font-medium">Variablen</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            {variables.map((v, i) => (
              <React.Fragment key={i}>
                <dt className="tabular-nums">
                  <Formula expr={v.sym} block={false} />
                </dt>
                <dd className="text-muted-foreground">{v.desc}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
      ) : null}

      {formulas && formulas.length > 0 ? (
        <div className="space-y-2">
          <p className="font-medium">Formeln</p>
          <ul className="space-y-2">
            {formulas.map((f, i) => (
              <li key={i} className="space-y-1">
                <Formula expr={f.expr} />
                <p className="text-muted-foreground">{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {notes ? <div className="text-muted-foreground">{notes}</div> : null}
    </div>
  );
}
