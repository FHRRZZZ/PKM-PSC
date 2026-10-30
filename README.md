# PKM PSC

Repositori aplikasi PKM PSC. Saat ini proyek berisi scaffold frontend React + Vite dan dependensi awal untuk backend Node.js/Express dengan Sequelize dan MySQL.

> **Status pengembangan:** frontend masih menggunakan halaman contoh bawaan React + Vite. Backend dan integrasi database belum memiliki implementasi.

## Teknologi

- Frontend: React 19, Vite 8
- Backend: Node.js, Express 5, Sequelize 6, MySQL2

## Persyaratan

- Node.js dan npm
- MySQL diperlukan setelah integrasi database backend dibuat

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

Dependensi backend dapat dipasang dari direktori `Backend`:

```bash
cd Backend
npm install
```

> Backend belum memiliki file aplikasi, konfigurasi koneksi database, atau skrip `start`/`dev`, sehingga server belum dapat dijalankan.

## Struktur direktori

```text
.
├── Backend/       # Manifest dan dependensi backend
└── Frontend/      # Aplikasi React + Vite
    └── src/       # Kode sumber frontend
```

## Pengujian

Belum tersedia skrip pengujian otomatis. Pemeriksaan kualitas frontend dapat dijalankan dengan `npm run lint` dari direktori `Frontend`.