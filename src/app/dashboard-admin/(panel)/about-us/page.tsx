import { ModuleList } from "@/features/admin/module-pages";

export const metadata = { title: "About Us" };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ModuleList moduleKey="about-us" searchParams={await searchParams} />;
}
