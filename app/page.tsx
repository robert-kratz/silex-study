import Link from "next/link";
import { listCourses } from "@/lib/courses/registry";

export default function HomePage() {
  const courses = listCourses();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Übungsplattform
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Kurse
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Wähle einen Kurs, um Aufgaben mit zufälligen Werten zu üben. Fortschritt
          wird lokal in deinem Browser gespeichert.
        </p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <li key={course.id}>
            <Link
              href={`/kurs/${course.id}`}
              className="block rounded-xl border bg-card p-5 transition-colors hover:bg-accent/40"
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {course.tasks.length} Aufgabentyp
                {course.tasks.length === 1 ? "" : "en"}
              </div>
              <div className="mt-1 text-lg font-semibold leading-tight">
                {course.title}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {course.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
