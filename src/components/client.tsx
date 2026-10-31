"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Icon, MediaImg } from "./ui";
import { pingSession } from "@/features/auth-actions";
import { createGalleryItems, uploadMedia } from "@/features/crud-actions";
import { T, fmt } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

export function SubmitButton({ children, className = "btn-accent", pendingText = "Saving…" }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending} aria-live="polite">
      {pending ? pendingText : children}
    </button>
  );
}

/** Toast dari query ?msg=. Query dihapus dari URL setelah tampil, dan toast hilang otomatis setelah 5 detik. */
const TOAST_MS = 5000; // harus sama dengan durasi animasi .adm-toast-bar di globals.css (5s)

export function Toast() {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const msg = sp.get("msg");
  // id unik per tampilan: menyimpan pesan yang sama dua kali berturut-turut ("Saved: …") tetap memunculkan toast
  // baru dengan hitungan 5 detik dan animasi bar yang mulai dari awal.
  const [toast, setToast] = useState<{ text: string; id: number } | null>(null);

  // 1) Ambil pesan dari URL, lalu bersihkan ?msg= agar tidak muncul lagi saat halaman di-refresh.
  useEffect(() => {
    if (!msg) return;
    setToast({ text: msg, id: Date.now() });
    const q = new URLSearchParams(sp.toString());
    q.delete("msg");
    router.replace(q.size ? `${path}?${q}` : path, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg]);

  // 2) Timer 5 detik dipisah dari efek di atas.
  // Sebelumnya timer dibuat di efek ?msg= itu sendiri. Begitu router.replace menghapus ?msg=, `msg` berubah → cleanup
  // efek berjalan dan clearTimeout membatalkan timer sebelum sempat 5 detik, sehingga toast tidak pernah hilang sendiri.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  const { text } = toast;
  const bad = /fail|denied|cannot|could not|not found|still in use|invalid/i.test(text);
  return (
    <div key={toast.id} role="status" aria-live="polite" className={`adm-toast fixed inset-x-4 bottom-4 z-[100] flex items-start gap-3 overflow-hidden rounded-xl border bg-white px-4 py-3.5 shadow-[0_18px_40px_-12px_rgba(7,29,51,0.35)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-sm ${bad ? "border-error/40" : "border-line"}`}>
      <Icon name={bad ? "error" : "check_circle"} fill className={bad ? "text-error" : "text-success"} />
      <p className="flex-1 text-body-sm text-navy">{text}</p>
      <button onClick={() => setToast(null)} aria-label="Close notification" className="text-outline transition-transform duration-300 hover:rotate-90 hover:text-navy"><Icon name="close" className="text-[18px]" /></button>
      <span aria-hidden="true" className={`adm-toast-bar absolute inset-x-0 bottom-0 h-1 ${bad ? "bg-error" : "bg-accent"}`} />
    </div>
  );
}

/** Delete button with a confirmation dialog. `action` is an already-bound server action. */
export function ConfirmButton({ action, label = "Delete", title, text, variant = "icon", icon = "delete" }: { action: () => Promise<void>; label?: string; title: string; text: string; variant?: "icon" | "button"; icon?: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLButtonElement>(null);
  const titleId = useId();
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
        <button type="button" onClick={() => setOpen(true)} aria-label={`${label}: ${title}`} title={label} className="adm-icon-btn adm-icon-btn-danger"><Icon name={icon} className="text-[20px]" /></button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary !text-error">{label}</button>
      )}
      {open && (
        <div className="adm-fade fixed inset-0 z-[90] flex items-center justify-center bg-navy/50 p-4 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="adm-pop w-full max-w-md rounded-xl border border-line bg-white p-6 shadow-[0_30px_60px_-20px_rgba(7,29,51,0.45)]" onClick={(e) => e.stopPropagation()}>
            <h3 id={titleId} className="text-title-lg">{title}</h3>
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

/** Drag & drop: mengembalikan status "sedang di atas area" dan handler yang dipasang ke elemen dropzone. */
function useDrop(onFiles: (files: File[]) => void, multiple: boolean, disabled: boolean) {
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (e: React.DragEvent) => { if (disabled) return; e.preventDefault(); setOver(true); },
      onDragLeave: (e: React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false); },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault(); setOver(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      },
    },
  };
}

function Spin() {
  return <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

const IMG_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

/** Single image/PDF upload with preview. Stores the media ID in a hidden input. */
export function FileField({ name, kind, initialId, initialName, error }: { name: string; kind: "image" | "pdf"; initialId?: number | null; initialName?: string; error?: string }) {
  const [id, setId] = useState<number | null>(initialId ?? null);
  const [info, setInfo] = useState<{ name: string; size?: number } | null>(initialId ? { name: initialName ?? `File #${initialId}` } : null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(f: File) {
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
  const { over, props } = useDrop((files) => upload(files[0]), false, busy);
  const pick = () => inputRef.current?.click();
  const failed = Boolean(err || error);

  return (
    <div>
      <input type="hidden" name={name} value={id ?? ""} />
      <div {...props} className={cn("relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200", over ? "border-primary bg-brand-light" : failed ? "border-error/50 bg-error-container/20" : "border-[#C3CDDA] bg-mist hover:border-primary/50")}>
        {id ? (
          <>
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/media/${id}`} alt="Preview" decoding="async" className="h-44 w-full bg-white object-contain p-2" />
            ) : (
              <div className="flex h-28 items-center justify-center bg-white text-primary"><Icon name="picture_as_pdf" fill className="text-[48px]" /></div>
            )}
            <div className="flex items-center gap-2 border-t border-line bg-white px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-sm font-semibold text-navy">{info?.name ?? `File #${id}`}</p>
                <p className="text-label-md text-slate-text">{info?.size ? `${(info.size / 1024).toFixed(0)} KB · ` : ""}{kind === "image" ? "JPG, PNG, WebP, GIF" : "PDF"}</p>
              </div>
              {kind === "pdf" && <a href={`/media/${id}`} target="_blank" rel="noreferrer" aria-label="Open file" title="Open" className="adm-icon-btn"><Icon name="open_in_new" className="text-[20px]" /></a>}
              <button type="button" className="btn-secondary !px-3 !py-1.5 !text-body-sm" disabled={busy} onClick={pick}>Replace</button>
              <button type="button" aria-label="Remove file" title="Remove" className="adm-icon-btn adm-icon-btn-danger" onClick={() => { setId(null); setInfo(null); }}><Icon name="delete" className="text-[20px]" /></button>
            </div>
          </>
        ) : (
          <button type="button" onClick={pick} disabled={busy} className="flex w-full flex-col items-center gap-2 px-4 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm"><Icon name={kind === "image" ? "cloud_upload" : "upload_file"} className="text-[26px]" /></span>
            <span className="text-title-md text-navy">Click to upload <span className="font-normal text-slate-text">or drag and drop</span></span>
            <span className="text-body-sm text-slate-text">{kind === "image" ? "JPG, PNG, WebP or GIF" : "PDF document"}</span>
          </button>
        )}
        {busy && <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/80 text-body-sm font-semibold text-navy backdrop-blur-sm"><Spin />Uploading…</div>}
        <input ref={inputRef} type="file" className="sr-only" accept={kind === "image" ? IMG_ACCEPT : "application/pdf"} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} aria-label="Choose file" />
      </div>
      {(err || error) && <p role="alert" className="mt-1.5 flex items-center gap-1 text-body-sm font-medium text-error"><Icon name="error" fill className="text-[16px]" />{err ?? error}</p>}
    </div>
  );
}

/** Multiple image upload with reorder/remove. Stores comma-separated media IDs in a hidden input. */
export function MultiImageField({ name, initial }: { name: string; initial: number[] }) {
  const [ids, setIds] = useState<number[]>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(files: File[]) {
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
  const { over, props } = useDrop((files) => upload(files.filter((f) => f.type.startsWith("image/"))), true, busy);
  const move = (i: number, d: -1 | 1) => setIds((cur) => { const n = [...cur]; const j = i + d; if (j < 0 || j >= n.length) return cur; [n[i], n[j]] = [n[j], n[i]]; return n; });

  return (
    <div>
      <input type="hidden" name={name} value={ids.join(",")} />
      <div {...props} className={cn("relative rounded-xl border-2 border-dashed p-3 transition-all duration-200", over ? "border-primary bg-brand-light" : "border-[#C3CDDA] bg-mist")}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ids.map((id, i) => (
            <li key={id} className="group overflow-hidden rounded-lg border border-line bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="relative aspect-square overflow-hidden">
                <MediaImg id={id} alt={`Image ${i + 1}`} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-1.5 top-1.5 rounded-md bg-navy/75 px-1.5 py-0.5 text-label-sm text-white backdrop-blur">{i + 1}</span>
              </div>
              <div className="flex items-center justify-between border-t border-line px-1 py-1">
                <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)} className="adm-icon-btn !h-8 !w-8 disabled:opacity-30"><Icon name="arrow_back" className="text-[18px]" /></button>
                <button type="button" aria-label="Move later" disabled={i === ids.length - 1} onClick={() => move(i, 1)} className="adm-icon-btn !h-8 !w-8 disabled:opacity-30"><Icon name="arrow_forward" className="text-[18px]" /></button>
                <button type="button" aria-label="Remove image" onClick={() => setIds((c) => c.filter((x) => x !== id))} className="adm-icon-btn adm-icon-btn-danger !h-8 !w-8"><Icon name="close" className="text-[18px]" /></button>
              </div>
            </li>
          ))}
          {ids.length < 40 && (
            <li>
              <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/40 bg-white text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-md">
                <Icon name="add_photo_alternate" className="text-[30px]" />
                <span className="text-body-sm font-semibold">Add images</span>
              </button>
            </li>
          )}
        </ul>
        <p className="mt-3 text-center text-body-sm text-slate-text">{ids.length === 0 ? "No additional images yet. " : ""}Drag images here or use the add tile · JPG, PNG, WebP, GIF · up to 40 images</p>
        {busy && <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-white/80 text-body-sm font-semibold text-navy backdrop-blur-sm"><Spin />Uploading…</div>}
        <input ref={ref} type="file" multiple className="sr-only" accept={IMG_ACCEPT} onChange={(e) => upload(Array.from(e.target.files ?? []))} aria-label="Add images" />
      </div>
      {err && <p role="alert" className="mt-1.5 flex items-center gap-1 text-body-sm font-medium text-error"><Icon name="error" fill className="text-[16px]" />{err}</p>}
    </div>
  );
}

/** Gallery: upload many images at once, then create the gallery rows in one server action. */
export function BulkGalleryUpload() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function upload(files: File[]) {
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
  const { over, props } = useDrop((files) => upload(files.filter((f) => f.type.startsWith("image/"))), true, busy);
  return (
    <div {...props} className={cn("card adm-in relative mb-6 border-2 border-dashed p-5 transition-all duration-200", over ? "!border-primary bg-brand-light" : "!border-[#C3CDDA] hover:!border-primary/50")}>
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-primary"><Icon name="cloud_upload" className="text-[26px]" /></span>
        <div className="min-w-[220px] flex-1">
          <h2 className="text-title-md text-navy">Bulk upload</h2>
          <p className="text-body-sm text-slate-text">Drag images here or select several files (8 MB max each). They are added to the gallery as active items.</p>
        </div>
        <button type="button" className="btn-accent w-full sm:w-auto" disabled={busy} onClick={() => ref.current?.click()}>{busy ? <><Spin />Uploading…</> : <><Icon name="upload" className="text-[20px]" />Upload images</>}</button>
        <input ref={ref} type="file" multiple className="sr-only" accept={IMG_ACCEPT} onChange={(e) => upload(Array.from(e.target.files ?? []))} aria-label="Upload gallery images" />
      </div>
      {msg && <p role={msg.ok ? "status" : "alert"} className={`mt-3 text-body-sm font-medium ${msg.ok ? "text-success" : "text-error"}`}>{msg.text}</p>}
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

  // Preload the neighbouring photos so next/previous feels instant.
  useEffect(() => {
    if (i === null || items.length < 2) return;
    for (const j of [(i + 1) % items.length, (i - 1 + items.length) % items.length]) {
      const img = new Image();
      img.src = `/media/${items[j].imageId}`;
    }
  }, [i, items]);

  const cur = i === null ? null : items[i];
  const alt = (n: number) => `Hiryu Techno ${T.photo} ${n}`;
  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((it, idx) => (
          <button key={it.id} onClick={() => setI(idx)} aria-label={fmt(T.lb_open, { n: idx + 1, total: items.length })} className="group block w-full overflow-hidden rounded-lg border border-line bg-mist">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/${it.imageId}`} alt={alt(idx + 1)} loading="lazy" decoding="async" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {cur && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/90 p-4" onClick={() => setI(null)}>
          <div role="dialog" aria-modal="true" aria-label={fmt(T.lb_dialog, { n: i! + 1, total: items.length })} className="relative flex max-h-[92vh] w-full max-w-5xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/${cur.imageId}`} alt={alt(i! + 1)} decoding="async" className="max-h-[88vh] w-auto max-w-full rounded-lg object-contain" />
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

/**
 * Products page: Product Type accordion.
 * SEO: panel selalu dirender di HTML (hanya disembunyikan dengan atribut `hidden`),
 * sehingga link ke semua produk tetap bisa dibaca crawler walau accordion tertutup.
 */
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
            <div id={`acc-${g.id}`} role="region" aria-labelledby={`acc-h-${g.id}`} hidden={!isOpen} className="acc-panel border-t border-line bg-mist/50 px-6 py-6">
              {g.description && <p className="mb-5 max-w-3xl text-body-md text-on-surface-variant">{g.description}</p>}
              {g.products.length === 0 ? <p className="text-body-md text-on-surface-variant">{T.acc_empty}</p> : (
                <ul className="flow-cards [--cols:1] sm:[--cols:2] lg:[--cols:3] [--gap:1.25rem]">
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
      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={`/media/${b.logoId}`} alt={hidden ? "" : b.name} loading="eager" decoding="async" className="h-10 w-auto max-w-[140px] object-contain" />
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