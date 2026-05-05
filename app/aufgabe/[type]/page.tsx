import { redirect } from "next/navigation";

export default async function LegacyTaskRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { type } = await params;
  const { t } = await searchParams;
  const target = `/kurs/internes-rechnungswesen/aufgabe/${type}${t ? `?t=${t}` : ""}`;
  redirect(target);
}
