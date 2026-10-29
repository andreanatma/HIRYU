import Link from "next/link";
import { t } from "@/lib/dictionary";

export default function NotFound() {
  return <div className="container-x py-24 text-center"><h1 className="text-display-md text-navy">{t("nf_title")}</h1><p className="mt-3 text-body-lg text-on-surface-variant">{t("nf_text")}</p><Link href="/" className="btn-primary mt-6">{t("back_home")}</Link></div>;
}