import { permanentRedirect } from "next/navigation";

// Legacy route: the team now lives on the About Us page.
export default function Team() {
  permanentRedirect("/about-us");
}
