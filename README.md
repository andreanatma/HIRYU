# PT Hiryu Techno Indonesia — Website & Admin CMS

Next.js 15 (App Router) · TypeScript · Tailwind · Prisma 6 · MySQL. UI publik dan dashboard berbahasa Inggris.

## Menjalankan
```bash
cp .env.example .env          # isi DATABASE_URL, SITE_URL, BOOTSTRAP_TOKEN
npm install
npx prisma migrate deploy     # menerapkan migrasi ADITIF (tidak ada DROP). Dev: npx prisma migrate dev
npm run db:seed               # idempoten & non-destruktif: pengaturan, 3 layanan, konten About Us dari PDF
npm run dev
```
Super Admin pertama: `/dashboard-admin/signup` (butuh `BOOTSTRAP_TOKEN`, hanya aktif saat belum ada user) atau `npm run admin:create`.

## Modul dashboard (`/dashboard-admin`)
Services · Product Types · Products · Portfolio · Gallery (bulk upload) · Blogs · About Us · Our Team · Brands · Clients ·
Contact Messages · User Management · Activity Logs · Media · SEO · Settings.
Semua CRUD memakai `src/features/modules.ts` (definisi modul) + `crud-actions.ts` (server action, otorisasi di server).

## Catatan penting
- **Data demo lama (Apex Global)** yang mungkin sudah ada di database TIDAK dihapus otomatis. Hapus lewat dashboard bila tidak diperlukan.
- Produk lama tanpa Product Type tetap tersimpan (kolom `productTypeId` nullable) tetapi **tidak tampil** di `/products` sampai diberi tipe.
- Kontak, WhatsApp, alamat, dan Google Maps embed URL **harus diisi** di Settings; tidak ada nilai bawaan palsu.
- Upload disimpan di `UPLOAD_DIR` (disk lokal). Untuk production gunakan volume persisten atau object storage.
- Email notifikasi form kontak opsional (`RESEND_API_KEY`, `MAIL_FROM`, `CONTACT_NOTIFY_EMAIL`); bila tidak diatur, pesan tetap tersimpan dan statusnya tampil "Not configured".
- Slug yang diubah (produk, blog, layanan, portfolio) otomatis dialihkan (308) dari URL lama.
