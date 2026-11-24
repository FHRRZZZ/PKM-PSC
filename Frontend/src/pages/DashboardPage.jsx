import { useEffect,useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { getBeritaPublik } from "../api/berita";
import { getKontak } from "../api/kontak";
import { getLayananPublik } from "../api/layanan";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getImageUrl(path) {
  return path?.startsWith("http") ? path : `${API_URL}${path}`;
}

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

function Reveal({ children, className = "", delay = 0, from = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = {
    up: "translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
  }[from];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : `${hidden} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [contact, setContact] = useState(null);
  const [contentError, setContentError] = useState("");
  const [activeService, setActiveService] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const selectedService = services[activeService];


  useEffect(() => {
    let mounted = true;

    Promise.all([getLayananPublik(), getBeritaPublik(), getKontak()])
      .then(([serviceData, newsData, contactData]) => {
        if (!mounted) return;
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setNews((Array.isArray(newsData) ? newsData : []).slice(0, 3));
        setContact(Array.isArray(contactData) ? contactData[0] || null : null);
      })
      .catch((error) => {
        if (mounted) setContentError(error.message || "Gagal memuat konten.");
      });

    return () => {
      mounted = false;
    };
  }, []);

  
  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchMessage("Masukkan nama layanan yang ingin dicari.");
      return;
    }

    const foundIndex = services.findIndex((service) =>
      `${service.nama} ${service.deskripsi}`
        .toLowerCase()
        .includes(query)
    );

    if (foundIndex !== -1) {
      setActiveService(foundIndex);
      setSearchMessage(`Layanan "${services[foundIndex].nama}" ditemukan.`);
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
  <main className="min-h-screen overflow-x-clip bg-[#f7f8fc] font-sans text-gray-900">
  {/* NAVBAR */}
  <Navbar />

      {/* HERO */}
      <header
        id="beranda"
        className="relative bg-gradient-to-r from-[#6e1212] via-[#ba2020] to-[#d94646] py-16 text-white sm:py-20"
      >
        <img src="/image/574c2-ambulans-removebg-preview.png" className="pointer-events-none absolute bottom-10 right-0 w-full object-contain object-right opacity-30 md:right-8 md:w-[45%] md:opacity-70 [mask-image:linear-gradient(to_left,black_60%,transparent)]" aria-hidden="true" alt=""/>
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

            {contentError && (
              <p className="mt-2 text-xs font-medium text-yellow-100" role="alert">
                {contentError}
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

        <div className="overflow-hidden rounded-2xl">
        <img
          src="/image/intro.webp"
          alt="Ambulans PSC 119"
          className="h-64 w-full object-contain md:h-80"
        />
      </div>
      </section>

      {/* LAYANAN */}
      <section id="layanan" className="scroll-mt-20 bg-white py-14 sm:py-16" mb-50>
        <div className="mx-auto max-w-[1100px] px-5">
          <SectionTitle>Layanan Tersedia</SectionTitle>

          <div
            className="mt-7 grid grid-cols-2 overflow-hidden rounded-xl shadow-md sm:grid-cols-4"
            role="tablist"
            aria-label="Kategori layanan"
          >
            {services.map((service, index) => (
              <button
                key={service.id}
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
                {service.nama}
              </button>
            ))}
          </div>

          <div
            key={activeService}
            className="mt-8 grid items-center gap-7 animate-fade-up md:grid-cols-[240px_1fr]"
            role="tabpanel"
          >
            <div className="grid min-h-48 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-500 to-slate-200">
              {selectedService?.foto ? (
                <img
                  src={getImageUrl(selectedService.foto)}
                  alt={selectedService.nama}
                  className="h-full min-h-48 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-2xl bg-white/90 text-4xl font-bold text-red-700 shadow-lg">
                  119
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedService?.nama || "Memuat layanan..."}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                {selectedService?.deskripsi || "Belum ada layanan tersedia."}
              </p>

              <ul className="my-5 grid gap-3 text-sm sm:grid-cols-2">
                {selectedService?.checks?.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    {/* <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-700 text-xs text-white">
                      ✓
                    </span> */}
                    {item}
                  </li>
                ))}
              </ul>

              {selectedService?.slug && (
                <Link
                  to={`/layanan/${selectedService.slug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-red-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-800"
                >
                  Lihat selengkapnya
                </Link>
              )}
            </div>
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
              {steps.map((step, i) => (
                <Reveal key={step.number} delay={i * 100} className="h-full">
                  <article className="h-full rounded-lg border-t-4 border-red-700 bg-white px-5 py-6 text-center text-gray-900">
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
                  </Reveal>
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
            <Reveal>
              <SectionTitle light>Berita &amp; Informasi Edukasi</SectionTitle>
            </Reveal>
            <a
              href="/berita"
              className="text-xs font-semibold text-white hover:underline"
            >
              Lihat Semua Berita →
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item, index) => (
              <article
                key={item.id}
                className={`flex h-72 flex-col justify-end rounded-xl bg-gradient-to-b ${["from-slate-500 to-slate-900", "from-slate-400 to-slate-800", "from-slate-300 to-slate-700"][index]} bg-cover bg-center p-5 shadow-lg transition hover:-translate-y-1`}
                style={item.foto ? { backgroundImage: `linear-gradient(to bottom, transparent 20%, rgba(15, 23, 42, .92)), url("${getImageUrl(item.foto)}")` } : undefined}
              >
                <time className="mb-3 w-fit rounded-md bg-white px-3 py-2 text-[11px] font-semibold text-gray-800">
                  {new Date(item.tanggal_terbit || item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </time>
                <h3 className="max-w-[220px] text-lg font-bold text-white">
                  {item.judul}
                </h3>
              </article>
            ))}
            {!news.length && <p className="text-sm text-white/80">Belum ada berita yang diterbitkan.</p>}
          </div>
        </div>
      </section>

      {/* ULASAN */}
      <section id="ulasan" className="scroll-mt-20 bg-[#f7f8fc] py-14 sm:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Survey Kepuasan Masyarakat
          </h2>

          <p className="mx-auto mb-12 mt-4 max-w-2xl text-center text-sm leading-6 text-gray-500">
            Bukti nyata respon cepat dan transparansi pelayanan kegawatdaruratan
            medis <b>PSC 119 Dinas Kesehatan Kota Depok</b>. Suara warga adalah
            tolak ukur integritas kami.
          </p>

          <div className="space-y-12 px-3 sm:px-8">
            {reviews.map((review, index) => (
              <div key={review.initials} className="flex flex-col gap-6">
                {/* Ulasan warga: kiri */}
              <Reveal
                from="left"
                className="w-full max-w-[420px] self-start sm:w-[60%] sm:max-w-none">
                <article className="relative rounded-lg bg-white p-4 text-xs shadow-md">
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
            </Reveal>
                
                {/* Balasan dispatcher: kanan */}
                <Reveal
                  from="right"
                  delay={150}
                  className="w-full max-w-[380px] self-end sm:w-[55%] sm:max-w-none"
                >
                  <article className="relative rounded-lg bg-white p-4 text-xs shadow-md">
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
                </Reveal>
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
      <Footer contact={contact} />
    </main>
  );
}
