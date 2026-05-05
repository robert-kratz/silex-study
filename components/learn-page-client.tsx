"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LearnDashboard } from "@/components/learn-dashboard";
import { LearnSession } from "@/components/learn-session";
import { getCourse } from "@/lib/courses/registry";
import { readDailyGoal, useSRS, writeDailyGoal, writeSRSState, type SRSCardState } from "@/lib/srs";
import type { AnyTaskDefinition } from "@/lib/tasks/types";

/** Export format: carries both card states and the daily goal. */
interface SRSExport {
  version: 1;
  courseId: string;
  exportedAt: string;
  maxNewPerDay: number;
  cards: SRSCardState[];
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface LearnPageClientProps {
  courseId: string;
}

export function LearnPageClient({ courseId }: LearnPageClientProps) {
  const router = useRouter();
  const course = getCourse(courseId);

  const taskKinds = React.useMemo(
    () => (course ? course.tasks.map((t) => t.kind) : []),
    [course],
  );
  const taskByKind = React.useMemo(() => {
    const map = new Map<string, AnyTaskDefinition>();
    if (course) for (const t of course.tasks) map.set(t.kind, t);
    return map;
  }, [course]);
  const taskMeta = React.useMemo(
    () =>
      course
        ? course.tasks.map((t) => ({
            kind: t.kind,
            title: t.title,
            tutorium: t.tutorium,
          }))
        : [],
    [course],
  );

  const { cards, stats, session, rate, reset, maxNewPerDay, setMaxNewPerDay } = useSRS(courseId, taskKinds);
  const [mode, setMode] = React.useState<"dashboard" | "session">("dashboard");
  const [activeQueue, setActiveQueue] = React.useState<typeof session>([]);
  const uploadRef = React.useRef<HTMLInputElement | null>(null);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted-foreground">Kurs nicht gefunden.</p>
      </div>
    );
  }

  const handleStart = () => {
    if (session.length === 0) return;
    // Snapshot the queue so it doesn't mutate while rating is applied.
    setActiveQueue(session);
    setMode("session");
  };

  const handleExit = () => {
    setMode("dashboard");
    setActiveQueue([]);
    router.refresh();
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Alle Lernfortschritte für diesen Kurs zurücksetzen?",
      );
      if (!ok) return;
    }
    reset();
  };

  const handleDownload = () => {
    const data: SRSExport = {
      version: 1,
      courseId,
      exportedAt: new Date().toISOString(),
      maxNewPerDay,
      cards,
    };
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`srs-${courseId}-${date}.json`, data);
  };

  const handleUploadClick = () => {
    uploadRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string) as Partial<SRSExport>;
        if (raw.version !== 1 || !Array.isArray(raw.cards)) {
          alert("Ungültige Datei — bitte eine exportierte SRS-Datei verwenden.");
          return;
        }
        const ok = window.confirm(
          `Fortschritt aus „${file.name}" importieren? Bestehende Daten für diesen Kurs werden überschrieben.`,
        );
        if (!ok) return;
        writeSRSState(courseId, raw.cards);
        if (typeof raw.maxNewPerDay === "number") {
          writeDailyGoal(courseId, raw.maxNewPerDay);
        }
        router.refresh();
      } catch {
        alert("Datei konnte nicht gelesen werden.");
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-uploaded.
    e.target.value = "";
  };

  if (mode === "session") {
    return (
      <LearnSession
        courseId={courseId}
        courseTitle={course.title}
        queue={activeQueue}
        taskByKind={taskByKind}
        onRate={rate}
        onExit={handleExit}
      />
    );
  }

  return (
    <>
      {/* Hidden file input for import */}
      <input
        ref={uploadRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFileChange}
      />
      <LearnDashboard
        courseTitle={course.title}
        tasks={taskMeta}
        cards={cards}
        stats={stats}
        sessionSize={session.length}
        maxNewPerDay={maxNewPerDay}
        onStart={handleStart}
        onReset={handleReset}
        onSetMaxNewPerDay={setMaxNewPerDay}
        onDownload={handleDownload}
        onUpload={handleUploadClick}
      />
    </>
  );
}
