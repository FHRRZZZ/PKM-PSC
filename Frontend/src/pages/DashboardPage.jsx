import { useState } from "react";

const services = [
  {
    name: "Gawat Darurat",
    title: "Penanganan Gawat Darurat",
    description:
      "Respons awal untuk kondisi medis darurat yang membutuhkan pertolongan segera dari petugas PSC 119.",
    checks: [
      "Respons kondisi darurat",
      "Panduan pertolongan pertama",
      "Koordinasi petugas medis",
      "Pelayanan 24 jam",
    ],
  },
  {
    name: "Non-Gawat Darurat",
    title: "Penanganan Gawat Darurat",
    description:
      "Respons awal untuk kondisi medis darurat yang membutuhkan pertolongan segera dari petugas PSC 119.",
    checks: [
      "Respons kondisi darurat",
      "Panduan pertolongan pertama",
      "Koordinasi petugas medis",
      "Pelayanan 24 jam",
    ],
  },
  {
    name: "Rujukan",
    title: "Koordinasi Rujukan",
    description:
      "Koordinasi kebutuhan rujukan pasien menuju fasilitas kesehatan yang sesuai dengan kondisi dan kebutuhan penanganan.",
    checks: [
      "Koordinasi fasilitas kesehatan",
      "Informasi rujukan",
      "Koordinasi ambulans",
      "Pendampingan proses evakuasi",
    ],
  },
  {
    name: "Konsultasi",
    title: "Konsultasi Kesehatan",
    description:
      "Layanan komunikasi untuk memperoleh informasi dan arahan awal terkait kebutuhan pelayanan kesehatan.",
    checks: [
      "Informasi kesehatan",
      "Arahan awal petugas",
      "Informasi layanan",
      "Komunikasi dengan petugas",
    ],
  },
];

const steps = [
  {
    number: "1",
    title: "TELEPON 119",
    description:
      "Hubungi nomor darurat 119 untuk kondisi gawat darurat seperti serangan jantung, stroke, kecelakaan kerja, atau kecelakaan lalu lintas.",
    note: "Langkah pertama",
  },
  {
    number: "2",
    title: "JELASKAN SITUASI",
    description:
      "Jangan panik dan beritahukan kondisi gejala pasien serta jumlah korban yang membutuhkan pertolongan.",
    note: "Identifikasi pasien",
  },
  {
    number: "3",
    title: "BERITAHU LOKASI",
    description:
      "Beritahukan lokasi kepada petugas secara rinci agar penjemputan dapat dilakukan segera dan dirujuk ke rumah sakit yang tepat.",
    note: "Akurasi rute",
  },
  {
    number: "4",
    title: "DAPATKAN AMBULANS",
    description:
      "Tunggu petugas datang. Tetap aktifkan handphone jika operator memandu tindakan pertolongan pertama.",
    note: "Penanganan di tempat",
  },
];

const news = [
  {
    date: "17 April, 2026",
    title: "Layanan ambulans gratis",
    style: "from-slate-500 to-slate-900",
  },
  {
    date: "23 Maret, 2026",
    title: "Aksi tanggap penanganan cepat",
    style: "from-slate-400 to-slate-800",
  },
  {
    date: "17 April, 2026",
    title: "Tidak sadarkan diri? Cek hal berikut",
    style: "from-slate-300 to-slate-700",
  },
];

const reviews = [
  {
    initials: "IR",
    name: "Ibu Rahmawati",
    location: "Pancoran Mas",
    rating: "Sangat Membantu",
    message:
      "Masya Allah terima kasih banyak PSC 119 Depok! Tadi malam bapak tiba-tiba sesak nafas parah, telepon 119 langsung diangkat tanpa nada tunggu. Dalam 12 menit ambulans dan dokter sudah tiba di rumah kami. Pelayanan sangat ramah dan benar-benar GRATIS tanpa dipungut biaya apapun!",
    appreciation: "Terbantu oleh 142 warga",
    tag: "Rujukan ke RSUD KISA",
    blue: false,
  },
  {
    initials: "BS",
    name: "Pak Budi Santoso",
    location: "Sawangan",
    rating: "Respon Sangat Cepat",
    message:
      "Waktu ada kecelakaan motor di jalan Raya Sawangan, saya langsung telepon 119. Operatornya sangat tenang dan membimbing cara pertolongan pertama sebelum petugas tiba agar korban tidak dipindahkan sembarangan. Ambulans datang cepat, tindakan evakuasi profesional dan hati-hati. Bangga sama Dinkes Depok!",
    appreciation: "98 apresiasi",
    tag: "Evakuasi Trauma",
    blue: true,
  },
];

const dispatcherReplies = [
  "Sama-sama Ibu Rahmawati. Semoga bapak lekas pulih dan sehat selalu. Tim medis PSC 119 senantiasa siap siaga untuk kesehatan warga Depok kapan pun dibutuhkan. Salam sehat!",
  "Terima kasih Pak Budi Santoso sudah mau bekerja sama membantu pelaporan perihal kecelakaan lalu lintas. Jangan ragu menghubungi kami untuk kondisi gawat darurat. Kami selalu siaga 24 jam. Jaga keselamatan selalu.",
];

function SectionTitle({ children, light = false }) {
  return (
    <h2
      className={`text-2xl font-bold leading-tight sm:text-3xl ${
        light ? "text-white" : "text-gray-900"
      }`}
    >
      {children}
    </h2>
  );
}

function EmergencyButton({ children = "Telepon 119", outline = false }) {
  return (
    <a
      href="tel:119"
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition ${
        outline
          ? "border border-white/60 bg-white/10 text-white hover:bg-white/20"
          : "bg-gradient-to-b from-red-600 to-red-800 text-white shadow-md hover:brightness-110"
      }`}
    >
      {children}
    </a>
  );
}

export default function DashboardPage() {
  const [activeService, setActiveService] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const selectedService = services[activeService];

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchMessage("Masukkan nama layanan yang ingin dicari.");
      return;
    }

    const foundIndex = services.findIndex((service) =>
      `${service.name} ${service.title} ${service.description}`
        .toLowerCase()
        .includes(query)
    );

    if (foundIndex !== -1) {
      setActiveService(foundIndex);
      setSearchMessage(`Layanan "${services[foundIndex].name}" ditemukan.`);
      document.getElementById("layanan")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      setSearchMessage(
        "Layanan tidak ditemukan. Silakan hubungi petugas melalui 119."
      );
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] font-sans text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1100px] items-center gap-5 px-5 py-3 justify-between">
          <a href="#beranda" className="shrink-0">
            <img
              src="/../public/image/logo.png"
              alt="Logo PSC 119"
              className="h-11 w-10 object-contain"
            />
          </a>

          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-7">
            {[
              ["Beranda", "#beranda"],
              ["Layanan", "#layanan"],
              ["Panduan", "#panduan"],
              ["Berita", "#berita"],
              ["Ulasan", "#ulasan"],
              ["Kontak", "#kontak"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-xs font-semibold text-gray-700 transition hover:text-red-700 sm:text-sm"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="text-white/0 select-none">
            pp
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header
        id="beranda"
        className="relative bg-gradient-to-r from-[#6e1212] via-[#b72424] to-[#d94646] py-16 text-white sm:py-20"
      >
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="max-w-xl">

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Unit Kegawatdaruratan Dinas Kesehatan Depok
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/90">
              Layanan ambulans dan respons medis darurat untuk seluruh warga
              Kota Depok, siaga setiap saat.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <EmergencyButton>Telepon 119</EmergencyButton>
              <a
                href="#kontak"
                className="inline-flex items-center justify-center rounded-lg border border-white/60 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Pesan Ambulans
              </a>
            </div>

            <form
              onSubmit={handleSearch}
              className="mt-7 flex max-w-md gap-2"
              role="search"
            >
              <input
                type="search"
                aria-label="Cari layanan"
                placeholder="Cari layanan tersedia"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border-0 bg-white px-4 py-3 text-sm text-gray-900 outline-none ring-red-300 focus:ring-2"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
              >
                Cari
              </button>
            </form>

            {searchMessage && (
              <p
                aria-live="polite"
                className="mt-2 text-xs font-medium text-white"
              >
                {searchMessage}
              </p>
            )}

            <p className="mt-3 text-xs text-white/80">
              Apabila sangat darurat, klik Telepon 119.
            </p>
          </div>
        </div>
      </header>

      {/* STATISTIK */}
      <div className="relative z-10 mx-auto -mt-10 max-w-[1100px] px-5">
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 shadow-xl md:grid-cols-4 md:px-7">
          {[
            ["24 Jam", "Siaga setiap hari"],
            ["119", "Satu nomor darurat"],
            ["Gratis", "Bagi kondisi gawat darurat"],
            ["Se-Kota Depok", "Jangkauan layanan"],
          ].map(([number, description]) => (
            <div key={number}>
              <b className="block text-lg font-bold text-red-700 sm:text-xl">
                {number}
              </b>
              <span className="text-xs text-gray-500">{description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <section className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr] md:py-20">
        <div>
          <SectionTitle>
            Pelayanan Medis Darurat Siaga selalu 24 Jam
          </SectionTitle>

          <em className="mt-4 block text-sm text-gray-700">
            "Kami selalu hadir kapan pun Anda membutuhkan."
          </em>

          <p className="my-5 max-w-lg text-sm leading-7 text-gray-600">
            Tidak peduli siang atau malam, tim kami siap memberikan dukungan
            penuh untuk setiap kebutuhan Anda. Dengan layanan siaga 24 jam,
            Anda bisa merasa tenang karena bantuan profesional selalu tersedia
            hanya dalam satu panggilan.
          </p>

          <EmergencyButton />
        </div>

        <div className="overflow-hidden rounded-2xl bg-gray-200 shadow-lg">
          <img
            src="/../public/image/Group 63.png"
            alt="Ambulans PSC 119"
            className="h-64 w-full object-cover md:h-80"
          />
        </div>
      </section>

      {/* LAYANAN */}
      <section id="layanan" className="scroll-mt-20 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-[1100px] px-5">
          <SectionTitle>Layanan Tersedia</SectionTitle>

          <div
            className="mt-7 grid grid-cols-2 overflow-hidden rounded-xl shadow-md sm:grid-cols-4"
            role="tablist"
            aria-label="Kategori layanan"
          >
            {services.map((service, index) => (
              <button
                key={service.name}
                type="button"
                role="tab"
                aria-selected={activeService === index}
                onClick={() => setActiveService(index)}
                className={`border-r border-gray-200 px-3 py-3 text-sm font-semibold transition ${
                  activeService === index
                    ? "bg-gradient-to-b from-red-600 to-red-800 text-white"
                    : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-700"
                }`}
              >
                {service.name}
              </button>
            ))}
          </div>

          <div
            className="mt-8 grid items-center gap-7 md:grid-cols-[240px_1fr]"
            role="tabpanel"
          >
            <div className="grid min-h-48 place-items-center rounded-2xl bg-gradient-to-br from-blue-900 via-blue-500 to-slate-200 p-6">
              <div className="grid h-24 w-24 place-items-center rounded-2xl bg-white/90 text-4xl font-bold text-red-700 shadow-lg">
                119
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedService.title}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                {selectedService.description}
              </p>

              <ul className="my-5 grid gap-3 text-sm sm:grid-cols-2">
                {selectedService.checks.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-700 text-xs text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <EmergencyButton />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-gray-100 pt-8">
            {[
              "ANAK NEGERI",
              "Siloam",
              "Aita Hospital",
              "BRAWIJAYA",
              "Citra Medika",
            ].map((partner) => (
              <div
                key={partner}
                className="grid h-16 w-16 place-items-center rounded-full border-2 border-red-700 px-1 text-center text-[9px] font-bold text-red-700"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PANDUAN */}
      <section
        id="panduan"
        className="scroll-mt-20 bg-[#6b7080] py-14 text-center text-white sm:py-16"
      >
        <div className="mx-auto max-w-[1100px] px-5">
          <SectionTitle light>
            Cara Mendapatkan Layanan Gawat Darurat
          </SectionTitle>

          <p className="mt-3 text-sm text-white/80">
            Empat langkah mudah saat Anda atau kerabat membutuhkan bantuan
            medis segera.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-lg border-t-4 border-red-700 bg-white px-5 py-6 text-center text-gray-900"
              >
                <div className="mx-auto mb-4 grid h-9 w-9 place-items-center rounded-full bg-red-700 text-sm font-bold text-white">
                  {step.number}
                </div>

                <h3 className="text-xs font-bold">{step.title}</h3>

                <p className="my-4 text-xs leading-6 text-gray-600">
                  {step.description}
                </p>

                <b className="text-[10px] uppercase text-red-700">
                  {step.note}
                </b>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BERITA */}
      <section
        id="berita"
        className="scroll-mt-20 bg-gradient-to-br from-red-600 to-red-900 py-14 text-white sm:py-16"
      >
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <SectionTitle light>Berita &amp; Informasi Edukasi</SectionTitle>
            <a
              href="#berita"
              className="text-xs font-semibold text-white hover:underline"
            >
              Lihat Semua Berita →
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.title}
                className={`flex h-72 flex-col justify-end rounded-xl bg-gradient-to-b ${item.style} p-5 shadow-lg transition hover:-translate-y-1`}
              >
                <time className="mb-3 w-fit rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-gray-800">
                  {item.date}
                </time>
                <h3 className="max-w-[220px] text-lg font-bold text-white">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ULASAN */}
      <section
        id="ulasan"
        className="scroll-mt-20 bg-[#f7f8fc] py-14 sm:py-16"
      >
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Survey Kepuasan Masyarakat
          </h2>

          <p className="mx-auto mb-12 mt-4 max-w-2xl text-center text-sm leading-6 text-gray-500">
            Bukti nyata respon cepat dan transparansi pelayanan
            kegawatdaruratan medis{" "}
            <b>PSC 119 Dinas Kesehatan Kota Depok</b>. Suara warga adalah tolak
            ukur integritas kami.
          </p>

          <div className="space-y-7 px-3 sm:px-8">
            {reviews.map((review, index) => (
              <div key={review.initials}>
                <article className="relative max-w-[420px] rounded-lg bg-white p-4 text-xs shadow-md">
                  <div
                    className={`absolute -left-3 -top-2 grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold text-white ${
                      review.blue ? "bg-blue-600" : "bg-pink-600"
                    }`}
                  >
                    {review.initials}
                  </div>

                  <div className="font-bold text-gray-900">
                    {review.name}
                    <span className="ml-2 font-normal text-gray-500">
                      {review.location}
                    </span>
                  </div>

                  <div className="mt-2 text-amber-500">
                    ★★★★★
                    <b className="ml-2 text-gray-500">{review.rating}</b>
                  </div>

                  <q className="my-3 block leading-6 text-gray-700">
                    {review.message}
                  </q>

                  <div
                    className={`text-[10px] font-bold ${
                      review.blue ? "text-blue-600" : "text-red-700"
                    }`}
                  >
                    ♥ {review.appreciation}
                    <span className="ml-3 font-normal text-gray-500">
                      {review.tag}
                    </span>
                  </div>
                </article>

                <article className="relative ml-auto mt-5 max-w-[380px] rounded-lg bg-white p-4 text-xs shadow-md">
                  <div className="absolute -right-3 -top-2 grid h-7 w-7 place-items-center rounded-full bg-red-700 text-[9px] font-bold text-white">
                    119
                  </div>

                  <div className="text-right font-bold text-red-700">
                    PSC 119 Dispatcher
                    <span className="block text-[10px] font-normal text-gray-500">
                      Dinas Kesehatan Kota Depok
                    </span>
                  </div>

                  <q className="mt-3 block leading-6 text-gray-700">
                    {dispatcherReplies[index]}
                  </q>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BAND INFORMASI */}
      <section className="bg-gradient-to-r from-red-700 to-red-900 py-5 text-white">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-5 px-5 text-center md:grid-cols-4">
          {[
            ["24/7 Jam", "Siaga melayani selalu"],
            ["119", "Nomor Gawat Darurat"],
            ["Medis", "Petugas Medis Bersertifikat"],
            ["Konsultasi", "Melayani sesi konsultasi"],
          ].map(([title, description]) => (
            <div key={title}>
              <b className="block text-xl font-bold sm:text-2xl">{title}</b>
              <span className="text-xs text-white/85">{description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="kontak"
        className="scroll-mt-20 bg-[#6b7080] py-10 text-white"
      >
        <div className="mx-auto max-w-[1100px] px-5">
          <div className="grid gap-10 border-b border-white/30 pb-8 md:grid-cols-[1fr_1.1fr]">
            <div>
              <h3 className="mb-6 text-xl font-bold leading-snug">
                Penanganan Cepat Gawat Darurat dan Pelayanan Ambulans Terpadu
              </h3>

              <div className="space-y-4 text-xs leading-6">
                <p className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-base text-red-700">
                    📍
                  </span>
                  Jl. Margonda Raya No. 54, Depok, Kecamatan Pancoran Mas, Kota
                  Depok, Jawa Barat 16431
                </p>

                <p className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-base text-red-700">
                    ✉
                  </span>
                  PSCDEPOK@gmail.com
                </p>

                <p className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-base text-red-700">
                    ☎
                  </span>
                  Hotline (0811-1922-0119)
                </p>
              </div>
            </div>

            <div>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-base font-bold">
                  Butuh Layanan Darurat?
                  <br />
                  Klik tombol berikut
                </h3>
                <EmergencyButton />
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <b className="mb-3 block text-sm">Siapa kami?</b>
                  <a href="#kontak" className="mb-2 block hover:underline">
                    Tentang Kami
                  </a>
                  <a href="#kontak" className="mb-2 block hover:underline">
                    Tim Kami
                  </a>
                  <a href="#layanan" className="mb-2 block hover:underline">
                    Layanan
                  </a>
                  <a href="#layanan" className="mb-2 block hover:underline">
                    Mitra
                  </a>
                </div>

                <div>
                  <b className="mb-3 block text-sm">Tautan Cepat</b>
                  <a href="#berita" className="mb-2 block hover:underline">
                    Berita
                  </a>
                  <a href="#kontak" className="mb-2 block hover:underline">
                    FAQ
                  </a>
                  <a href="#kontak" className="mb-2 block hover:underline">
                    Kontak
                  </a>
                </div>

                <div>
                  <b className="mb-3 block text-sm">Media Sosial</b>
                  <a href="#kontak" className="mb-2 block hover:underline">
                    Instagram
                  </a>
                  <a href="#kontak" className="mb-2 block hover:underline">
                    Threads
                  </a>
                  <a href="#kontak" className="mb-2 block hover:underline">
                    Youtube
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3 pt-5 text-[10px] text-white/80">
            <span>Copyright 2026 by Dinkes All Right Reserved.</span>
            <span>
              Kebijakan Privasi · Syarat Penggunaan · Aksesibilitas
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
