import { ModuleForm } from "@/features/admin/module-pages";

export const metadata = { title: "Add - Blogs" };
export default function Page() {
  return <ModuleForm moduleKey="blogs" id={null} />;
}
