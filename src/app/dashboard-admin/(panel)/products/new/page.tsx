import { ModuleForm } from "@/features/admin/module-pages";

export const metadata = { title: "Add - Products" };
export default function Page() {
  return <ModuleForm moduleKey="products" id={null} />;
}
