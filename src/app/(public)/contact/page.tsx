import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getPageHero } from "@/lib/hero";
import { t } from "@/lib/dictionary";
import { Icon } from "@/components/ui";
import { PageHero } from "@/components/public";
import { Reveal } from "@/components/public/reveal";
import { ContactSection } from "@/components/contact-section";

export async function generateMetadata() {
  return buildMetadata({ pageKey: "contact", title: t("nav_contact"), description: t("contact_meta_desc"), path: "/contact" });
}

export default async function Contact() {
  const hero = await getPageHero("contact");
  return (
    <>
      {/* blend="mist": bagian bawah hero memudar halus ke warna section berikutnya (tidak ada lagi garis/jeda tegas) */}
      <PageHero eyebrow={t("contact_hero_eyebrow")} title={hero.title} text={hero.text} imageId={hero.imageId} icon="headset_mic" blend="mist" />

      {/* Latar sama seperti halaman Products: mist → biru muda (pola titik) → putih */}
      <section className="sec-deco sec-dots bg-gradient-to-b from-mist via-[#EAF3FF] to-white pb-14 pt-4 md:pb-16 md:pt-6">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-label-md text-on-surface-variant">
            <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary"><Icon name="home" className="text-[16px]" />Home</Link>
            <Icon name="chevron_right" className="text-[14px]" />
            <span aria-current="page" className="text-on-surface">{t("nav_contact")}</span>
          </nav>
          <Reveal><ContactSection /></Reveal>
        </div>
      </section>
    </>
  );
}