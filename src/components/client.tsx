"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Icon, MediaImg } from "./ui";
import { pingSession } from "@/features/auth-actions";
import { createGalleryItems, uploadMedia } from "@/features/crud-actions";
import { T, fmt } from "@/lib/dictionary";

export function SubmitButton({ children, className = "btn-accent", pendingText = "Saving…" }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

/** Toast from ?msg= query. Removed from the URL after display. */
export function Toast() {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const msg = sp.get("msg");
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    setText(msg);
    const q = new URLSearchParams(sp.toString());
    q.delete("msg");
    router.replace(q.size ? `${path}?${q}` : path, { scroll: false });
    const t = setTimeout(() => setText(null), 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);
  if (!text) return null;
  const bad = /fail|denied|cannot|could not|not found|still in use|invalid/i.test(text);
  return (
    <div role="status" aria-live="polite" className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-[0_10px_15px_-3px_rgba(15,23,42,0.07)] ${bad ? "border-error/40" : "border-line"}`}>
      <Icon name={bad ? "error" : "check_circle"} fill className={bad ? "text-error" : "text-success"} />
      <p className="text-body-sm text-navy">{text}</p>
      <button onClick={() => setText(null)} aria-label="Close notification" className="text-outline hover:text-navy"><Icon name="close" className="text-[18px]" /></button>
    </div>
  );
}

/** Delete button with a confirmation dialog. `action` is an already-bound server action. */
export function ConfirmButton({ action, label = "Delete", title, text, variant = "icon", icon = "delete" }: { action: () => Promise<void>; label?: string; title: string; text: string; variant?: "icon" | "button"; icon?: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);
  return (
    <>
      {variant === "icon" ? (
        <button type="button" onClick={() => setOpen(true)} aria-label={`${label}: ${title}`} title={label} className="rounded p-1.5 text-on-surface-variant hover:bg-error-container hover:text-error"><Icon name={icon} className="text-[20px]" /></button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary !text-error">{label}</button>
      )}
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/40 p-4" onClick={() => setOpen(false)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="cd-t" className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1)]" onClick={(e) => e.stopPropagation()}>
            <h3 id="cd-t" className="text-title-lg">{title}</h3>
            <p className="mt-2 text-body-md text-on-surface-variant">{text}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button ref={ref} className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-danger" disabled={pending} onClick={() => start(async () => { await action(); })}>{pending ? "Working…" : label}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Single image/PDF upload with preview. Stores the media ID in a hidden input. */
export function FileField({ name, kind, initialId, initialName, error }: { name: string; kind: "image" | "pdf"; initialId?: number | null; initialName?: string; error?: string }) {
  const [id, setId] = useState<number | null>(initialId ?? null);
  const [info, setInfo] = useState<{ name: string; size?: number } | null>(initialId ? { name: initialName ?? `File #${initialId}` } : null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    setBusy(true);
    const fd = new FormData();
    fd.set("file", f);
    try {
      const r = await uploadMedia(kind, true, fd);
      if (r.ok && r.id) { setId(r.id); setInfo({ name: r.name ?? f.name, size: r.size }); } else setErr(r.error ?? "Upload failed.");
    } catch { setErr("Upload failed. Check the file size and your connection."); }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input type="hidden" name={name} value={id ?? ""} />
      <div className="flex items-center gap-4 rounded border border-dashed border-[#C3CDDA] bg-mist p-3">
        {kind === "image" ? (
          id ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={`/media/${id}`} alt="Preview" className="h-20 w-28 rounded object-cover" /> : <div className="flex h-20 w-28 items-center justify-center rounded bg-surface-container text-outline"><Icon name="image" className="text-[32px]" /></div>
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded bg-surface-container text-primary"><Icon name="picture_as_pdf" className="text-[32px]" /></div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-title-md">{info ? info.name : "No file yet"}</p>
          <p className="text-body-sm text-on-surface-variant">{info?.size ? `${(info.size / 1024).toFixed(0)} KB · ` : ""}{kind === "image" ? "JPG, PNG, WebP, GIF" : "PDF"}</p>
          <div className="mt-2 flex gap-2">
            <button type="button" className="btn-secondary !px-3 !py-1.5" disabled={busy} onClick={() => inputRef.current?.click()}>{busy ? "Uploading…" : id ? "Replace file" : "Choose file"}</button>
            {id && <button type="button" className="btn-ghost !px-3 !py-1.5" onClick={() => { setId(null); setInfo(null); }}>Remove</button>}
            {kind === "pdf" && id && <a href={`/media/${id}`} target="_blank" rel="noreferrer" className="btn-ghost !px-3 !py-1.5">Open</a>}
          </div>
        </div>
        <input ref={inputRef} type="file" className="sr-only" accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "application/pdf"} onChange={onPick} aria-label="Choose file" />
      </div>
      {(err || error) && <p role="alert" className="mt-1 text-body-sm text-error">{err ?? error}</p>}
    </div>
  );
}

/** Multiple image upload with reorder/remove. Stores comma-separated media IDs in a hidden input. */
export function MultiImageField({ name, initial }: { name: string; initial: number[] }) {
  const [ids, setIds] = useState<number[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true); setErr(null);
    const added: number[] = [];
    const errors: string[] = [];
    for (const f of files) {
      const fd = new FormData();
      fd.set("file", f);
      try {
        const r = await uploadMedia("image", true, fd);
        if (r.ok && r.id) added.push(r.id); else errors.push(`${f.name}: ${r.error ?? "failed"}`);
      } catch { errors.push(`${f.name}: upload failed`); }
    }
    setIds((cur) => [...cur, ...added].slice(0, 40));
    if (errors.length) setErr(errors.join(" · "));
    setBusy(false);
    if (ref.current) ref.current.value = "";
  }
  const move = (i: number, d: -1 | 1) => setIds((cur) => { const n = [...cur]; const j = i + d; if (j < 0 || j >= n.length) return cur; [n[i], n[j]] = [n[j], n[i]]; return n; });
  return (
    <div>
      <input type="hidden" name={name} value={ids.join(",")} />
      <div className="rounded border border-dashed border-[#C3CDDA] bg-mist p-3">
        {ids.length === 0 ? <p className="py-3 text-center text-body-sm text-on-surface-variant">No additional images yet.</p> : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ids.map((id, i) => (
              <li key={id} className="overflow-hidden rounded border border-line bg-white">
                <MediaImg id={id} alt={`Image ${i + 1}`} className="h-24 w-full" />
                <div className="flex items-center justify-between px-1 py-1">
                  <span className="px-1 text-label-sm text-on-surface-variant">#{i + 1}</span>
                  <span className="flex">
                    <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1 hover:bg-mist disabled:opacity-30"><Icon name="arrow_back" className="text-[18px]" /></button>
                    <button type="button" aria-label="Move later" disabled={i === ids.length - 1} onClick={() => move(i, 1)} className="rounded p-1 hover:bg-mist disabled:opacity-30"><Icon name="arrow_forward" className="text-[18px]" /></button>
                    <button type="button" aria-label="Remove image" onClick={() => setIds((c) => c.filter((x) => x !== id))} className="rounded p-1 text-error hover:bg-error-container"><Icon name="close" className="text-[18px]" /></button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex items-center gap-3">
          <button type="button" className="btn-secondary !px-3 !py-1.5" disabled={busy} onClick={() => ref.current?.click()}><Icon name="add_photo_alternate" className="text-[18px]" />{busy ? "Uploading…" : "Add images"}</button>
          <span className="text-body-sm text-on-surface-variant">JPG, PNG, WebP, GIF · up to 40 images</span>
        </div>
        <input ref={ref} type="file" multiple className="sr-only" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onPick} aria-label="Add images" />
      </div>
      {err && <p role="alert" className="mt-1 text-body-sm text-error">{err}</p>}
    </div>
  );
}

/** Gallery: upload many images at once, then create the gallery rows in one server action. */
export function BulkGalleryUpload() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true); setMsg(null);
    const ids: number[] = []; const errors: string[] = [];
    for (const f of files) {
      const fd = new FormData(); fd.set("file", f);
      try { const r = await uploadMedia("image", true, fd); if (r.ok && r.id) ids.push(r.id); else errors.push(`${f.name}: ${r.error ?? "failed"}`); } catch { errors.push(`${f.name}: upload failed`); }
    }
    let text = "";
    let ok = ids.length > 0;
    if (ids.length) { const r = await createGalleryItems(ids); text = r.message; ok = r.ok; }
    if (errors.length) text += `${text ? " " : ""}Skipped: ${errors.join(" · ")}`;
    setMsg({ ok, text: text || "Nothing uploaded." });
    setBusy(false);
    if (ref.current) ref.current.value = "";
    router.refresh();
  }
  return (
    <div className="card mb-6 p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[220px] flex-1"><h2 className="text-title-lg">Bulk upload</h2><p className="text-body-sm text-on-surface-variant">Select multiple images (8 MB max each). They are added to the gallery as active items.</p></div>
        <button type="button" className="btn-accent" disabled={busy} onClick={() => ref.current?.click()}><Icon name="upload" className="text-[20px]" />{busy ? "Uploading…" : "Upload images"}</button>
        <input ref={ref} type="file" multiple className="sr-only" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onPick} aria-label="Upload gallery images" />
      </div>
      {msg && <p role={msg.ok ? "status" : "alert"} className={`mt-3 text-body-sm ${msg.ok ? "text-success" : "text-error"}`}>{msg.text}</p>}
    </div>
  );
}

const IDLE_MS = 60 * 60_000;
/** Activity signal from the UI. Session extension is always decided by the server; this only informs it and shows a warning. */
export function IdleGuard() {
  const router = useRouter();
  const last = useRef(Date.now());
  const lastPing = useRef(Date.now());
  const [warn, setWarn] = useState(false);
  useEffect(() => {
    const bump = () => { last.current = Date.now(); setWarn(false); };
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const iv = setInterval(async () => {
      const idle = Date.now() - last.current;
      if (idle >= IDLE_MS) { router.replace("/dashboard-admin/login?reason=expired"); return; }
      setWarn(idle >= IDLE_MS - 5 * 60_000);
      if (idle < 60_000 && Date.now() - lastPing.current > 5 * 60_000) {
        lastPing.current = Date.now();
        const r = await pingSession().catch(() => ({ valid: true }));
        if (!r.valid) router.replace("/dashboard-admin/login?reason=expired");
      }
    }, 15_000);
    return () => { events.forEach((e) => window.removeEventListener(e, bump)); clearInterval(iv); };
  }, [router]);
  if (!warn) return null;
  return <div role="alert" className="fixed left-1/2 top-20 z-[100] -translate-x-1/2 rounded-lg border border-accent bg-[#FFF6D6] px-4 py-2 text-body-sm text-[#7A5B00] shadow">Your session will expire in a few minutes due to inactivity. Move the cursor or click to continue.</div>;
}

/** Public gallery: images only (no visible titles/descriptions) with a keyboard-accessible lightbox. */
export function Lightbox({ items }: { items: { id: number; imageId: number }[] }) {
  const [i, setI] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (i === null) return;
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") setI((v) => (v === null ? v : (v + 1) % items.length));
      if (e.key === "ArrowLeft") setI((v) => (v === null ? v : (v - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [i, items.length]);
  const cur = i === null ? null : items[i];
  const alt = (n: number) => `Hiryu Techno ${T.photo} ${n}`;
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((it, idx) => (
          <button key={it.id} onClick={() => setI(idx)} aria-label={fmt(T.lb_open, { n: idx + 1, total: items.length })} className="group block w-full overflow-hidden rounded-lg border border-line bg-mist">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/${it.imageId}`} alt={alt(idx + 1)} loading="lazy" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {cur && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/90 p-4" onClick={() => setI(null)}>
          <div role="dialog" aria-modal="true" aria-label={fmt(T.lb_dialog, { n: i! + 1, total: items.length })} className="relative flex max-h-[92vh] w-full max-w-5xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/${cur.imageId}`} alt={alt(i! + 1)} className="max-h-[88vh] w-auto max-w-full rounded-lg object-contain" />
            <button ref={closeRef} onClick={() => setI(null)} aria-label={T.lb_close} className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-navy hover:bg-white"><Icon name="close" /></button>
            {items.length > 1 && <>
              <button onClick={() => setI((i! - 1 + items.length) % items.length)} aria-label={T.lb_prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy hover:bg-white"><Icon name="chevron_left" /></button>
              <button onClick={() => setI((i! + 1) % items.length)} aria-label={T.lb_next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy hover:bg-white"><Icon name="chevron_right" /></button>
            </>}
          </div>
        </div>
      )}
    </>
  );
}

export type AccordionGroup = { id: number; name: string; description: string | null; products: { id: number; slug: string; name: string; brand: string | null; model: string | null; imageId: number | null }[] };

/** Products page: Product Type accordion. Native <button>s give Enter/Space support; aria-expanded/controls for assistive tech. */
export function ProductAccordion({ groups, openFirst = false }: { groups: AccordionGroup[]; openFirst?: boolean }) {
  const [open, setOpen] = useState<Set<number>>(new Set(openFirst && groups[0] ? [groups[0].id] : []));
  const toggle = (id: number) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-white">
      {groups.map((g) => {
        const isOpen = open.has(g.id);
        return (
          <div key={g.id}>
            <h2>
              <button type="button" onClick={() => toggle(g.id)} aria-expanded={isOpen} aria-controls={`acc-${g.id}`} id={`acc-h-${g.id}`} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-title-lg text-navy hover:bg-mist">
                <span>{g.name} <span className="ml-2 text-body-sm font-normal text-on-surface-variant">({g.products.length})</span></span>
                <Icon name={isOpen ? "remove" : "add"} className="text-[26px] text-primary" />
              </button>
            </h2>
            {isOpen && (
              <div id={`acc-${g.id}`} role="region" aria-labelledby={`acc-h-${g.id}`} className="acc-panel border-t border-line bg-mist/50 px-6 py-6">
                {g.description && <p className="mb-5 max-w-3xl text-body-md text-on-surface-variant">{g.description}</p>}
                {g.products.length === 0 ? <p className="text-body-md text-on-surface-variant">{T.acc_empty}</p> : (
                  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {g.products.map((p) => (
                      <li key={p.id}>
                        <Link href={`/products/${p.slug}`} className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                          <MediaImg id={p.imageId} alt={p.name} className="h-44 w-full transition-transform duration-500 group-hover:scale-105" icon="science" />
                          <div className="flex flex-1 flex-col p-4">
                            <h3 className="text-title-md text-navy group-hover:text-primary">{p.name}</h3>
                            {(p.brand || p.model) && <p className="mt-1 text-body-sm text-on-surface-variant">{[p.brand, p.model].filter(Boolean).join(" · ")}</p>}
                            <span className="mt-3 inline-flex items-center gap-1 text-title-md text-primary">{T.view_product}<Icon name="arrow_forward" className="text-[16px]" /></span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export type LogoItem = { id: number; name: string; logoId: number | null; src?: string | null; url: string | null };

/** Horizontal logo marquee: always animated, seamless loop, pauses on hover. Falls back to a static wrapped layout for reduced-motion users. */
export function LogoStrip({ items, dark = false }: { items: LogoItem[]; dark?: boolean }) {
  if (items.length === 0) return null;

  // Repeat the list until one group is wide enough to fill the screen, then render two identical groups for a seamless loop.
  const reps = Math.max(1, Math.ceil(10 / items.length));
  const group: LogoItem[] = Array.from({ length: reps }, () => items).flat();
  const duration = Math.max(20, group.length * 4); // seconds; more logos = longer track = same perceived speed

  const renderItem = (b: LogoItem, key: string, hidden: boolean) => {
    const inner = b.logoId
      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={`/media/${b.logoId}`} alt={hidden ? "" : b.name} loading="lazy" className="h-10 w-auto max-w-[140px] object-contain" />
      : <span className="whitespace-nowrap text-title-md text-navy">{b.name}</span>;
    return (
      <li
        key={key}
        aria-hidden={hidden ? true : undefined}
        className={`logo-item mr-6 flex h-16 shrink-0 items-center justify-center rounded-lg bg-white px-4 ${dark ? "" : "border border-line"} ${hidden ? "logo-dup" : ""}`}
      >
        {b.url ? (
          <a href={b.url} target="_blank" rel="noopener noreferrer nofollow" aria-label={b.name} tabIndex={hidden ? -1 : undefined}>{inner}</a>
        ) : inner}
      </li>
    );
  };

  return (
    <div className="logo-viewport overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <ul
        className="logo-marquee flex w-max items-center"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {group.map((b, i) => renderItem(b, `a-${b.id}-${i}`, false))}
        {group.map((b, i) => renderItem(b, `b-${b.id}-${i}`, true))}
      </ul>
    </div>
  );
}