import { buildMetadata } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { PageHero } from "@/components/public";
import { ContactSection } from "@/components/contact-section";

export async function generateMetadata() {
  const { t } = await getT();
  return buildMetadata({ pageKey: "contact", title: t("nav_contact"), description: t("contact_meta_desc"), path: "/contact" });
}

export default async function Contact() {
  const { t } = await getT();
  return (
    <>
      <PageHero eyebrow={t("contact_hero_eyebrow")} title={t("contact_hero_title")} text={t("contact_hero_text")} icon="headset_mic" />
      <section className="container-x py-14"><ContactSection /></section>
    </>
  );
}