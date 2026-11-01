# PKM PSC

Repositori aplikasi PKM PSC. Saat ini proyek berisi scaffold frontend React + Vite dan dependensi awal untuk backend Node.js/Express dengan Sequelize dan MySQL.

> **Status pengembangan:** frontend masih menggunakan halaman contoh bawaan React + Vite. Backend menyediakan API Express untuk autentikasi admin, berita, kategori berita, FAQ, layanan, dan kontak.

## Teknologi

- Frontend: React 19, Vite 8
- Backend: Node.js, Express 5, Sequelize 6, MySQL2

## Persyaratan

- Node.js dan npm
- MySQL diperlukan untuk menjalankan API backend

## Menjalankan frontend

Dari direktori root repositori:

```bash
cd Frontend
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal.

Perintah frontend lainnya:

```bash
npm run build    # Membuat build produksi di Frontend/dist
npm run preview  # Meninjau build produksi secara lokal
npm run lint     # Menjalankan ESLint
```

## Backend

Salin `Backend/.env.example` menjadi `Backend/.env`, lalu isi konfigurasi MySQL dan `JWT_SECRET`. Siapkan database MySQL yang namanya sesuai dengan `DB_NAME`.

```bash
cd Backend
npm install
npm run seed:admin
npm start
```

`npm run seed:admin` membuat akun superadmin pertama dari variabel `ADMIN_USERNAME`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD` tanpa mengubah akun yang sudah ada. Server tersedia di `http://localhost:5000` secara default; pemeriksaan kesiapan tersedia di `GET /api/health`.

### Endpoint API

| Resource | Baca publik | Kelola (Bearer token) |
|---|---|---|
| Auth | `POST /api/auth/login` | `GET /api/auth/me` |
| Akun admin | — | `GET/POST /api/admins`, `PUT/DELETE /api/admins/:id` (khusus `superadmin`) |
| Berita | `GET /api/berita`, `GET /api/berita/:id`, `GET /api/berita/slug/:slug` | `GET /api/berita/admin[/:id]`, `POST /api/berita`, `PUT/DELETE /api/berita/:id` |
| Kategori berita | `GET /api/berita/kategori`, `GET /api/berita/kategori/:id` | `POST /api/berita/kategori`, `PUT/DELETE /api/berita/kategori/:id` |
| FAQ | `GET /api/faq`, `GET /api/faq/:id` | `GET /api/faq/admin[/:id]`, `POST /api/faq`, `PUT/DELETE /api/faq/:id` |
| Layanan | `GET /api/layanan`, `GET /api/layanan/:id`, `GET /api/layanan/slug/:slug` | `GET /api/layanan/admin[/:id]`, `POST /api/layanan`, `PUT/DELETE /api/layanan/:id` |
| Kontak | `GET /api/kontak`, `GET /api/kontak/:id` | `POST /api/kontak`, `PUT/DELETE /api/kontak/:id` |

Endpoint baca publik berita hanya menampilkan berita berstatus `terbit`; FAQ dan layanan publik hanya menampilkan data aktif. Operasi konten memerlukan token `admin` atau `superadmin`; pengelolaan akun admin hanya dapat dilakukan oleh `superadmin`. Token diverifikasi terhadap akun dan role terkini di database.

## Struktur direktori

```text
.
├── Backend/       # Manifest dan dependensi backend
└── Frontend/      # Aplikasi React + Vite
    └── src/       # Kode sumber frontend
```

## Pengujian

Belum tersedia skrip pengujian otomatis. Pemeriksaan kualitas frontend dapat dijalankan dengan `npm run lint` dari direktori `Frontend`.