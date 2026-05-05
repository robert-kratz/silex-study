"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MIN_MAX_NEW_PER_DAY,
  MAX_MAX_NEW_PER_DAY,
  type SRSCardState,
  type SRSStats,
} from "@/lib/srs";

interface TaskMeta {
  kind: string;
  title: string;
  tutorium: string;
}

interface LearnDashboardProps {
  courseTitle: string;
  tasks: TaskMeta[];
  cards: SRSCardState[];
  stats: SRSStats;
  sessionSize: number;
  maxNewPerDay: number;
  onStart: () => void;
  onReset: () => void;
  onSetMaxNewPerDay: (n: number) => void;
  onDownload: () => void;
  onUpload: () => void;
}

function formatDue(card: SRSCardState, now: number): string {
  if (card.newCard) return "neu";
  const diff = card.nextDue - now;
  if (diff <= 0) return "fällig";
  const days = Math.ceil(diff / 86_400_000);
  if (days === 1) return "in 1 Tag";
  return `in ${days} Tagen`;
}

export function LearnDashboard({
  courseTitle,
  tasks,
  cards,
  stats,
  sessionSize,
  maxNewPerDay,
  onStart,
  onReset,
  onSetMaxNewPerDay,
  onDownload,
  onUpload,
}: LearnDashboardProps) {
  const now = Date.now();
  const titleByKind = React.useMemo(
    () => new Map(tasks.map((t) => [t.kind, t])),
    [tasks],
  );
  const progressPct = stats.total === 0
    ? 0
    : Math.round((stats.mastered / stats.total) * 100);

  // Local draft for the goal input (not committed until "Speichern").
  const [goalDraft, setGoalDraft] = React.useState(String(maxNewPerDay));
  React.useEffect(() => {
    setGoalDraft(String(maxNewPerDay));
  }, [maxNewPerDay]);

  const handleSaveGoal = () => {
    const n = parseInt(goalDraft, 10);
    if (!isNaN(n)) onSetMaxNewPerDay(n);
  };

  const sortedCards = React.useMemo(() => {
    return [...cards].sort((a, b) => {
      const aDue = !a.newCard && a.nextDue <= now ? 0 : a.newCard ? 1 : 2;
      const bDue = !b.newCard && b.nextDue <= now ? 0 : b.newCard ? 1 : 2;
      if (aDue !== bDue) return aDue - bDue;
      return a.nextDue - b.nextDue;
    });
  }, [cards, now]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {courseTitle} · Anki-Modus
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Lernen
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Wiederholungs-System nach SM-2: Jeder Aufgabentyp ist eine Karte.
          Nach jeder Bearbeitung bewertest du selbst, wie es lief — daraus
          ergibt sich das nächste Wiederholungs-Intervall.
        </p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-4">
        <StatCard label="Fällig" value={stats.due} accent="text-amber-600" />
        <StatCard label="Neu" value={stats.newCards} accent="text-sky-600" />
        <StatCard label="Lernend" value={stats.learning} accent="text-emerald-600" />
        <StatCard label="Gemeistert" value={stats.mastered} accent="text-foreground" />
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Heutige Session</CardTitle>
            <CardDescription>
              {sessionSize === 0
                ? "Keine fälligen Karten — komm später wieder oder starte neue Karten morgen."
                : `${sessionSize} Karte${sessionSize === 1 ? "" : "n"} bereit.`}
              {stats.newToday > 0
                ? ` ${stats.newToday}/${maxNewPerDay} neue Karten heute bearbeitet.`
                : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Gesamtfortschritt</span>
                <span>{stats.mastered}/{stats.total}</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onStart} disabled={sessionSize === 0}>
                {sessionSize === 0 ? "Nichts zu lernen" : "Lernen starten"}
              </Button>
              <Button variant="outline" onClick={onReset}>
                Fortschritt zurücksetzen
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Settings ──────────────────────────────────────────────── */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Einstellungen</CardTitle>
            <CardDescription>Tagesziel und Datensicherung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Daily goal */}
            <div className="space-y-2">
              <Label htmlFor="daily-goal">Neue Karten pro Tag (Tagesziel)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="daily-goal"
                  type="number"
                  min={MIN_MAX_NEW_PER_DAY}
                  max={MAX_MAX_NEW_PER_DAY}
                  value={goalDraft}
                  onChange={(e) => setGoalDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveGoal()}
                  className="w-28"
                />
                <Button size="sm" onClick={handleSaveGoal}>
                  Speichern
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Aktuell: {maxNewPerDay} neue Karten/Tag (1–{MAX_MAX_NEW_PER_DAY}).
              </p>
            </div>

            {/* Export / Import */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Daten sichern &amp; wiederherstellen</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={onDownload}>
                  Fortschritt exportieren
                </Button>
                <Button variant="outline" size="sm" onClick={onUpload}>
                  Fortschritt importieren
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Export speichert alle Kartenstände und das Tagesziel als JSON-Datei.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Card list ─────────────────────────────────────────────── */}
      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Karten ({cards.length})
        </h2>
        <ul className="divide-y rounded-lg border bg-card">
          {sortedCards.map((card) => {
            const meta = titleByKind.get(card.taskKind);
            const due = !card.newCard && card.nextDue <= now;
            return (
              <li
                key={card.taskKind}
                className="flex items-center justify-between gap-4 p-3"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-sm font-medium">
                    {meta?.title ?? card.taskKind}
                  </p>
                  <p className="text-xs text-muted-foreground">{meta?.tutorium}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {card.newCard ? (
                    <Badge variant="outline">neu</Badge>
                  ) : due ? (
                    <Badge variant="destructive">fällig</Badge>
                  ) : (
                    <Badge variant="secondary">{formatDue(card, now)}</Badge>
                  )}
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    EF {card.easeFactor.toFixed(2)} · {card.interval}d
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${accent ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
