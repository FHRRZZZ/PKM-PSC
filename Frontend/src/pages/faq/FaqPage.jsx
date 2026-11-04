import React from 'react';
import { 
  LayoutDashboard, 
  Asterisk, 
  Newspaper, 
  HelpCircle, 
  PhoneCall, 
  Search, 
  Plus, 
  Edit3, 
  Trash2,
  ShieldCheck
} from 'lucide-react';

const FaqPage = () => {
  // Data list FAQ sesuai gambar desain
  const faqList = [
    {
      id: 1,
      category: 'Waktu Tanggap & Armada',
      question: 'Berapa estimasi waktu kedatangan armada ambulans gawat darurat ke lokasi?',
      answer: 'Armada ambulans siaga 24 jam dengan respon cepat sesuai zona pos pantau terdekat. Di area perkotaan ring 1, rata-rata tim paramedis tiba dalam kurun waktu 8–15 menit setelah verifikasi koordinat darurat diterima dispatcher.'
    },
    {
      id: 2,
      category: 'Fasilitas Medis',
      question: 'Apakah unit ambulans ICU dilengkapi dengan ventilator portabel dan defibrilator?',
      answer: 'Seluruh unit ambulans rujukan tipe Advance (ICU Mobile) telah tersertifikasi memiliki ventilator invasif/non-invasif, monitor tanda vital multiparameter, defibrilator biphasic, serta didampingi oleh dokter anestesi atau perawat spesialis gawat darurat.'
    },
    {
      id: 3,
      category: 'Tarif & Administrasi',
      question: 'Bagaimana skema penagihan dan pertanggungan asuransi/BPJS untuk penjemputan darurat?',
      answer: 'Penjemputan kondisi darurat kritis (Code Red) dijamin langsung melalui integrasi jaminan rujukan rumah sakit mitra atau BPJS Kesehatan sesuai indikasi medis darurat. Pasien umum dapat menyelesaikan administrasi pasca-tindakan stabilisasi.'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBFB] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0">
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

            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
              <Newspaper className="w-5 h-5 text-gray-700" />
              <span className="text-sm">Berita</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 text-red-700 bg-red-50/60 rounded-xl font-semibold border-l-4 border-red-700 transition-colors">
              <HelpCircle className="w-5 h-5 text-red-700" />
              <span className="text-sm">FAQ</span>
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
            Admin &gt; <span className="text-gray-800 font-semibold">FAQ</span>
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            CMS FAQ (Tanya Jawab Layanan)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola pertanyaan umum seputar biaya, armada, jangkauan darurat, dan prosedur rujukan.
          </p>
        </div>

        {/* Action Bar (Search & Add Button Card) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Cari pertanyaan umum, kata kunci biaya, wilayah..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all placeholder:text-gray-400"
            />
          </div>
          <button className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Tambah FAQ</span>
          </button>
        </div>

        {/* Subheader / Layout Info */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            Simulasi Format Pertanyaan <span className="text-xs font-normal text-gray-500">(Pratinjau struktur konten kartu)</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">Demo Layout Triage</span>
        </div>

        {/* List Card FAQ */}
        <div className="space-y-4">
          {faqList.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative">
              <div>
                {/* Top Row: Category Badge & Action Buttons (Edit / Hapus) */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
                    {faq.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Question */}
                <h4 className="font-bold text-base text-gray-900 mb-2">
                  {faq.question}
                </h4>

                {/* Answer Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Info (Standar Komunikasi Publik Darurat) */}
        <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-3.5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">
              Standar Komunikasi Publik Darurat
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Setiap pembaruan FAQ wajib memuat informasi akurat mengenai batas waktu penjemputan, perlengkapan medis di dalam kabin ambulans, dan kontak darurat 119 / hotline posko utama. Konten yang dihapus akan segera dinonaktifkan dari widget halaman beranda.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;