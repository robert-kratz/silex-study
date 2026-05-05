import type { CourseDefinition } from "./types";
import { internesRechnungswesen } from "./internes-rechnungswesen";

const courses: CourseDefinition[] = [internesRechnungswesen];

export const courseRegistry: Readonly<Record<string, CourseDefinition>> =
  Object.freeze(Object.fromEntries(courses.map((c) => [c.id, c])));

export function listCourses(): CourseDefinition[] {
  return courses;
}

export function getCourse(id: string): CourseDefinition | undefined {
  return courseRegistry[id];
}

export function getCourseTask(courseId: string, taskKind: string) {
  const course = getCourse(courseId);
  if (!course) return undefined;
  return course.tasks.find((t) => t.kind === taskKind);
}
