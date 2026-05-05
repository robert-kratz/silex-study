"use client";

import * as React from "react";
import Link from "next/link";
import { AttemptProgressBar } from "@/components/attempt-progress-bar";
import { Badge } from "@/components/ui/badge";
import { readAttempts, summarize, type AttemptStats } from "@/lib/attempts";

export interface TaskListItem {
  courseId: string;
  kind: string;
  title: string;
  tutorium: string;
  description: string;
}

export function TaskList({ tasks }: { tasks: TaskListItem[] }) {
  const [version, setVersion] = React.useState(0);

  React.useEffect(() => {
    const onStorage = () => setVersion((v) => v + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {tasks.map((task) => (
        <TaskListEntry key={task.kind} task={task} versionKey={version} />
      ))}
    </ul>
  );
}

function TaskListEntry({
  task,
  versionKey,
}: {
  task: TaskListItem;
  versionKey: number;
}) {
  const [stats, setStats] = React.useState<AttemptStats | null>(null);
  React.useEffect(() => {
    setStats(summarize(readAttempts(task.courseId, task.kind)));
  }, [task.courseId, task.kind, versionKey]);

  return (
    <li>
      <Link
        href={`/kurs/${task.courseId}/aufgabe/${task.kind}`}
        className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/40"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {task.tutorium}
            </div>
            <div className="font-medium leading-snug">{task.title}</div>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          {stats && stats.total > 0 ? (
            <Badge variant={stats.passed > 0 ? "secondary" : "outline"} className="shrink-0">
              {stats.passed}/{stats.total}
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0">neu</Badge>
          )}
        </div>
        <div className="mt-3 space-y-1.5">
          {stats && stats.total > 0 ? (
            <AttemptProgressBar stats={stats} className="h-1.5" />
          ) : (
            <div className="h-1.5 rounded-full bg-secondary" />
          )}
          <p className="text-xs text-muted-foreground">
            {stats && stats.total > 0
              ? `${stats.passed} richtig · ${stats.failed} nicht bestanden · ${stats.skipped} übersprungen · ${stats.scoreRate}% Felder korrekt`
              : "Noch nicht bearbeitet"}
          </p>
        </div>
      </Link>
    </li>
  );
}
