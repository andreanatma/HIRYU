"use client";

import { useActionState } from "react";
import { saveHeroes } from "../hero-actions";
import type { FormState } from "../crud-actions";
import { FileField, MultiImageField } from "@/components/client";
import { HERO_PAGES, HERO_TEXT_MAX, HERO_TITLE_MAX, HOME_HERO_MAX, HOME_SLIDES_FIELD, heroField } from "@/lib/hero-config";
import { Field, FormActions, FormAlert, FormSection, TextField, submitVia, useFocusAlert } from "./form-ui";

const init: FormState = { ok: false };

export type HeroFormValues = {
  slides: number[];
  pages: Record<string, { imageId: number | null; title: string; description: string }>;
};

const IMG_HELP = "Landscape photo, ideally 1920×900 px or larger (JPG, PNG, WebP; max 8 MB). Leave empty to use the plain navy hero.";

export function HeroSettingsForm({ values }: { values: HeroFormValues }) {
  const [s, dispatch, pending] = useActionState(saveHeroes, init);
  const e = s.errors ?? {};
  useFocusAlert(s, !!s.message);

  return (
    <form onSubmit={submitVia(dispatch)} className="max-w-3xl space-y-6">
      {s.message && <FormAlert tone={s.ok ? "success" : "error"} title={s.message} />}

      <FormSection
        icon="slideshow"
        title="Homepage hero images"
        desc={`Slider images on the homepage (up to ${HOME_HERO_MAX}). The slide animation stays the same. The title and description are edited in “Homepage hero” above.`}
        delayMs={60}
      >
        <Field name={HOME_SLIDES_FIELD} label="Slider images" plain help="Add, remove, or reorder images. If you remove them all, the default images are used.">
          <MultiImageField name={HOME_SLIDES_FIELD} initial={values.slides} max={HOME_HERO_MAX} emptyText="Using the default images. " />
        </Field>
      </FormSection>

      {HERO_PAGES.map((p, i) => {
        const v = values.pages[p.key] ?? { imageId: null, title: "", description: "" };
        const kImg = heroField(p.key, "imageId");
        const kTitle = heroField(p.key, "title");
        const kDesc = heroField(p.key, "description");
        return (
          <FormSection key={p.key} icon={p.icon} title={`${p.label} hero`} desc={`Banner at the top of the ${p.label} page. One image only.`} delayMs={120 + i * 40}>
            <div className="space-y-5">
              <Field name={kImg} label={`${p.label} hero image`} plain help={IMG_HELP}>
                <FileField name={kImg} kind="image" initialId={v.imageId} error={e[kImg]} />
              </Field>
              <TextField name={kTitle} label={`${p.label} hero title`} defaultValue={v.title} error={e[kTitle]} max={HERO_TITLE_MAX} placeholder={p.defTitle} help="Leave empty to use the default title." />
              <TextField name={kDesc} label={`${p.label} hero description`} defaultValue={v.description} error={e[kDesc]} max={HERO_TEXT_MAX} multiline rows={3} placeholder={p.defText} help="Leave empty to use the default description." />
            </div>
          </FormSection>
        );
      })}

      <FormActions pending={pending} saveLabel="Save hero settings" note="Changes appear on the public website right after saving." />
    </form>
  );
}
