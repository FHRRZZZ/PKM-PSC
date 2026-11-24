import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [pinned, setPinned] = useState(true);
  const floating = scrolled && pinned;

  // kode effect, floating, dan JSX navbar

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y <= 20) setPinned(true); // kembali ke atas -> aktifkan lagi
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${pinned ? "sticky" : "relative"} top-0 z-50`}>
        <div
            className={`mx-auto bg-white transition-all duration-300 ease-in-out ${
            floating
                ? "w-[calc(100%-2rem)] max-w-[1100px] translate-y-4 rounded-[30px] bg-white/90 shadow-lg backdrop-blur-md"
                : "w-full max-w-full translate-y-0 rounded-none shadow-sm"
            }`}
        >
            <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-5 px-5 py-3 sm:px-6">
            <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="shrink-0"
            >
                <img
                src="/image/logo.png"
                alt="Logo PSC 119"
                className="h-11 w-10 object-contain"
                />
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-7">
                {[
                ["Beranda", "#beranda"],
                ["Layanan", "#layanan"],
                ["Klinik", "#klinik"],
                ["Panduan", "#panduan"],
                ["Tentang", "#tentang"],
                ["Berita", "#berita"],
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

            {/* Tombol X: div "pp" diganti jadi fungsi */}
            <button
                type="button"
                onClick={() => setPinned(false)}
                aria-label="Berhenti mengikuti navbar"
                tabIndex={floating ? 0 : -1}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-red-700 ${
                floating ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            >
                ✕
            </button>
            </div>
        </div>
    </nav>
  );
}