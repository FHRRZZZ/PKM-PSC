require('dotenv').config();
const { sequelize } = require('../config/db');
const Layanan = require('../models/Layanan');
const Berita = require('../models/Berita');
const KategoriBerita = require('../models/KategoriBerita');
const Faq = require('../models/Faq');
const Kontak = require('../models/Kontak');
const HeroSlide = require('../models/HeroSlide');
const GaleriPSC = require('../models/GaleriPSC');
const {
    KlinikProfile, JamOperasional, Dokter, JadwalPraktik,
    StrukturOrganisasi, AlurBerobat, Penjaminan, GaleriFasilitas
} = require('../models/klinikModels');

const layananAmbulans = [
    ['Ambulans Darurat', 'Evakuasi cepat untuk kondisi gawat darurat di wilayah Kota Depok.'],
    ['Respons Kecelakaan', 'Pertolongan awal dan evakuasi korban kecelakaan lalu lintas maupun kerja.'],
    ['Rujukan Medis', 'Koordinasi rujukan menuju fasilitas kesehatan yang sesuai dengan kondisi pasien.'],
    ['Pendampingan Persalinan', 'Bantuan transportasi dan pendampingan untuk kondisi persalinan darurat.'],
    ['Konsultasi Kegawatdaruratan', 'Panduan awal dari petugas sebelum tim medis tiba di lokasi.'],
];
const layananKlinik = [
    ['Layanan Gigi', 'Pemeriksaan kesehatan gigi, konsultasi, dan tindakan dasar oleh tenaga kesehatan klinik.'],
    ['Layanan Terapi', 'Layanan terapi dan pemulihan sesuai kebutuhan pasien dengan pendampingan tenaga profesional.'],
    ['Laboratorium', 'Pemeriksaan laboratorium dasar untuk membantu mendukung kebutuhan pemeriksaan pasien.'],
    ['Konsultasi Umum', 'Konsultasi kesehatan umum dan pemeriksaan awal sebelum mendapatkan penanganan lanjutan.'],
    ['Farmasi Klinik', 'Informasi dan pelayanan obat sesuai resep serta arahan tenaga kesehatan klinik.'],
];
const kategori = ['Kesehatan Darurat', 'Edukasi Kesehatan', 'Layanan PSC', 'Informasi Klinik', 'Kabar Depok'];
const berita = [
    'Kenali tanda-tanda kondisi gawat darurat sebelum terlambat',
    'Cara aman memberikan pertolongan pertama pada kecelakaan',
    'PSC 119 Depok siaga melayani warga selama 24 jam',
    'Panduan menghubungi 119 dengan informasi lokasi yang lengkap',
    'Menjaga keselamatan keluarga saat perjalanan di Kota Depok',
];
const faq = [
    ['Kapan saya harus menghubungi 119?', 'Hubungi 119 saat terjadi kondisi gawat darurat medis yang membutuhkan pertolongan segera.'],
    ['Apakah layanan PSC 119 dikenakan biaya?', 'Layanan respons kegawatdaruratan PSC 119 untuk kondisi darurat tidak dipungut biaya.'],
    ['Informasi apa yang perlu disampaikan kepada operator?', 'Sampaikan lokasi lengkap, kondisi pasien, jumlah korban, dan nomor yang dapat dihubungi.'],
    ['Apakah ambulans dapat mengantar pasien untuk kontrol rutin?', 'Ambulans PSC diprioritaskan untuk kondisi darurat dan evakuasi medis.'],
    ['Bagaimana cara mengetahui jadwal dokter Klinik?', 'Jadwal dokter terbaru dapat dilihat pada section Klinik di landing page.'],
];

async function seed() {
    await sequelize.authenticate();
    await sequelize.sync();

    for (let i = 0; i < layananAmbulans.length; i += 1) {
        const [item] = await Layanan.findOrCreate({ where: { slug: `demo-${i + 1}` }, defaults: { nama: layananAmbulans[i][0], slug: `demo-${i + 1}`, jenis: 'ambulans', deskripsi: layananAmbulans[i][1], urutan: i, is_active: true } });
        await item.update({ nama: layananAmbulans[i][0], jenis: 'ambulans', deskripsi: layananAmbulans[i][1], is_active: true, urutan: i });
    }
    for (let i = 0; i < layananKlinik.length; i += 1) {
        const slug = `klinik-${i + 1}`;
        const [item] = await Layanan.findOrCreate({ where: { slug }, defaults: { nama: layananKlinik[i][0], slug, jenis: 'klinik', deskripsi: layananKlinik[i][1], urutan: i, is_active: true } });
        await item.update({ nama: layananKlinik[i][0], jenis: 'klinik', deskripsi: layananKlinik[i][1], is_active: true, urutan: i });
    }

    const kategoriRows = [];
    for (let i = 0; i < kategori.length; i += 1) {
        const [row] = await KategoriBerita.findOrCreate({ where: { slug: `demo-kategori-${i + 1}` }, defaults: { nama: kategori[i], slug: `demo-kategori-${i + 1}` } });
        kategoriRows.push(row);
    }
    for (let i = 0; i < berita.length; i += 1) {
        await Berita.findOrCreate({ where: { slug: `demo-berita-${i + 1}` }, defaults: { kategori_id: kategoriRows[i].id, judul: berita[i], slug: `demo-berita-${i + 1}`, deskripsi: `${berita[i]}. Dapatkan informasi resmi dan panduan dari PSC 119 Dinas Kesehatan Kota Depok.`, status: 'terbit', tanggal_terbit: new Date(Date.now() - i * 86400000) } });
    }
    for (let i = 0; i < faq.length; i += 1) await Faq.findOrCreate({ where: { pertanyaan: faq[i][0] }, defaults: { pertanyaan: faq[i][0], jawaban: faq[i][1], urutan: i, is_active: true } });
    for (let i = 0; i < 5; i += 1) await Kontak.findOrCreate({ where: { email: `posko${i + 1}@pscdepok.go.id` }, defaults: { no_darurat: '119', hotline: `021-77${i + 1}119`, email: `posko${i + 1}@pscdepok.go.id`, alamat: `Posko PSC 119 Kota Depok - Wilayah ${i + 1}` } });

    const heroTitles = ['Unit Kegawatdaruratan PSC 119 Kota Depok', 'Bantuan Medis Darurat Lebih Dekat', 'Siaga untuk Warga Depok', 'Satu Panggilan untuk Pertolongan', 'PSC 119 Hadir Setiap Saat'];
    for (let i = 0; i < heroTitles.length; i += 1) await HeroSlide.findOrCreate({ where: { title: heroTitles[i] }, defaults: { eyebrow: 'Dinas Kesehatan Kota Depok', title: heroTitles[i], description: 'Layanan ambulans dan respons medis darurat untuk seluruh warga Kota Depok.', primary_label: 'Telepon 119', primary_link: 'tel:119', secondary_label: 'Lihat layanan', secondary_link: '#layanan', urutan: i, is_active: true } });

    await KlinikProfile.findOrCreate({ where: { id: 1 }, defaults: { id: 1, nama: 'Klinik PSC 119 Kota Depok', deskripsi: 'Pusat informasi layanan klinik dan jadwal tenaga medis PSC 119 Kota Depok.', melayani: 'Warga Kota Depok dan masyarakat yang membutuhkan informasi layanan kesehatan.', alamat: 'Kota Depok, Jawa Barat', telepon: '119', whatsapp: '0811-119-119', email: 'klinik@pscdepok.go.id', akreditasi: 'Dalam proses pemutakhiran', akreditasi_tahun: '2026' } });
    const hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    for (let i = 0; i < hari.length; i += 1) await JamOperasional.findOrCreate({ where: { hari: hari[i] }, defaults: { hari: hari[i], jam_buka: '08:00:00', jam_tutup: '16:00:00', is_tutup: false, keterangan: 'Pelayanan klinik' } });
    const dokterData = [['dr. Aditya Pratama', 'Dokter Umum'], ['dr. Siti Rahma', 'Dokter Umum'], ['dr. Bima Nugraha', 'Dokter Emergensi'], ['dr. Nadia Putri', 'Dokter Umum'], ['dr. Raka Wijaya', 'Dokter Emergensi']];
    const dokterRows = [];
    for (let i = 0; i < dokterData.length; i += 1) { const [row] = await Dokter.findOrCreate({ where: { nama: dokterData[i][0] }, defaults: { nama: dokterData[i][0], spesialisasi: dokterData[i][1], is_active: true } }); dokterRows.push(row); }
    for (let i = 0; i < dokterRows.length; i += 1) await JadwalPraktik.findOrCreate({ where: { dokter_id: dokterRows[i].id, hari: hari[i] }, defaults: { dokter_id: dokterRows[i].id, hari: hari[i], jam_mulai: '08:00:00', jam_selesai: '14:00:00', ruang: 'Ruang Pemeriksaan', is_active: true } });
    for (let i = 0; i < 5; i += 1) await StrukturOrganisasi.findOrCreate({ where: { nama: `Tim PSC ${i + 1}` }, defaults: { nama: `Tim PSC ${i + 1}`, jabatan: ['Kepala UPTD', 'Koordinator Medis', 'Koordinator Ambulans', 'Petugas Call Center', 'Administrasi'][i], urutan: i, is_active: true } });
    for (let i = 0; i < 5; i += 1) await AlurBerobat.findOrCreate({ where: { judul: `Langkah ${i + 1} - Informasi Klinik` }, defaults: { judul: `Langkah ${i + 1} - Informasi Klinik`, deskripsi: 'Ikuti petunjuk petugas dan siapkan informasi pasien sebelum mendapatkan layanan.', urutan: i, is_active: true } });
    for (let i = 0; i < 5; i += 1) await Penjaminan.findOrCreate({ where: { nama: ['BPJS Kesehatan', 'Umum', 'Asuransi Kesehatan', 'Jaminan Pemerintah', 'Mitra Perusahaan'][i] }, defaults: { nama: ['BPJS Kesehatan', 'Umum', 'Asuransi Kesehatan', 'Jaminan Pemerintah', 'Mitra Perusahaan'][i], deskripsi: 'Informasi penjaminan dikonfirmasi kepada petugas Klinik.', urutan: i, is_active: true } });
    for (let i = 0; i < 5; i += 1) await GaleriFasilitas.findOrCreate({ where: { judul: `Fasilitas Klinik ${i + 1}` }, defaults: { judul: `Fasilitas Klinik ${i + 1}`, deskripsi: 'Fasilitas pendukung pelayanan kesehatan Klinik PSC 119.', foto: '/image/intro.webp', urutan: i, is_active: true } });
    const galeriPSC = [
        ['Tim PSC 119 Siaga', 'Tim PSC 119 siap memberikan respons cepat untuk warga Kota Depok.'],
        ['Layanan Ambulans PSC', 'Dokumentasi armada dan layanan kegawatdaruratan PSC 119.'],
        ['Edukasi Kesehatan Warga', 'Kegiatan edukasi pertolongan pertama dan keselamatan kesehatan.'],
        ['Koordinasi Tim Medis', 'Kolaborasi petugas dalam memastikan pelayanan berjalan terpadu.'],
        ['Respons Darurat Kota Depok', 'PSC 119 hadir mendampingi masyarakat dalam kondisi darurat.'],
    ];
    for (let i = 0; i < galeriPSC.length; i += 1) await GaleriPSC.findOrCreate({ where: { judul: galeriPSC[i][0] }, defaults: { judul: galeriPSC[i][0], deskripsi: galeriPSC[i][1], foto: '/image/intro.webp', urutan: i, is_active: true } });

    console.log('Demo CMS content is ready. Existing records were preserved.');
}

seed().catch((error) => { console.error('Unable to seed demo content:', error); process.exitCode = 1; }).finally(() => sequelize.close());
