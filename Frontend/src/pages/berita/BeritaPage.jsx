import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Asterisk, 
  Newspaper, 
  HelpCircle, 
  PhoneCall, 
  Search, 
  Plus, 
  Image as ImageIcon, 
  Grid2x2,
  LogOut
} from 'lucide-react';

const BeritaPage = () => {
  // Sample data berita
  const newsList = [
    { id: 1, title: '[ Judul Berita ]', date: '[ Tanggal ]', desc: '[ Deskripsi Berita perihal Informasi Pelayanan, Panduan dan lain-lain ]', active: true },
    { id: 2, title: '[ Judul Berita ]', date: '[ Tanggal ]', desc: '[ Deskripsi Berita perihal Informasi Pelayanan, Panduan dan lain-lain ]', active: true },
    { id: 3, title: '[ Judul Berita ]', date: '[ Tanggal ]', desc: '[ Deskripsi Berita perihal Informasi Pelayanan, Panduan dan lain-lain ]', active: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBFB] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6">
        <div>
          {/* Logo / Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
              119
            </div>
            <h1 className="font-bold text-lg text-gray-900 leading-tight">
              PSC Dinkes Depok
            </h1>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <LayoutDashboard className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-sm">Dashboard</span>
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <Asterisk className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-sm">Layanan</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 text-red-700 bg-red-50/60 rounded-xl font-semibold border-l-4 border-red-700 transition-colors">
              <Newspaper className="w-5 h-5 text-red-700" />
              <span className="text-sm">Berita</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-sm">FAQ</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <PhoneCall className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-sm">Kontak</span>
            </a>
          </nav>
        </div>

        {/* User Profile / Logout */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-900 text-white flex items-center justify-center font-bold text-sm">
              <span className="text-xs">👤</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Siti Rahma</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded">
                Admin Medis
              </span>
            </div>
          </div>
          <button className="bg-red-800 hover:bg-red-900 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium">
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Breadcrumb & Page Title */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 font-medium mb-1">
            Admin &gt; <span className="text-gray-800 font-semibold">Berita</span>
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            CMS Berita & Informasi Medis
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Buat artikel, pengumuman darurat, atau rilis kesehatan ambulans baru.
          </p>
        </div>

        {/* Action Bar (Search & Add Button Card) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari nama berita..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all placeholder:text-gray-400"
            />
          </div>
          <button className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95">
            <Plus className="w-4 h-4" />
            <span>Tambah Berita</span>
          </button>
        </div>

        {/* Section Heading */}
        <div className="flex items-center gap-2 mb-4">
          <Grid2x2 className="w-4 h-4 text-gray-700" />
          <h3 className="font-bold text-gray-800 text-base">Format Katalog Berita</h3>
        </div>

        {/* Grid Cards Berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                {/* Placeholder Image 16:9 */}
                <div className="w-full aspect-video bg-gray-200/80 rounded-xl flex flex-col items-center justify-center text-gray-400 mb-4">
                  <div className="relative">
                    <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                    <Plus className="w-3 h-3 absolute -top-1 -right-1 stroke-[3]" />
                  </div>
                  <span className="text-xs font-semibold mt-2 text-gray-500">
                    [ Foto Berita 16:9 ]
                  </span>
                </div>

                {/* Content Info */}
                <h4 className="font-bold text-base text-gray-900 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Action / Toggle */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {/* Custom Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-300"></div>
                  </label>
                  <span className="text-gray-600 font-medium">Tampilkan di website</span>
                </div>
                <button className="text-blue-700 font-semibold hover:underline">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BeritaPage;