import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { MediaImg, SafeText } from "@/components/ui";
import { CtaBand, PageHero, SectionHead } from "@/components/public";

export const generateMetadata = () => buildMetadata({ pageKey: "about-us", title: "About Us", description: "Who we are, our vision and mission, and the principles we work by.", path: "/about-us" });

// Isi About Us (sumber: Company_Profile_Hiryu_2025.pdf). Edit langsung di sini.
const SECTIONS: { heading: string; body: string }[] = [
  { heading: "About PT Hiryu Techno Indonesia",
    body: "We are a service company serving the needs for repair, maintenance, calibration, and supply of testing equipment, laboratory equipment, and industrial equipment. We have been working in this field for more than 10 years and have served a wide range of customers, from R&D laboratories, manufacturers, universities, clinics and hospitals, to government laboratories and many others.\n\nThe company was founded as Hiryu Teknik and was renewed as PT Hiryu Techno Indonesia under deed no. AHU-013946.AH.01.30. Year 2023." },
  { heading: "Our Vision",
    body: "To become the leading partner in providing innovative and reliable solutions for laboratory equipment repair, calibration, and supply. We are committed to supporting research and development by providing the best, fastest, and most precise service." },
  { heading: "Our Mission",
    body: "## Providing High-Quality Solutions\n\nOur core is to provide high-quality laboratory solutions to our customers. We are committed to delivering products and services that meet or even exceed industry standards and customer expectations.\n\n## Supporting Research and Innovation\n\nWe understand the important role of laboratories in research and innovation. Our mission is to be a reliable partner for the scientific and industrial community, providing equipment and services that support scientific progress.\n\n## Outstanding Customer Service\n\nWe emphasize customer satisfaction. Our mission is to provide outstanding customer service, including excellent technical support, so that our customers feel supported throughout the journey." },
  { heading: "Company Principles",
    body: "## Top Quality\n\nWe are committed to quality in every aspect of our business, from products and services to internal processes, and strive to give the best to our customers.\n\n## Safety First\n\nSafety is our top priority. We apply strict safety practices to protect our employees, customers, and the public from risks related to our products and services.\n\n## Continuous Innovation\n\nWe believe innovation is key to meeting evolving needs and staying relevant in an ever-changing industry.\n\n## Outstanding Customer Service\n\nWe pay special attention to customer satisfaction and work hard to understand our customers' needs and provide services that meet or exceed their expectations.\n\n## Social and Environmental Responsibility\n\nWe are aware of the impact of our business on society and the environment. We commit to acting responsibly, minimizing environmental impact, and supporting the community around us.\n\n## Partnership and Collaboration\n\nWe understand the importance of working together with customers, business partners, and other industry players, and we build mutually beneficial relationships." },
  { heading: "Why Choose Us",
    body: "- Professional: skilled experts in analyzing, repairing, and maintaining various types of laboratory and industrial equipment, with a focus on quality and safety.\n- Trusted: your trust is our priority; we commit to providing the best service with transparency and integrity.\n- Competitive Price: high-quality repair solutions at competitive rates without compromising work quality.\n- Flexible: flexible schedules and a variety of solution options to accommodate your unique needs.\n- Fast: fast and responsive service; we value your time and aim for satisfying results within a short response time.\n- Customer Satisfaction: repair services that not only fix the problem but also increase your satisfaction and trust in us." },
];

export default async function AboutUs() {
  const team = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: "asc" }, { id: "asc" }] });
  return (
    <>
      <PageHero eyebrow="About us" title="PT Hiryu Techno Indonesia" text="Service, repair, maintenance, calibration, and supply of laboratory, testing, and industrial equipment." icon="info" />
      <div className="container-x py-14">
        <div className="space-y-16">
          {SECTIONS.map((s, i) => (
            <section key={i} aria-labelledby={`about-${i}`}>
              <h2 id={`about-${i}`} className="text-headline-xl text-navy">{s.heading}</h2>
              <div className="mb-5 mt-3 h-1 w-14 rounded bg-accent" />
              <SafeText text={s.body} />
            </section>
          ))}
        </div>
        {team.length > 0 && (
          <section className="mt-20" aria-labelledby="team-h">
            <SectionHead eyebrow="People" title="Our Team" />
            <h2 id="team-h" className="sr-only">Our Team</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((t) => <div key={t.id} className="card overflow-hidden"><MediaImg id={t.photoId} alt={`Photo of ${t.name}`} className="aspect-[4/3] w-full" icon="person" /><div className="p-5"><h3 className="text-title-lg text-navy">{t.name}</h3><p className="text-body-sm text-primary">{t.position}</p></div></div>)}
            </div>
          </section>
        )}
      </div>
      <CtaBand title="Work with us" text="Talk to our team about your equipment supply, service, or calibration needs." />
    </>
  );
}