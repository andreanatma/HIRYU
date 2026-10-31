import { buildMetadata } from "@/lib/seo";
import { getPageHero } from "@/lib/hero";
import { t } from "@/lib/dictionary";
import { CtaBand, PageHero } from "@/components/public";
import { AboutSections } from "@/components/about-sections";
import { prisma } from "@/lib/db";

export async function generateMetadata() {
  return buildMetadata({
    pageKey: "about-us",
    title: t("nav_about"),
    description: t("about_meta_desc"),
    path: "/about-us",
  });
}

const ABOUT = [
  {
    id: 1,
    heading: "Tentang PT Hiryu Techno Indonesia",
    body: "Kami adalah perusahaan yang bergerak di bidang jasa, yang melayani kebutuhan reparasi, perbaikan, perawatan, kalibrasi dan pengadaan alat uji, alat laboratorium, alat industri. Kami telah menekuni bidang ini lebih dari 10 tahun, yang sampai saat ini sudah melayani beragam pelanggan mulai dari laboratorium RnD (Riset) manufaktur, Universitas, Klinik & Rumah Sakit, laboratorium balai pemerintahan, dan banyak lainnya.\n\nDidirikan dengan nama Hiryu Teknik dan diperbarui dengan nama PT Hiryu Techno Indonesia dengan akta no AHU-013946.AH.01.30. Tahun 2023.",
    imageId: null,
  },
  {
    id: 2,
    heading: "Visi Kami",
    body: "Menjadi mitra terkemuka dalam penyediaan solusi perbaikan, kalibrasi dan suplai alat laboratorium yang inovatif dan handal. Kami berkomitmen untuk mendukung kemajuan riset dan pengembangan dengan menyediakan pelayanan yang terbaik, cepat, dan tepat.",
    imageId: null,
  },
  {
    id: 3,
    heading: "Misi Kami",
    body: "## Memberikan Solusi Berkualitas Tinggi\nIsi utama kami adalah memberikan solusi laboratorium berkualitas tinggi kepada pelanggan kami. Kami berkomitmen untuk menghadirkan produk dan layanan yang memenuhi atau bahkan melebihi standar industri dan harapan pelanggan.\n\n## Mendukung Penelitian dan Inovasi\nKami memahami peran penting laboratorium dalam penelitian dan inovasi. Misi kami adalah menjadi mitra yang dapat diandalkan bagi komunitas ilmiah dan industri, menyediakan alat dan layanan yang mendukung kemajuan ilmiah.\n\n## Pelayanan Pelanggan yang Luar Biasa\nKami menekankan pentingnya kepuasan pelanggan. Misi kami adalah memberikan pelayanan pelanggan yang luar biasa, termasuk dukungan teknis yang unggul, untuk memastikan pelanggan kami merasa didukung sepanjang perjalanan.",
    imageId: null,
  },
  {
    id: 4,
    heading: "Prinsip Perusahaan",
    body: "## Kualitas Utama\nKami menekankan komitmen kami pada kualitas dalam setiap aspek bisnis kami, mulai dari produk dan layanan hingga proses internal. Kami berusaha untuk memberikan yang terbaik kepada pelanggan kami.\n\n## Keamanan Terutama (Safety First)\nKeamanan adalah prioritas utama kami. Kami menjalankan praktik keselamatan yang ketat untuk melindungi karyawan kami, pelanggan kami, dan masyarakat umum dari risiko yang terkait dengan produk dan layanan kami.\n\n## Inovasi Berkelanjutan\nKami berkomitmen untuk terus berinovasi dan berkembang. Kami percaya bahwa inovasi adalah kunci untuk memenuhi kebutuhan yang berkembang dan menjaga relevansi dalam industri yang selalu berubah.\n\n## Pelayanan Pelanggan yang Luar Biasa\nKami memberikan perhatian khusus pada kepuasan pelanggan. Kami berusaha keras untuk mendengarkan dan memahami kebutuhan pelanggan kami, serta memberikan layanan yang memenuhi atau bahkan melebihi harapan mereka.\n\n## Tanggung Jawab Sosial dan Lingkungan\nKami menyadari dampak sosial dan lingkungan dari bisnis kami. Oleh karena itu, kami berkomitmen untuk bertindak secara bertanggung jawab, menjaga dampak lingkungan sekecil mungkin, dan memberikan dukungan bagi masyarakat di sekitar kami.\n\n## Kerjasama dan Kolaborasi\nKami memahami pentingnya kerjasama dengan pelanggan, mitra bisnis, dan sektor industri lainnya. Kami berusaha untuk membangun hubungan yang saling menguntungkan dan berkontribusi pada kesuksesan bersama.",
    imageId: null,
  },
  {
    id: 5,
    heading: "Mengapa Memilih Kami?",
    body: "- Professional: Kami adalah ahli yang terampil dan berpengalaman dalam menganalisis, memperbaiki, dan merawat berbagai jenis peralatan laboratorium maupun alat industri dengan fokus pada kualitas dan keamanan.\n- Trusted: Kepercayaan Anda adalah prioritas kami, dan kami berkomitmen memberikan solusi pelayanan terbaik dengan transparansi dan integritas.\n- Competitive Price: Kami memberikan solusi perbaikan berkualitas tinggi dengan tarif yang kompetitif dibanding kompetitor kami tanpa mengorbankan kualitas kerja.\n- Flexible: Menghadirkan fleksibilitas dalam layanan perbaikan kami. Dari jadwal yang dapat disesuaikan hingga pilihan solusi yang variatif, kami siap mengakomodasi kebutuhan unik Anda.\n- Fast: Menawarkan layanan perbaikan yang cepat dan responsif. Kami menghargai waktu Anda dan berkomitmen untuk memberikan hasil yang memuaskan dengan waktu respon yang singkat.\n- Customer Satisfaction: Kami berupaya untuk memberikan layanan perbaikan yang tidak hanya memperbaiki masalah, tetapi juga meninggalkan Anda dengan perasaan puas pada kualitas.",
    imageId: null,
  },
];

export default async function AboutUs() {
  const hero = await getPageHero("about");
  const team = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
  });

  return (
    <>
      <PageHero
        eyebrow={t("about_eyebrow")}
        title={hero.title}
        text={hero.text}
        imageId={hero.imageId}
        icon="info"
        blend="mist"
      />

      <AboutSections
        sections={ABOUT}
        companyName="PT Hiryu Techno Indonesia"
        team={team.map((m) => ({ id: m.id, name: m.name, role: m.position, imageUrl: m.photoId ? `/media/${m.photoId}` : null }))}
        teamEyebrow={t("team_eyebrow")}
        teamTitle={t("team_title")}
      />

      <CtaBand title={t("about_cta_t")} text={t("about_cta_x")} />
    </>
  );
}