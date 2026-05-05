import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { decodeTask, encodeTask, TaskDecodeError } from "@/lib/encoding";
import { randomSeed } from "@/lib/random";
import { getCourse, getCourseTask } from "@/lib/courses/registry";
import type { TaskToken } from "@/lib/tasks/types";

interface PageProps {
  params: Promise<{ course: string; type: string }>;
  searchParams: Promise<{ t?: string }>;
}

export default async function TaskPage({ params, searchParams }: PageProps) {
  const { course: courseId, type } = await params;
  const { t } = await searchParams;

  const course = getCourse(courseId);
  if (!course) notFound();
  const task = getCourseTask(courseId, type);
  if (!task) notFound();

  const basePath = `/kurs/${courseId}/aufgabe/${task.kind}`;

  // No token → generate a fresh one and redirect.
  if (!t) {
    const seed = randomSeed();
    const token: TaskToken = { v: task.schemaVersion, k: task.kind, s: seed };
    redirect(`${basePath}?t=${encodeTask(token)}`);
  }

  let token: TaskToken;
  try {
    token = decodeTask<TaskToken>(t);
  } catch (err) {
    return (
      <ErrorView
        courseId={courseId}
        title="Aufgabencode ungültig"
        message={
          err instanceof TaskDecodeError
            ? err.message
            : "Der Aufgabencode konnte nicht gelesen werden."
        }
        retryHref={basePath}
      />
    );
  }

  if (token.k !== task.kind) {
    return (
      <ErrorView
        courseId={courseId}
        title="Aufgabencode passt nicht"
        message={`Der Code gehört zu „${token.k}", nicht zu „${task.kind}".`}
        retryHref={basePath}
      />
    );
  }
  if (token.v !== task.schemaVersion) {
    return (
      <ErrorView
        courseId={courseId}
        title="Aufgabencode veraltet"
        message="Diese Aufgabe wurde inzwischen aktualisiert. Erzeuge eine neue Version."
        retryHref={basePath}
      />
    );
  }
  if (typeof token.s !== "number" || !Number.isFinite(token.s)) {
    return (
      <ErrorView
        courseId={courseId}
        title="Aufgabencode ungültig"
        message="Der Seed im Aufgabencode ist nicht gültig."
        retryHref={basePath}
      />
    );
  }

  const params2 = task.generate(token.s);
  const solution = task.solve(params2);
  const shareUrl = `${basePath}?t=${t}`;

  const Component = task.Component;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {task.tutorium} · {course.title}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {task.title}
        </h1>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </div>
      <Component
        params={params2}
        solution={solution}
        seed={token.s}
        shareUrl={shareUrl}
        courseId={courseId}
      />
    </div>
  );
}

function ErrorView({
  courseId,
  title,
  message,
  retryHref,
}: {
  courseId: string;
  title: string;
  message: string;
  retryHref: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="mt-4 flex gap-2">
        <Button asChild>
          <Link href={retryHref}>Neue Aufgabe</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/kurs/${courseId}`}>Zur Kursübersicht</Link>
        </Button>
      </div>
    </div>
  );
}
