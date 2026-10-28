import { ModuleForm } from "@/features/admin/module-pages";

export const metadata = { title: "Add - Clients" };
export default function Page() {
  return <ModuleForm moduleKey="clients" id={null} />;
}
