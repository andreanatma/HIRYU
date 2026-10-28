import { ModuleList } from "@/features/admin/module-pages";

export const metadata = { title: "Brands" };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ModuleList moduleKey="brands" searchParams={await searchParams} />;
}
