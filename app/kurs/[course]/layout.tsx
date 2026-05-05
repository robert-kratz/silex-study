import { notFound } from "next/navigation";
import { CourseSidebar } from "@/components/course-sidebar";
import { getCourse } from "@/lib/courses/registry";

export default async function CourseLayout({
  params,
  children,
}: {
  params: Promise<{ course: string }>;
  children: React.ReactNode;
}) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  const tasks = course.tasks.map((t) => ({
    kind: t.kind,
    title: t.title,
    tutorium: t.tutorium,
  }));

  return (
    <div className="relative">
      <CourseSidebar
        courseId={course.id}
        courseTitle={course.title}
        tasks={tasks}
      />
      <div className="lg:pl-72">{children}</div>
    </div>
  );
}
