import { Link, NavLink } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

/**
 * Kerangka halaman profil publik: hero + breadcrumb, sidebar tipis, isi, prev/next.
 * Dapat dipakai ulang untuk Layanan maupun halaman Profil.
 *
 * props:
 *  title    judul hero
 *  crumbs   [{ label, to? }]  (setelah "Home")
 *  menu     [{ label, to }]   item sidebar
 *  prev,next  { label, to } | null
 */
export default function ProfileLayout({ title, crumbs = [], menu = [], prev, next, children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-900 to-red-600 text-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-24">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-red-100">
            <Link to="/" className="hover:text-white">Home</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {c.to ? (
                  <Link to={c.to} className="hover:text-white">{c.label}</Link>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-3 break-words text-3xl font-bold sm:text-4xl">{title}</h1>
        </div>
      </section>

      {/* Body */}
      <div
        className={`mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 ${
          menu.length > 0 ? 'lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12' : ''
        }`}
      >
        {/* Sidebar: chip horizontal di mobile, garis vertikal di desktop */}
        {menu.length > 0 && (
          <aside className="min-w-0">
            <nav
              aria-label="Menu halaman"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:block lg:max-h-[70vh] lg:gap-0 lg:overflow-y-auto lg:border-l lg:border-slate-200 lg:px-0 lg:pb-0"
            >
              {menu.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  className={({ isActive }) =>
                    `shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors lg:block lg:whitespace-normal lg:rounded-none lg:border-0 lg:border-l-4 lg:py-3 lg:pl-4 lg:-ml-px ${
                      isActive
                        ? 'border-red-700 bg-red-50 font-semibold text-red-700 lg:bg-transparent'
                        : 'border-slate-200 text-slate-500 hover:text-red-700 lg:border-transparent'
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        )}

        {/* Isi */}
        <main className="min-w-0">
          {children}

          {(prev || next) && (
            <div className="mt-12 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
              {prev ? (
                <Link to={prev.to} className="group flex min-w-0 items-center gap-3">
                  <span className="text-xl text-red-700 transition-transform group-hover:-translate-x-1">←</span>
                  <span className="min-w-0">
                    <span className="block text-xs text-slate-500">Sebelumnya</span>
                    <span className="block truncate font-semibold text-slate-900 group-hover:text-red-700">
                      {prev.label}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link to={next.to} className="group flex min-w-0 items-center justify-end gap-3 text-right">
                  <span className="min-w-0">
                    <span className="block text-xs text-slate-500">Selanjutnya</span>
                    <span className="block truncate font-semibold text-slate-900 group-hover:text-red-700">
                      {next.label}
                    </span>
                  </span>
                  <span className="text-xl text-red-700 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}