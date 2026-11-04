import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PageHeader from '../components/PageHeader';

export default function AdminDashboard() {
  const recentUpdates = [
    {
      id: 1,
      title: 'Ambulans Gawat Darurat Tipe A',
      subtitle: 'Spesifikasi armada ICU & perawat resusitasi',
      type: 'Layanan',
      typeColor: 'bg-rose-50 text-rose-600',
      status: 'Terbit',
      statusColor: 'text-emerald-600',
      editor: 'Siti Rahma',
      time: 'Hari ini, 09:40',
    },
    {
      id: 2,
      title: 'Tips Pertolongan Pertama Henti Jantung',
      subtitle: 'Panduan CPR darurat sebelum ambulans tiba',
      type: 'Berita',
      typeColor: 'bg-blue-50 text-blue-600',
      status: 'Terbit',
      statusColor: 'text-emerald-600',
      editor: 'Dr. Adrian',
      time: 'Kemarin, 14:15',
    },
    {
      id: 3,
      title: 'Berapa estimasi waktu respon armada di ring 1?',
      subtitle: 'Kategori: Waktu Respon & Biaya',
      type: 'FAQ',
      typeColor: 'bg-emerald-50 text-emerald-600',
      status: 'Terbit',
      statusColor: 'text-emerald-600',
      editor: 'Siti Rahma',
      time: '2 hari lalu',
    },
    {
      id: 4,
      title: 'Penyuluhan Siaga Ambulans Musim Hujan',
      subtitle: 'Sosialisasi pos reaksi cepat kelurahan',
      type: 'Berita',
      typeColor: 'bg-blue-50 text-blue-600',
      status: 'Draf',
      statusColor: 'text-slate-500',
      editor: 'Siti Rahma',
      time: '3 hari lalu',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header Halaman */}
      <PageHeader 
        breadcrumb={{ parent: 'Admin', current: 'Dashboard' }}
        title="Ringkasan Sistem CMS"
        description="Pantau dan kelola konten portal ambulans Anda dalam satu panel."
      />

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">TOTAL</p>
          <div className="text-4xl font-bold text-slate-900 mb-1">6</div>
          <div className="text-sm font-semibold text-slate-800 mb-1">Layanan Terdaftar</div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>5 aktif</span>
            <span>•</span>
            <span>1 draf</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">TOTAL</p>
          <div className="text-4xl font-bold text-slate-900 mb-1">14</div>
          <div className="text-sm font-semibold text-slate-800 mb-1">Artikel Berita</div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>12 terbit</span>
            <span>•</span>
            <span>2 draf</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">TOTAL</p>
          <div className="text-4xl font-bold text-slate-900 mb-1">28</div>
          <div className="text-sm font-semibold text-slate-800 mb-1">Pertanyaan FAQ</div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Terbagi dalam 4 kategori</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Aksi Cepat Manajemen Konten</h3>
          <p className="text-xs text-slate-500">Buat publikasi baru atau perbarui daftar rujukan medis</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
              <span aria-hidden="true">+</span>
            <span>+ Layanan</span>
          </button>
          <button className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
              <span aria-hidden="true">+</span>
            <span>+ Berita Baru</span>
          </button>
          <button className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
              <span aria-hidden="true">+</span>
            <span>+ FAQ</span>
          </button>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Container */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold">📑</span>
                <h3 className="font-bold text-slate-800 text-sm">Pembaruan Konten Terbaru</h3>
              </div>
              <span className="text-xs text-slate-400">4 aktivitas terkini</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider border-b border-slate-100 font-medium">
                  <tr>
                    <th className="py-3 px-4">Judul Konten</th>
                    <th className="py-3 px-4">Tipe</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Editor • Waktu</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentUpdates.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <p className="font-semibold text-slate-800 text-xs leading-snug">{item.title}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.typeColor}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Terbit' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          <span className={`font-medium ${item.statusColor}`}>{item.status}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-700">{item.editor}</p>
                        <p className="text-[11px] text-slate-400">{item.time}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2 text-slate-500">
                          <button className="hover:text-blue-600 transition">
                            <span aria-hidden="true">✎</span>
                          </button>
                          <button className="hover:text-blue-600 transition">
                            <span aria-hidden="true">↗</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Menampilkan 4 dari 48 konten keseluruhan</span>
            <a href="#" className="font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 transition">
              Kelola Semua Konten &rarr;
            </a>
          </div>
        </div>

        {/* Synchronized Portal Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-3">Portal Publik Tersinkronisasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seluruh data layanan, nomor darurat 24 jam, dan artikel berita terbaru telah aktif dan dapat diakses oleh masyarakat umum.
            </p>
          </div>
          <div className="mt-6">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-lg transition">
              <span className="text-slate-600" aria-hidden="true">👁</span>
              <span>Lihat Pratinjau Website Publik</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
