"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LearnRating } from "@/components/learn-rating";
import { readAttempts, type TaskAttempt } from "@/lib/attempts";
import { encodeTask } from "@/lib/encoding";
import { randomSeed } from "@/lib/random";
import {
  suggestRating,
  type SRSCardState,
  type SRSRating,
} from "@/lib/srs";
import { LearnModeContext } from "@/lib/learn-mode-context";
import type { AnyTaskDefinition, TaskToken } from "@/lib/tasks/types";

interface LearnSessionProps {
  courseId: string;
  courseTitle: string;
  queue: SRSCardState[];
  taskByKind: Map<string, AnyTaskDefinition>;
  onRate: (taskKind: string, rating: SRSRating) => void;
  onExit: () => void;
}

interface CardSlot {
  card: SRSCardState;
  task: AnyTaskDefinition;
  seed: number;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  params: any;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  solution: any;
  shareUrl: string;
  /** Latest attempt timestamp seen at slot mount — anything newer is "this attempt". */
  baselineTs: number;
}

function buildSlot(
  courseId: string,
  card: SRSCardState,
  task: AnyTaskDefinition,
): CardSlot {
  const seed = randomSeed();
  const params = task.generate(seed);
  const solution = task.solve(params);
  const token: TaskToken = { v: task.schemaVersion, k: task.kind, s: seed };
  const shareUrl = `/kurs/${courseId}/aufgabe/${task.kind}?t=${encodeTask(token)}`;
  const existing = readAttempts(courseId, task.kind);
  const baselineTs = existing.reduce(
    (m, a) => (a.ts > m ? a.ts : m),
    0,
  );
  return { card, task, seed, params, solution, shareUrl, baselineTs };
}

interface CompletedEntry {
  taskKind: string;
  title: string;
  rating: SRSRating;
  score: number;
  max: number;
}

export function LearnSession({
  courseId,
  courseTitle,
  queue,
  taskByKind,
  onRate,
  onExit,
}: LearnSessionProps) {
  const [idx, setIdx] = React.useState(0);
  const [slot, setSlot] = React.useState<CardSlot | null>(null);
  const [completed, setCompleted] = React.useState<CompletedEntry[]>([]);

  // Build slot when index changes.
  React.useEffect(() => {
    const card = queue[idx];
    if (!card) {
      setSlot(null);
      return;
    }
    const task = taskByKind.get(card.taskKind);
    if (!task) {
      setSlot(null);
      return;
    }
    setSlot(buildSlot(courseId, card, task));
    // queue & taskByKind are stable for the lifetime of this session render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, courseId]);

  if (idx >= queue.length) {
    return (
      <SessionComplete
        courseTitle={courseTitle}
        completed={completed}
        onExit={onExit}
      />
    );
  }

  if (!slot) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted-foreground">Lade Karte…</p>
      </div>
    );
  }

  const total = queue.length;
  const progress = Math.round((idx / total) * 100);

  const handleRate = (rating: SRSRating, score: number, max: number) => {
    setCompleted((c) => [
      ...c,
      {
        taskKind: slot.card.taskKind,
        title: slot.task.title,
        rating,
        score,
        max,
      },
    ]);
    onRate(slot.card.taskKind, rating);
    setIdx((i) => i + 1);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <SessionHeader
        idx={idx}
        total={total}
        progress={progress}
        onExit={onExit}
      />

      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {slot.task.tutorium} · {courseTitle}
          {slot.card.newCard ? " · Neue Karte" : " · Wiederholung"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {slot.task.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {slot.task.description}
        </p>
      </div>

      <div className="mt-6">
        {/* Render the task component as it would render on its own page. */}
        <LearnModeContext.Provider value={true}>
          <slot.task.Component
            key={`${slot.task.kind}:${slot.seed}`}
            params={slot.params}
            solution={slot.solution}
            seed={slot.seed}
            shareUrl={slot.shareUrl}
            courseId={courseId}
          />
        </LearnModeContext.Provider>
      </div>

      <RatingGate
        courseId={courseId}
        taskKind={slot.task.kind}
        baselineTs={slot.baselineTs}
        onRate={handleRate}
      />

      {completed.length > 0 && (
        <SessionHistory completed={completed} />
      )}
    </div>
  );
}

/** Inline history of cards already rated in this session. */
function SessionHistory({ completed }: { completed: CompletedEntry[] }) {
  const ratingLabels: Record<SRSRating, string> = { 0: "Nochmal", 3: "Gut", 5: "Einfach" };
  const ratingColors: Record<SRSRating, string> = {
    0: "text-destructive",
    3: "text-emerald-600 dark:text-emerald-400",
    5: "text-sky-600 dark:text-sky-400",
  };
  return (
    <div className="mt-6 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Bereits bearbeitet ({completed.length})
      </p>
      <ul className="divide-y rounded-lg border bg-card">
        {[...completed].reverse().map((c, i) => (
          <li
            key={`${c.taskKind}:${i}`}
            className="flex items-center justify-between gap-4 px-3 py-2"
          >
            <span className="truncate text-sm">{c.title}</span>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {c.score}/{c.max}
              </span>
              <span
                className={`text-xs font-medium ${ratingColors[c.rating]}`}
              >
                {ratingLabels[c.rating]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SessionHeader({
  idx,
  total,
  progress,
  onExit,
}: {
  idx: number;
  total: number;
  progress: number;
  onExit: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Karte {idx + 1} von {total}
        </span>
        <Button size="sm" variant="ghost" onClick={onExit}>
          Session beenden
        </Button>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}

/**
 * Watches localStorage attempts for the current task and shows the rating
 * panel once a fresh attempt (timestamp > baselineTs) appears.
 */
function RatingGate({
  courseId,
  taskKind,
  baselineTs,
  onRate,
}: {
  courseId: string;
  taskKind: string;
  baselineTs: number;
  onRate: (rating: SRSRating, score: number, max: number) => void;
}) {
  const [latest, setLatest] = React.useState<TaskAttempt | null>(null);

  React.useEffect(() => {
    setLatest(null);
    let cancelled = false;
    const check = () => {
      if (cancelled) return;
      const attempts = readAttempts(courseId, taskKind);
      const fresh = attempts
        .filter((a) => a.ts > baselineTs)
        .sort((a, b) => b.ts - a.ts)[0];
      if (fresh) setLatest(fresh);
    };
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key && !e.key.includes(`:attempts:${courseId}:${taskKind}`)) return;
      check();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, [courseId, taskKind, baselineTs]);

  if (!latest) {
    return (
      <Card className="mt-6 border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Bewerten</CardTitle>
          <CardDescription>
            Sobald du oben „Prüfen" klickst, erscheint hier die Bewertung für
            das Wiederholungs-Intervall.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const suggested = suggestRating(latest.score, latest.max, latest.passed);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Bewerten</CardTitle>
        <CardDescription>
          Ergebnis: {latest.score}/{latest.max} Felder
          {latest.passed ? " · komplett richtig" : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LearnRating
          suggestedRating={suggested}
          onRate={(r) => onRate(r, latest.score, latest.max)}
        />
      </CardContent>
    </Card>
  );
}

function SessionComplete({
  courseTitle,
  completed,
  onExit,
}: {
  courseTitle: string;
  completed: CompletedEntry[];
  onExit: () => void;
}) {
  const ratingLabels: Record<SRSRating, string> = {
    0: "Nochmal",
    3: "Gut",
    5: "Einfach",
  };
  const counts = { 0: 0, 3: 0, 5: 0 } as Record<SRSRating, number>;
  for (const c of completed) counts[c.rating] += 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {courseTitle} · Anki-Modus
      </p>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Session abgeschlossen
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {completed.length} Karte{completed.length === 1 ? "" : "n"} bearbeitet.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {(Object.keys(counts) as unknown as SRSRating[]).map((r) => (
          <div key={r} className="rounded-lg border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {ratingLabels[r]}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {counts[r]}
            </p>
          </div>
        ))}
      </div>

      {completed.length > 0 ? (
        <ul className="mt-6 divide-y rounded-lg border bg-card">
          {completed.map((c, i) => (
            <li
              key={`${c.taskKind}:${i}`}
              className="flex items-center justify-between gap-4 p-3"
            >
              <span className="truncate text-sm">{c.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {c.score}/{c.max} · {ratingLabels[c.rating]}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={onExit}>Zurück zur Übersicht</Button>
        <Button variant="outline" asChild>
          <Link href="..">Kursseite</Link>
        </Button>
      </div>
    </div>
  );
}
