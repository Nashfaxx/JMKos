# JMKos

Aplikasi admin penyewaan kos berbasis React + Vite.

## Fitur

- Dashboard total kamar, kamar terisi, kamar kosong, dan pendapatan bulan berjalan
- Manajemen kamar: tambah, edit, hapus, dan lihat status
- Manajemen penyewa: tambah, edit, hapus, dan assign kamar
- Pembayaran: catat pembayaran dan status lunas/nunggak
- Laporan pendapatan bulanan dan daftar penyewa nunggak

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Tanpa env database, aplikasi tetap bisa dibuka tetapi berada dalam status belum terhubung. Form dan aksi CRUD akan nonaktif sampai Supabase atau Vercel API dikonfigurasi.

## Koneksi Supabase

1. Jalankan SQL di [database/supabase-schema.sql](database/supabase-schema.sql) pada Supabase SQL Editor.
2. Buat user admin di Supabase Dashboard lewat **Authentication > Users**.
3. Untuk koneksi langsung dari frontend, buat file `.env.local`:

```bash
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

4. Login aplikasi memakai email dan password user Supabase Auth. Request database akan memakai access token user agar policy `authenticated` bisa membaca dan mengelola data.
5. Untuk koneksi lewat Vercel Functions, gunakan env ini di Vercel:

```bash
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
VITE_KOS_API_URL=/api/kos
```

6. Jalankan ulang dev server atau redeploy.

Frontend hanya memakai publishable/anon key. Jangan pernah menaruh `service_role` key di file Vite karena akan ikut terkirim ke browser.
