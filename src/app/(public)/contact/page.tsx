import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/public";
import { ContactSection } from "@/components/contact-section";

export const generateMetadata = () => buildMetadata({ pageKey: "contact", title: "Contact Us", description: "Send an inquiry for equipment supply, service, or calibration.", path: "/contact" });

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Tell us what you need" text="Send a message and our team will get back to you. Your message is stored securely in our system." icon="headset_mic" />
      <section className="container-x py-14"><ContactSection /></section>
    </>
  );
}
