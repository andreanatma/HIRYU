"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";

type HeroSliderProps = {
  companyName: string;
  title: string;
  subtitle: string;
  exploreText: string;
  aboutText: string;
  images?: string[]; // Properti baru untuk menerima daftar gambar dari database
};

// Fallback gambar jika admin tidak memasukkan gambar di pengaturan
const DEFAULT_IMAGES = [
  "/hero/hero-1.jpg", 
  "/hero/hero-2.png",
  "/hero/hero-3.png",
];

export function HeroSlider({ 
  companyName, 
  title, 
  subtitle, 
  exploreText, 
  aboutText, 
  images 
}: HeroSliderProps) {
  // Gunakan gambar dari properti jika ada, jika kosong gunakan default
  const sliderImages = images && images.length > 0 ? images : DEFAULT_IMAGES;
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide menyesuaikan jumlah gambar aktif
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return (
    <section className="relative flex min-h-[600px] w-full items-center overflow-hidden bg-navy text-white lg:min-h-[650px]">
      {/* Latar Belakang Gambar Slider */}
      <div className="absolute inset-0 z-0">
        {sliderImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-navy via-navy/90 to-transparent md:via-navy/70" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Konten Utama */}
      <div className="container-x relative z-20 w-full py-16">
        <div className="flex max-w-3xl flex-col gap-6">
          {/* Label Nama Perusahaan */}
          <span className="text-label-sm font-bold uppercase tracking-widest text-white/80 md:text-label-md">
            {companyName}
          </span>
          
          {/* Judul Utama dari Admin (bisa menerima baris baru dari text area) */}
          <h1 className="text-display-sm font-extrabold leading-tight tracking-tight text-white whitespace-pre-line md:text-display-lg">
            {title}
          </h1>
          
          {/* Garis Aksen & Teks Deskripsi (Subtitle) dari Admin */}
          <div className="flex items-center gap-4">
             <div className="h-1 w-12 shrink-0 rounded bg-accent md:w-16" />
             <p className="max-w-xl text-body-lg leading-relaxed text-white/90 whitespace-pre-line">
               {subtitle}
             </p>
          </div>

          {/* Tombol Aksi & Indikator Slider */}
          <div className="mt-2 flex flex-wrap items-center gap-5">
            <Link href="/products" className="btn-accent !px-8 !py-3.5 !font-bold">
              {exploreText} <Icon name="arrow_forward" className="ml-1 text-[18px]" />
            </Link>
            <Link href="/about-us" className="btn-outline-light !border-white/30 !px-8 !py-3.5 !font-bold !text-white hover:!bg-white/10 hover:!border-white">
              {aboutText}
            </Link>

            {/* Indikator Slider Titik */}
            <div className="ml-4 flex items-center gap-2 lg:ml-8">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-accent" : "w-2.5 bg-white/40 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}