import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { getHeroFormValues } from "@/lib/hero";
import { PageHeader } from "@/features/admin/module-pages";
import { PasswordForm, SettingsForm } from "@/features/admin/forms";
import { HeroSettingsForm } from "@/features/admin/hero-form";

export const metadata = { title: "Settings" };
export default async function SettingsPage() {
  const me = await requireUser();
  const isSuper = me.role === "SUPER_ADMIN";
  const [s, hero] = await Promise.all([getSettings(), isSuper ? getHeroFormValues() : Promise.resolve(null)]);
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" desc={isSuper ? "Site settings, hero banners and account security." : "Account security."} />
      {isSuper && <SettingsForm values={s} />}
      {isSuper && hero && (
        <div id="hero-banners" className="scroll-mt-24 space-y-3">
          <h2 className="text-headline-md text-navy">Hero banners</h2>
          <HeroSettingsForm values={hero} />
        </div>
      )}
      <PasswordForm />
    </div>
  );
}
