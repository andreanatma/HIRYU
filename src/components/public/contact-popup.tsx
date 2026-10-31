"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";

type ContactPopupProps = {
  companyName: string;
  /** Nomor WhatsApp format internasional, hanya digit (dari Dashboard > Settings). Kosong = tombol WhatsApp disembunyikan. */
  whatsapp?: string;
  officeHours?: string;
};

/**
 * Popup "Contact us" kecil, melayang di pojok kanan bawah dan tampil di seluruh halaman publik.
 * - Tombol bulat kuning; klik membuka panel kecil berisi WhatsApp dan tautan ke form Contact.
 * - Diletakkan DI ATAS slot tombol "Back to top" (bottom-4) dan shortcut Dashboard admin (right-4),
 *   sehingga tidak saling menutupi.
 * - Tutup dengan klik di luar panel, tombol X, atau tombol Esc.
 */
export function ContactPopup({ companyName, whatsapp = "", officeHours = "" }: ContactPopupProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  const wa = whatsapp.replace(/\D/g, "");
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(`Hello ${companyName}, I would like to ask about your products and services.`)}` : "";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const rowCls =
    "group/row flex items-center gap-3 rounded-lg border border-line bg-mist/60 px-3 py-2.5 text-body-sm font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md";
  const icoCls =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary transition-colors duration-200 group-hover/row:bg-primary group-hover/row:text-white";

  return (
    <div
      ref={root}
      className="fixed right-4 z-[85] flex flex-col items-end gap-3 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.75rem)]"
    >
      {/* Panel */}
      <div
        id="contact-popup"
        role="dialog"
        aria-label="Contact us"
        aria-hidden={!open}
        className={[
          "w-[min(18rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_26px_50px_-20px_rgba(7,29,51,0.55)] transition-all duration-300",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0",
        ].join(" ")}
      >
        <div className="relative bg-gradient-to-br from-navy via-[#0A2A4E] to-[#0B3A78] px-4 py-3.5 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/40" />
          <p className="pr-8 text-title-md font-bold">Contact us</p>
          <p className="mt-0.5 pr-8 text-body-sm text-white/80">Questions about equipment, service, or calibration? We&apos;re here to help.</p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              btn.current?.focus();
            }}
            tabIndex={open ? 0 : -1}
            aria-label="Close contact popup"
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        <div className="space-y-2 p-3">
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className={rowCls}>
              <span className={icoCls}><Icon name="chat" className="text-[18px]" /></span>
              <span className="min-w-0">
                <span className="block leading-tight">WhatsApp</span>
                <span className="block truncate text-label-sm font-normal text-slate-text">+{wa}</span>
              </span>
            </a>
          )}
          <Link href="/contact" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className={rowCls}>
            <span className={icoCls}><Icon name="edit_note" className="text-[18px]" /></span>
            <span className="min-w-0">
              <span className="block leading-tight">Send a message</span>
              <span className="block text-label-sm font-normal text-slate-text">Use the contact form</span>
            </span>
          </Link>
          {officeHours && (
            <p className="flex items-center gap-1.5 px-1 pt-1 text-label-sm text-slate-text">
              <Icon name="schedule" className="text-[14px]" />{officeHours}
            </p>
          )}
        </div>
      </div>

      {/* Tombol pemicu */}
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="contact-popup"
        aria-label={open ? "Close contact popup" : "Contact us"}
        title="Contact us"
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-accent text-navy shadow-lg shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 active:scale-95"
      >
        <Icon name={open ? "close" : "forum"} fill className="text-[24px] transition-transform duration-300 group-hover:scale-110" />
      </button>
    </div>
  );
}