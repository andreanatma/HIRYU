// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// /**
//  * Idempotent, NON-destructive seed. It only inserts what is missing and never overwrites or deletes existing data.
//  * It deliberately creates NO products, product types, portfolio, clients, brands, team, gallery or blog entries:
//  * those must be real company data entered by an administrator.
//  */

// const slug = (s: string) => s.normalize("NFKD").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

// // The three core services named in the company brief. Wording stays within what the company profile states.
// const services: [string, string][] = [
//   ["Service Maintenance", "Repair, troubleshooting, and maintenance of laboratory, testing, and industrial equipment."],
//   ["Calibration", "Calibration of measuring and testing equipment within our available scope."],
//   ["Equipment Supply", "Supply of testing equipment, laboratory equipment, and industrial equipment."],
// ];

// // Source: Company_Profile_Hiryu_2025.pdf, pages 2-3 (original text is Indonesian; English rendering below keeps the facts).
// // Review this wording before publishing; it can be edited any time in Dashboard > About Us.
// const about: [string, string][] = [
//   ["About PT Hiryu Techno Indonesia",
//     "We are a service company serving the needs for repair, maintenance, calibration, and supply of testing equipment, laboratory equipment, and industrial equipment. We have been working in this field for more than 10 years and have served a wide range of customers, from R&D laboratories, manufacturers, universities, clinics and hospitals, to government laboratories and many others.\n\nThe company was founded as Hiryu Teknik and was renewed as PT Hiryu Techno Indonesia under deed no. AHU-013946.AH.01.30. Year 2023."],
//   ["Our Vision",
//     "To become the leading partner in providing innovative and reliable solutions for laboratory equipment repair, calibration, and supply. We are committed to supporting research and development by providing the best, fastest, and most precise service."],
//   ["Our Mission",
//     "## Providing High-Quality Solutions\n\nOur core is to provide high-quality laboratory solutions to our customers. We are committed to delivering products and services that meet or even exceed industry standards and customer expectations.\n\n## Supporting Research and Innovation\n\nWe understand the important role of laboratories in research and innovation. Our mission is to be a reliable partner for the scientific and industrial community, providing equipment and services that support scientific progress.\n\n## Outstanding Customer Service\n\nWe emphasize customer satisfaction. Our mission is to provide outstanding customer service, including excellent technical support, so that our customers feel supported throughout the journey."],
//   ["Company Principles",
//     "## Top Quality\n\nWe are committed to quality in every aspect of our business, from products and services to internal processes, and strive to give the best to our customers.\n\n## Safety First\n\nSafety is our top priority. We apply strict safety practices to protect our employees, customers, and the public from risks related to our products and services.\n\n## Continuous Innovation\n\nWe believe innovation is key to meeting evolving needs and staying relevant in an ever-changing industry.\n\n## Outstanding Customer Service\n\nWe pay special attention to customer satisfaction and work hard to understand our customers' needs and provide services that meet or exceed their expectations.\n\n## Social and Environmental Responsibility\n\nWe are aware of the impact of our business on society and the environment. We commit to acting responsibly, minimizing environmental impact, and supporting the community around us.\n\n## Partnership and Collaboration\n\nWe understand the importance of working together with customers, business partners, and other industry players, and we build mutually beneficial relationships."],
//   ["Why Choose Us",
//     "- Professional: skilled experts in analyzing, repairing, and maintaining various types of laboratory and industrial equipment, with a focus on quality and safety.\n- Trusted: your trust is our priority; we commit to providing the best service with transparency and integrity.\n- Competitive Price: high-quality repair solutions at competitive rates without compromising work quality.\n- Flexible: flexible schedules and a variety of solution options to accommodate your unique needs.\n- Fast: fast and responsive service; we value your time and aim for satisfying results within a short response time.\n- Customer Satisfaction: repair services that not only fix the problem but also increase your satisfaction and trust in us."],
// ];

// const settings: Record<string, string> = {
//   company_name: "PT Hiryu Techno Indonesia",
//   tagline: "Supplier, Service & Calibration for Laboratory and Testing Equipment.",
//   hero_title: "Precision Instruments. Reliable Solutions.",
//   hero_subtitle: "We support equipment sourcing, technical services, and calibration requirements within our available scope.",
//   footer_description: "Service, repair, and maintenance of laboratory equipment, plus calibration and equipment supply.",
// };

// async function main() {
//   for (const [key, value] of Object.entries(settings)) await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });

//   for (const [i, [name, description]] of services.entries()) {
//     await prisma.service.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name), description, displayOrder: i, isFeatured: true } });
//   }

//   if ((await prisma.aboutSection.count()) === 0) {
//     await prisma.aboutSection.createMany({ data: about.map(([heading, body], i) => ({ heading, body, displayOrder: i })) });
//     console.log("About Us sections created from the company profile PDF (pages 2-3).");
//   }

//   const { SEED_ADMIN_NAME: name, SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: pw } = process.env;
//   if (email && pw) {
//     if (pw.length < 10) throw new Error("SEED_ADMIN_PASSWORD must be at least 10 characters");
//     if ((await prisma.user.count()) === 0) {
//       await prisma.user.create({ data: { name: name || "Super Admin", email: email.toLowerCase(), passwordHash: await bcrypt.hash(pw, 12), role: "SUPER_ADMIN" } });
//       console.log("Super Admin created:", email);
//     } else console.log("Users already exist; Super Admin seed skipped.");
//   } else console.log("SEED_ADMIN_* not set; no account created. Use /dashboard-admin/signup (BOOTSTRAP_TOKEN) or `npm run admin:create`.");
// }

// main().finally(() => prisma.$disconnect());

// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// const slug = (s: string) => s.normalize("NFKD").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

// const services: [string, string][] = [
//   ["Service Maintenance", "Repair, troubleshooting, and maintenance of laboratory, testing, and industrial equipment."],
//   ["Calibration", "Calibration of measuring and testing equipment within our available scope."],
//   ["Equipment Supply", "Supply of testing equipment, laboratory equipment, and industrial equipment."],
// ];

// // Data About Us sudah disesuaikan dengan PDF berbahasa Indonesia dan format markdown
// const about: [string, string][] = [
//   ["Tentang PT Hiryu Techno Indonesia",
//     "Kami adalah perusahaan yang bergerak di bidang jasa, yang melayani kebutuhan reparasi, perbaikan, perawatan, kalibrasi dan pengadaan alat uji, alat laboratorium, alat industri. Kami telah menekuni bidang ini lebih dari 10 tahun, yang sampai saat ini sudah melayani beragam pelanggan mulai dari laboratorium RnD (Riset) manufaktur, Universitas, Klinik & Rumah Sakit, laboratorium balai pemerintahan, dan banyak lainnya.\n\nDidirikan dengan nama Hiryu Teknik dan diperbarui dengan nama PT Hiryu Techno Indonesia dengan akta no AHU-013946.AH.01.30. Tahun 2023."],
//   ["Visi Kami",
//     "Menjadi mitra terkemuka dalam penyediaan solusi perbaikan, kalibrasi dan suplai alat laboratorium yang inovatif dan handal. Kami berkomitmen untuk mendukung kemajuan riset dan pengembangan dengan menyediakan pelayanan yang terbaik, cepat, dan tepat."],
//   ["Misi Kami",
//     "## Memberikan Solusi Berkualitas Tinggi\nIsi utama kami adalah memberikan solusi laboratorium berkualitas tinggi kepada pelanggan kami. Kami berkomitmen untuk menghadirkan produk dan layanan yang memenuhi atau bahkan melebihi standar industri dan harapan pelanggan.\n\n## Mendukung Penelitian dan Inovasi\nKami memahami peran penting laboratorium dalam penelitian dan inovasi. Misi kami adalah menjadi mitra yang dapat diandalkan bagi komunitas ilmiah dan industri, menyediakan alat dan layanan yang mendukung kemajuan ilmiah.\n\n## Pelayanan Pelanggan yang Luar Biasa\nKami menekankan pentingnya kepuasan pelanggan. Misi kami adalah memberikan pelayanan pelanggan yang luar biasa, termasuk dukungan teknis yang unggul, untuk memastikan pelanggan kami merasa didukung sepanjang perjalanan."],
//   ["Prinsip Perusahaan",
//     "## Kualitas Utama\nKami menekankan komitmen kami pada kualitas dalam setiap aspek bisnis kami, mulai dari produk dan layanan hingga proses internal. Kami berusaha untuk memberikan yang terbaik kepada pelanggan kami.\n\n## Keamanan Terutama (Safety First)\nKeamanan adalah prioritas utama kami. Kami menjalankan praktik keselamatan yang ketat untuk melindungi karyawan kami, pelanggan kami, dan masyarakat umum dari risiko yang terkait dengan produk dan layanan kami.\n\n## Inovasi Berkelanjutan\nKami berkomitmen untuk terus berinovasi dan berkembang. Kami percaya bahwa inovasi adalah kunci untuk memenuhi kebutuhan yang berkembang dan menjaga relevansi dalam industri yang selalu berubah.\n\n## Pelayanan Pelanggan yang Luar Biasa\nKami memberikan perhatian khusus pada kepuasan pelanggan. Kami berusaha keras untuk mendengarkan dan memahami kebutuhan pelanggan kami, serta memberikan layanan yang memenuhi atau bahkan melebihi harapan mereka.\n\n## Tanggung Jawab Sosial dan Lingkungan\nKami menyadari dampak sosial dan lingkungan dari bisnis kami. Oleh karena itu, kami berkomitmen untuk bertindak secara bertanggung jawab, menjaga dampak lingkungan sekecil mungkin, dan memberikan dukungan bagi masyarakat di sekitar kami.\n\n## Kerjasama dan Kolaborasi\nKami memahami pentingnya kerjasama dengan pelanggan, mitra bisnis, dan sektor industri lainnya. Kami berusaha untuk membangun hubungan yang saling menguntungkan dan berkontribusi pada kesuksesan bersama."],
//   ["Inilah Mengapa Anda Seharusnya Memilih Kami",
//     "- **Professional**: Kami adalah ahli yang terampil dan berpengalaman dalam menganalisis, memperbaiki, dan merawat berbagai jenis peralatan laboratorium maupun alat industri dengan fokus pada kualitas dan keamanan.\n- **Trusted**: Kepercayaan anda adalah prioritas kami, dan kami berkomitmen memberikan solusi pelayanan terbaik dengan transparansi dan integritas.\n- **Competitive Price**: Kami memberikan solusi perbaikan berkualitas tinggi dengan tarif yang kompetitif dibanding kompetitor kami tanpa mengorbankan kualitas kerja.\n- **Flexible**: Menghadirkan fleksibilitas dalam layanan perbaikan kami. Dari jadwal yang dapat disesuaikan hingga pilihan solusi yang variatif, kami siap mengakomodasi kebutuhan unik anda.\n- **Fast**: Menawarkan layanan perbaikan yang cepat dan responsif. Kami menghargai waktu anda dan berkomitmen untuk memberikan hasil yang memuaskan dengan waktu respon yang singkat.\n- **Customer Satisfication**: Kami berupaya untuk memberikan layanan perbaikan yang tidak hanya memperbaiki masalah, tetapi juga meninggalkan anda dengan perasaan puas pada kualitas."]
// ];

// const settings: Record<string, string> = {
//   company_name: "PT Hiryu Techno Indonesia",
//   tagline: "Supplier, Service & Calibration for Laboratory and Testing Equipment.",
//   hero_title: "Precision Instruments. Reliable Solutions.",
//   hero_subtitle: "We support equipment sourcing, technical services, and calibration requirements within our available scope.",
//   footer_description: "Service, repair, and maintenance of laboratory equipment, plus calibration and equipment supply.",
// };

// async function main() {
//   for (const [key, value] of Object.entries(settings)) await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });

//   for (const [i, [name, description]] of services.entries()) {
//     await prisma.service.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name), description, displayOrder: i, isFeatured: true } });
//   }

//   // Baris ini dimodifikasi: Hapus isi About Us lama, lalu ganti dengan yang baru
//   await prisma.aboutSection.deleteMany({});
//   await prisma.aboutSection.createMany({ data: about.map(([heading, body], i) => ({ heading, body, displayOrder: i })) });
//   console.log("About Us sections re-seeded with Indonesian text from PDF.");

//   const { SEED_ADMIN_NAME: name, SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: pw } = process.env;
//   if (email && pw) {
//     if (pw.length < 10) throw new Error("SEED_ADMIN_PASSWORD must be at least 10 characters");
//     if ((await prisma.user.count()) === 0) {
//       await prisma.user.create({ data: { name: name || "Super Admin", email: email.toLowerCase(), passwordHash: await bcrypt.hash(pw, 12), role: "SUPER_ADMIN" } });
//       console.log("Super Admin created:", email);
//     } else console.log("Users already exist; Super Admin seed skipped.");
//   } else console.log("SEED_ADMIN_* not set; no account created.");
// }

// main().finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const slug = (s: string) => s.normalize("NFKD").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

const services: [string, string][] = [
  ["Service Maintenance", "Repair, troubleshooting, and maintenance of laboratory, testing, and industrial equipment."],
  ["Calibration", "Calibration of measuring and testing equipment within our available scope."],
  ["Equipment Supply", "Supply of testing equipment, laboratory equipment, and industrial equipment."],
];

// Format must match src/components/about-sections.tsx: "## Title\n\nBody" blocks and "- Title: text" bullets.
const about: [string, string][] = [
  ["About PT Hiryu Techno Indonesia",
    "We are a service company serving the needs for repair, maintenance, calibration, and supply of testing equipment, laboratory equipment, and industrial equipment. We have been working in this field for more than 10 years and have served a wide range of customers, from R&D laboratories, manufacturers, universities, clinics and hospitals, to government laboratories and many others.\n\nThe company was founded as Hiryu Teknik and was renewed as PT Hiryu Techno Indonesia under deed no. AHU-013946.AH.01.30. Year 2023."],
  ["Our Vision",
    "To become the leading partner in providing innovative and reliable solutions for laboratory equipment repair, calibration, and supply. We are committed to supporting research and development by providing the best, fastest, and most precise service."],
  ["Our Mission",
    "## Providing High-Quality Solutions\n\nOur core is to provide high-quality laboratory solutions to our customers. We are committed to delivering products and services that meet or even exceed industry standards and customer expectations.\n\n## Supporting Research and Innovation\n\nWe understand the important role of laboratories in research and innovation. Our mission is to be a reliable partner for the scientific and industrial community, providing equipment and services that support scientific progress.\n\n## Outstanding Customer Service\n\nWe emphasize customer satisfaction. Our mission is to provide outstanding customer service, including excellent technical support, so that our customers feel supported throughout the journey."],
  ["Company Principles",
    "## Top Quality\n\nWe are committed to quality in every aspect of our business, from products and services to internal processes, and strive to give the best to our customers.\n\n## Safety First\n\nSafety is our top priority. We apply strict safety practices to protect our employees, customers, and the public from risks related to our products and services.\n\n## Continuous Innovation\n\nWe believe innovation is key to meeting evolving needs and staying relevant in an ever-changing industry.\n\n## Outstanding Customer Service\n\nWe pay special attention to customer satisfaction and work hard to understand our customers' needs and provide services that meet or exceed their expectations.\n\n## Social and Environmental Responsibility\n\nWe are aware of the impact of our business on society and the environment. We commit to acting responsibly, minimizing environmental impact, and supporting the community around us.\n\n## Partnership and Collaboration\n\nWe understand the importance of working together with customers, business partners, and other industry players, and we build mutually beneficial relationships."],
  ["Why Choose Us",
    "- Professional: skilled experts in analyzing, repairing, and maintaining various types of laboratory and industrial equipment, with a focus on quality and safety.\n- Trusted: your trust is our priority; we commit to providing the best service with transparency and integrity.\n- Competitive Price: high-quality repair solutions at competitive rates without compromising work quality.\n- Flexible: flexible schedules and a variety of solution options to accommodate your unique needs.\n- Fast: fast and responsive service; we value your time and aim for satisfying results within a short response time.\n- Customer Satisfaction: repair services that not only fix the problem but also increase your satisfaction and trust in us."],
];

const settings: Record<string, string> = {
  company_name: "PT Hiryu Techno Indonesia",
  tagline: "Supplier, Service & Calibration for Laboratory and Testing Equipment.",
  hero_title: "Precision Instruments. Reliable Solutions.",
  hero_subtitle: "We support equipment sourcing, technical services, and calibration requirements within our available scope.",
  footer_description: "Service, repair, and maintenance of laboratory equipment, plus calibration and equipment supply.",
};

async function main() {
  for (const [key, value] of Object.entries(settings)) await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });

  for (const [i, [name, description]] of services.entries()) {
    await prisma.service.upsert({ where: { slug: slug(name) }, update: {}, create: { name, slug: slug(name), description, displayOrder: i, isFeatured: true } });
  }

  // Non-destructive: only seed About Us when the table is empty.
  if ((await prisma.aboutSection.count()) === 0) {
    await prisma.aboutSection.createMany({ data: about.map(([heading, body], i) => ({ heading, body, displayOrder: i })) });
    console.log("About Us sections created (English).");
  } else {
    console.log("About Us already has content; seed skipped. Edit it in Dashboard > About Us.");
  }

  const { SEED_ADMIN_NAME: name, SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: pw } = process.env;
  if (email && pw) {
    if (pw.length < 10) throw new Error("SEED_ADMIN_PASSWORD must be at least 10 characters");
    if ((await prisma.user.count()) === 0) {
      await prisma.user.create({ data: { name: name || "Super Admin", email: email.toLowerCase(), passwordHash: await bcrypt.hash(pw, 12), role: "SUPER_ADMIN" } });
      console.log("Super Admin created:", email);
    } else console.log("Users already exist; Super Admin seed skipped.");
  } else console.log("SEED_ADMIN_* not set; no account created.");
}

main().finally(() => prisma.$disconnect());