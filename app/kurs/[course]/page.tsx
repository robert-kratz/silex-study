import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses/registry";
import { TaskList } from "@/components/task-list";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const items = course.tasks.map((t) => ({
    courseId: course.id,
    kind: t.kind,
    title: t.title,
    tutorium: t.tutorium,
    description: t.description,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Kurs
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {course.title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {course.description}
        </p>
      </header>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Aufgabentypen
        </h2>
        <TaskList tasks={items} />
      </section>
    </div>
  );
}
