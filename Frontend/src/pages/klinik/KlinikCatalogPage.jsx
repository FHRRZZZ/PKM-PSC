import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getLayananPublik } from '../../api/layanan';

export default function KlinikCatalogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLayananPublik('klinik').then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-gradient-to-r from-red-950 to-red-700 text-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-20 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-200">Klinik PSC 119 Kota Depok</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Katalog Layanan Klinik</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-red-100">Temukan layanan klinik seperti Gigi, Terapi, Laboratorium, dan layanan kesehatan lainnya.</p>
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Layanan tersedia</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Pilih layanan klinik</h2></div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">{items.length} layanan</span>
        </div>
        {loading ? <p className="text-sm text-slate-500">Memuat katalog layanan...</p> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link key={item.id} to={`/layanan/${item.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">
                <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">Layanan klinik</span>
                <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-red-700">{item.nama}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.deskripsi || 'Informasi klinik akan segera dilengkapi.'}</p>
                <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">{item.tarif_is_active && item.tarif ? `Tarif mulai Rp${Number(item.tarif).toLocaleString('id-ID')}` : 'Informasi layanan tersedia di klinik'}</p>
                <span className="mt-4 inline-flex items-center rounded-xl bg-red-700 px-3 py-2 text-sm font-bold text-white transition group-hover:bg-red-800">Lihat layanan →</span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
