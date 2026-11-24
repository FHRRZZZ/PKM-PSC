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
export default function ProfileLayout({ title, crumbs = [], menu = [], prev, next, menuHorizontal = false, children }) {
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
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${menuHorizontal ? 'py-6' : 'py-10'} ${!menuHorizontal && menu.length > 0 ? 'grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12' : ''}`}>
        {/* Navigasi halaman: dapat tampil horizontal sebagai sub-navbar */}
        {menu.length > 0 && (
          <aside className={menuHorizontal ? 'mb-8' : 'mb-8 lg:mb-0'}>
            <nav
              aria-label="Menu halaman"
              className={menuHorizontal
                ? '-mx-4 flex gap-2 overflow-x-auto border-y border-slate-200 bg-white px-4 py-3 sm:mx-0 sm:rounded-2xl sm:border sm:px-3'
                : '-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:sticky lg:top-24 lg:mx-0 lg:block lg:max-h-[70vh] lg:space-y-3 lg:overflow-y-auto lg:px-0 lg:pb-0'}
            >
              {!menuHorizontal && <div className="mb-4 hidden rounded-2xl bg-[#182433] p-5 text-white shadow-lg shadow-slate-900/10 lg:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">PSC Kota Depok</p>
                <p className="mt-2 text-sm font-semibold leading-5">Informasi Klinik</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">Pilih informasi yang ingin Anda lihat.</p>
              </div>}
              {menu.map((m, index) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  className={({ isActive }) =>
                    `group flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-all ${menuHorizontal ? 'min-w-[180px] sm:min-w-0 sm:flex-1 sm:justify-center' : 'lg:w-full lg:px-4 lg:py-4'} ${
                      isActive
                        ? 'border-red-200 bg-red-50 font-semibold text-red-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-red-100 hover:text-red-700 hover:shadow-sm'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          isActive ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-700'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 truncate">{m.label}</span>
                      <span className={`ml-auto text-lg transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-red-700' : 'text-slate-300'}`} aria-hidden="true">›</span>
                    </>
                  )}
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
