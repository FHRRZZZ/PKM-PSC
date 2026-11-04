import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Asterisk, 
  Newspaper, 
  HelpCircle, 
  PhoneCall, 
  Calendar,
  Upload,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';

const FormBerita = () => {
  const [formData, setFormData] = useState({
    judul: '',
    tanggal: '',
    deskripsi: '',
    kategori: '',
    tampilkan: false,
    foto: null
  });

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

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Kolom Kiri: Input Field Teks */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Nama Berita / Judul */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nama Berita / Judul <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: nama berita"
                    className="w-full px-4 py-3.5 text-sm bg-[#F5F5F5] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-gray-800 placeholder:text-gray-400 font-normal"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Gunakan judul yang ringkas, jelas, dan menggambarkan situasi darurat atau edukasi medis.
                  </p>
                </div>

                {/* Tanggal Publikasi */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tanggal Publikasi
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full px-4 py-3.5 text-sm bg-[#F5F5F5] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-gray-800 placeholder:text-gray-400 font-normal"
                    />
                    <Calendar className="w-5 h-5 text-gray-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Deskripsi Singkat / Ringkasan */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Deskripsi Singkat / Ringkasan
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Jelaskan berita dalam deskripsi"
                    className="w-full px-4 py-3.5 text-sm bg-[#F5F5F5] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-gray-800 placeholder:text-gray-400 font-normal resize-none"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2">
                    Ringkasan akan ditampilkan sebagai preview pada daftar kartu berita publik.
                  </p>
                </div>

                {/* Kategori Berita */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Kategori Berita
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-3.5 text-sm bg-[#F5F5F5] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 text-gray-600 appearance-none font-normal cursor-pointer">
                      <option value="" disabled selected hidden>
                        Pilih kategori berita (mis. Siaga Darurat, Info Layanan)
                      </option>
                      <option value="siaga-darurat">Siaga Darurat</option>
                      <option value="info-layanan">Info Layanan</option>
                      <option value="edukasi">Edukasi Medis</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Kolom Kanan: Upload Foto Utama */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Foto Utama Berita <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Upload Dropzone Container */}
                  <div className="w-full bg-[#F5F5F5] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[340px] border-2 border-dashed border-transparent hover:border-gray-300 transition-all cursor-pointer">
                    {/* Circle Icon Container */}
                    <div className="w-12 h-12 rounded-full bg-red-100/70 flex items-center justify-center text-red-700 mb-4">
                      <Upload className="w-5 h-5 stroke-[2.5]" />
                    </div>

                    <h4 className="font-bold text-base text-gray-900 mb-1">
                      Klik atau seret foto ke sini
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-[240px] mb-6">
                      Format JPG atau PNG (Maks. 5MB, resolusi rekomendasi 1200×630px)
                    </p>

                    <button 
                      type="button"
                      className="bg-gray-200/80 hover:bg-gray-300 text-gray-800 font-semibold text-xs px-5 py-2 rounded-lg transition-colors"
                    >
                      Pilih Berkas Komputer
                    </button>
                  </div>

                  {/* Info Box Bawah Upload */}
                  <div className="mt-4 bg-[#F5F5F5] rounded-xl p-3.5 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 font-medium leading-tight">
                      Foto utama akan otomatis dioptimasi untuk rasio media sosial serta pratinjau pesan darurat.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Toggle Tampilkan di Website Banner */}
            <div className="mt-8 bg-[#F5F5F5] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  Tampilkan di website
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Status artikel akan langsung terlihat oleh pengunjung jika diaktifkan.
                </p>
              </div>
              
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
              </label>
            </div>

            {/* Form Action Buttons */}
            <div className="mt-8 flex justify-end items-center gap-3">
              <button
                type="button"
                className="px-8 py-2.5 border border-red-800 text-gray-900 hover:bg-gray-50 font-semibold text-sm rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-red-800 hover:bg-red-900 text-white font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95"
              >
                Terbit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FormBerita;