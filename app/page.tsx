import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

import { listCourses } from "@/lib/courses/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10">
      <header className="flex items-center justify-between border-b pb-5">
        <Link href="/" className="text-sm font-medium tracking-tight">
          Silex Study
        </Link>
        <span className="text-xs text-muted-foreground">Open Source Learning</span>
      </header>

      <section className="grid flex-1 gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-end md:py-24">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">Modular courses, clean paths, MDX content.</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
            Learn in focused, composable paths.
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {listCourses().map((course) => (
            <Link key={course.id} href={`/kurs/${course.id}`} prefetch={false} className="group block focus:outline-none">
              <Card className="h-full border bg-card transition-colors group-hover:border-foreground/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl font-medium tracking-tight">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{course.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
