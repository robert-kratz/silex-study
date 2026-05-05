import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses/registry";
import { LearnPageClient } from "@/components/learn-page-client";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);
  if (!course) notFound();

  return <LearnPageClient courseId={courseId} />;
}
