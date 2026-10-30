"use client";

import { useState } from "react";
import { Icon } from "./ui";

/**
 * Logo perusahaan. Taruh file di  public/logo/  lalu sesuaikan nama file di bawah ini.
 * (Linux case-sensitive: "Logo.PNG" ≠ "logo.png".)  URL publiknya: /logo/<nama-file>
 */
export const LOGO_SRC = "/logo/logo.png";

/** Jika file logo belum ada / gagal dimuat, otomatis kembali ke ikon lama. */
export function BrandLogo({ className = "", src = LOGO_SRC }: { className?: string; src?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white text-primary ${className}`}>
        <Icon name="biotech" className="text-[22px]" />
      </span>
    );
  }

  return (
    <span className={`flex h-10 shrink-0 items-center rounded-lg bg-white px-2 shadow-sm ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        className="h-7 w-auto max-w-[120px] object-contain"
        decoding="async"
      />
    </span>
  );
}