import type { AnyTaskDefinition } from "@/lib/tasks/types";

export interface CourseDefinition {
  id: string;
  title: string;
  description: string;
  tasks: AnyTaskDefinition[];
}
