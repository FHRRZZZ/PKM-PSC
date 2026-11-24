import { useLocation } from 'react-router-dom';

export default function Footer({ contact }) {
    const { pathname } = useLocation();
    const resolveHref = (href) => href.startsWith('#') && pathname !== '/' ? `/${href}` : href;


    const MAP_EMBED_URL = 
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.9981358582254!2d106.81831207442792!3d-6.394240562539539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eb8f7f246089%3A0xa154f35cbb225f69!2sPSC%20119%20KOTA%20DEPOK!5e0!3m2!1sid!2sid!4v1794122426971!5m2!1sid!2sid";
      
      const MAP_LINK = "https://www.google.com/maps/place/PSC+119+KOTA+DEPOK/@-6.3942406,106.8183121,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69eb8f7f246089:0xa154f35cbb225f69!8m2!3d-6.3942406!4d106.8183121!16s%2Fg%2F11c5q9g9k7";
    
      const FOOTER_LINKS = [
      {
        title: "Siapa Kami?",
        items: [
          { label: "Tentang Kami", href: "/tentang" },
          { label: "Tim Medis & Kru", href: "/tentang" },
          { label: "Layanan Ambulans", href: "/layanan" },
          { label: "Mitra & Jejaring RS", href: "/layanan" },
          { label: "Standar Pelayanan", href: "#kontak" },
        ],
      },
      {
        title: "Tautan Cepat",
        items: [
          { label: "Berita Terkini", href: "#berita" },
          { label: "Edukasi P3K & CPR", href: "#berita" },
          { label: "Tanya Jawab (FAQ)", href: "#kontak" },
          { label: "Hubungi Kami", href: "#kontak" },
          { label: "Alur Rujukan Pasien", href: "#layanan" },
        ],
      },
    ];
    
    const SOCIALS = [
      { label: "Instagram", href: "https://instagram.com", color: "text-pink-400" },
      { label: "Threads", href: "https://threads.net", color: "text-slate-300" },
      { label: "YouTube", href: "https://youtube.com", color: "text-red-500" },
    ];
    
    const iconWrap =
      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/90 text-red-400 transition-colors group-hover:border-red-500";
    const headingCls =
      "border-l-2 border-red-500 pl-2.5 text-sm font-bold uppercase tracking-wider text-slate-200";
    const linkCls =
      "inline-block text-slate-400 transition duration-150 hover:translate-x-1 hover:text-white";
    

  return (
    <footer
      id="kontak"
      className="w-full scroll-mt-20 border-t border-slate-600/60 bg-[#243042] text-slate-100"
    >
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-slate-600/50 pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-red-400">
              Dinas Kesehatan Kota Depok
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              UPTD PSC 119
            </h2>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <p className="max-w-md text-xs leading-relaxed text-slate-300 md:text-right">
              Pusat Pelayanan Keselamatan Terpadu Tanggap Darurat Medis 24 Jam Kota Depok.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {/* Kolom link */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="space-y-4 lg:col-span-2">
              <h3 className={headingCls}>{group.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a href={resolveHref(item.href)} className={linkCls}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kanal Resmi */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className={headingCls}>Kanal Resmi</h3>
            <ul className="space-y-2.5 text-sm">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-400 transition duration-150 hover:translate-x-1 hover:text-white"
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full bg-current ${s.color}`} />
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak Kami */}
          <div className="space-y-4 lg:col-span-3">
            <h3 className={headingCls}>Kontak Kami</h3>

            <div className="space-y-3.5 pt-1">
              {/* Alamat */}
              <div className="group flex items-start gap-3">
                <div className={iconWrap}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400">Kantor Operasional:</span>
                  <span className="text-xs font-medium leading-normal text-slate-200">
                    {contact?.alamat || "Informasi alamat belum tersedia."}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="group flex items-start gap-3">
                <div className={iconWrap}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-medium text-slate-400">Surat Elektronik:</span>
                  {contact?.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="break-all text-xs text-slate-200 underline-offset-2 transition-colors hover:text-white hover:underline"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-200">Email belum tersedia.</span>
                  )}
                </div>
              </div>

              {/* Hotline */}
              <div className="group flex items-start gap-3">
                <div className={iconWrap}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400">Hotline / Telp:</span>
                  <a
                    href={`tel:${String(contact?.hotline || contact?.no_darurat || "119").replace(/\D/g, "")}`}
                    className="font-mono text-xs font-semibold text-slate-200 transition-colors hover:text-white"
                  >
                    {contact?.hotline || contact?.no_darurat || "119"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Lokasi Posko Siaga (Google Maps) */}
          <div className="space-y-4 md:col-span-2 lg:col-span-3">
            <h3 className={headingCls}>Lokasi Posko Siaga</h3>

            <div className="relative overflow-hidden rounded-xl border border-slate-600/60 bg-slate-800 shadow-md">
              <iframe
                title="Lokasi PSC 119 Dinas Kesehatan Kota Depok"
                src={MAP_EMBED_URL}
                className="h-44 w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 shadow-md transition hover:bg-slate-50"
              >
                Buka di Maps
                <svg className="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bar legal */}
      <div className="border-t border-slate-600/50 bg-[#1a2332] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-300 sm:px-6 md:flex-row lg:px-8">
          <p className="text-center md:text-left">
            Copyright © 2026{" "}
            <span className="font-semibold">Dinas Kesehatan Kota Depok</span>. Hak Cipta
            Dilindungi Undang-Undang.
          </p>

          <nav aria-label="Legal Links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/#kontak" className="transition-colors hover:text-white">Kebijakan Privasi</a>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <a href="/#kontak" className="transition-colors hover:text-white">Syarat Penggunaan</a>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <a href="/#kontak" className="transition-colors hover:text-white">Aksesibilitas</a>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <a href="/#kontak" className="transition-colors hover:text-white">Maklumat Pelayanan</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
