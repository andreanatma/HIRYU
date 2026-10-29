import { buildMetadata } from "@/lib/seo";
import { getT } from "@/lib/i18n";
import { loc } from "@/lib/lang"; 
import { MediaImg } from "@/components/ui";
import { CtaBand, PageHero, SectionHead } from "@/components/public";
import { AboutSections } from "@/components/about-sections";
import { prisma } from "@/lib/db"; 

export async function generateMetadata() {
  const { t } = await getT();
  return buildMetadata({
    pageKey: "about-us",
    title: t("nav_about"),
    description: t("about_meta_desc"),
    path: "/about-us",
  });
}

// 1. Data Bahasa Indonesia
const ABOUT_ID = [
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
    heading: "Mengapa Memilih Kami",
    body: "- Professional: Kami adalah ahli yang terampil dan berpengalaman dalam menganalisis, memperbaiki, dan merawat berbagai jenis peralatan laboratorium maupun alat industri dengan fokus pada kualitas dan keamanan.\n- Trusted: Kepercayaan anda adalah prioritas kami, dan kami berkomitmen memberikan solusi pelayanan terbaik dengan transparansi dan integritas.\n- Competitive Price: Kami memberikan solusi perbaikan berkualitas tinggi dengan tarif yang kompetitif dibanding kompetitor kami tanpa mengorbankan kualitas kerja.\n- Flexible: Menghadirkan fleksibilitas dalam layanan perbaikan kami. Dari jadwal yang dapat disesuaikan hingga pilihan solusi yang variatif, kami siap mengakomodasi kebutuhan unik anda.\n- Fast: Menawarkan layanan perbaikan yang cepat dan responsif. Kami menghargai waktu anda dan berkomitmen untuk memberikan hasil yang memuaskan dengan waktu respon yang singkat.\n- Customer Satisfication: Kami berupaya untuk memberikan layanan perbaikan yang tidak hanya memperbaiki masalah, tetapi juga meninggalkan anda dengan perasaan puas pada kualitas.",
    imageId: null,
  },
];

// 2. Data Bahasa Inggris
const ABOUT_EN = [
  {
    id: 1,
    heading: "About PT Hiryu Techno Indonesia",
    body: "We are a service company serving the needs for repair, maintenance, calibration, and supply of testing equipment, laboratory equipment, and industrial equipment. We have been working in this field for more than 10 years and have served a wide range of customers, from R&D laboratories, manufacturers, universities, clinics and hospitals, to government laboratories and many others.\n\nThe company was founded as Hiryu Teknik and was renewed as PT Hiryu Techno Indonesia under deed no. AHU-013946.AH.01.30. Year 2023.",
    imageId: null,
  },
  {
    id: 2,
    heading: "Our Vision",
    body: "To become the leading partner in providing innovative and reliable solutions for laboratory equipment repair, calibration, and supply. We are committed to supporting research and development by providing the best, fastest, and most precise service.",
    imageId: null,
  },
  {
    id: 3,
    heading: "Our Mission",
    body: "## Providing High-Quality Solutions\nOur core is to provide high-quality laboratory solutions to our customers. We are committed to delivering products and services that meet or even exceed industry standards and customer expectations.\n\n## Supporting Research and Innovation\nWe understand the important role of laboratories in research and innovation. Our mission is to be a reliable partner for the scientific and industrial community, providing equipment and services that support scientific progress.\n\n## Outstanding Customer Service\nWe emphasize customer satisfaction. Our mission is to provide outstanding customer service, including excellent technical support, so that our customers feel supported throughout the journey.",
    imageId: null,
  },
  {
    id: 4,
    heading: "Company Principles",
    body: "## Top Quality\nWe are committed to quality in every aspect of our business, from products and services to internal processes, and strive to give the best to our customers.\n\n## Safety First\nSafety is our top priority. We apply strict safety practices to protect our employees, customers, and the public from risks related to our products and services.\n\n## Continuous Innovation\nWe believe innovation is key to meeting evolving needs and staying relevant in an ever-changing industry.\n\n## Outstanding Customer Service\nWe pay special attention to customer satisfaction and work hard to understand our customers' needs and provide services that meet or exceed their expectations.\n\n## Social and Environmental Responsibility\nWe are aware of the impact of our business on society and the environment. We commit to acting responsibly, minimizing environmental impact, and supporting the community around us.\n\n## Partnership and Collaboration\nWe understand the importance of working together with customers, business partners, and other industry players, and we build mutually beneficial relationships.",
    imageId: null,
  },
  {
    id: 5,
    heading: "Why Choose Us",
    body: "- Professional: skilled experts in analyzing, repairing, and maintaining various types of laboratory and industrial equipment, with a focus on quality and safety.\n- Trusted: your trust is our priority; we commit to providing the best service with transparency and integrity.\n- Competitive Price: high-quality repair solutions at competitive rates without compromising work quality.\n- Flexible: flexible schedules and a variety of solution options to accommodate your unique needs.\n- Fast: fast and responsive service; we value your time and aim for satisfying results within a short response time.\n- Customer Satisfaction: repair services that not only fix the problem but also increase your satisfaction and trust in us.",
    imageId: null,
  },
];

export default async function AboutUs() {
  const { lang, t } = await getT(); // Mengambil bahasa saat ini (id atau en)
  
  // 3. Logika Pemilihan Bahasa
  const activeData = lang === "id" ? ABOUT_ID : ABOUT_EN;
  
  const team = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
  });

  return (
    <>
      <PageHero
        eyebrow={t("about_eyebrow")}
        title="PT Hiryu Techno Indonesia"
        text={t("about_hero_text")}
        icon="info"
      />
      
      {/* 4. Melempar data sesuai bahasa yang aktif */}
      <AboutSections
        sections={activeData}
        companyName="PT Hiryu Techno Indonesia" 
      />

      {team.length > 0 && (
        <div className="container-x py-14">
          <section aria-labelledby="team-h">
            <SectionHead eyebrow={t("team_eyebrow")} title={t("team_title")} />
            <h2 id="team-h" className="sr-only">
              {t("team_title")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <div key={m.id} className="card overflow-hidden">
                  <MediaImg
                    id={m.photoId}
                    alt={m.name}
                    className="aspect-[4/3] w-full"
                    icon="person"
                  />
                  <div className="p-5">
                    <h3 className="text-title-lg text-navy">{m.name}</h3>
                    <p className="text-body-sm text-primary">
                      {loc(m, "position", lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <CtaBand title={t("about_cta_t")} text={t("about_cta_x")} />
    </>
  );
}