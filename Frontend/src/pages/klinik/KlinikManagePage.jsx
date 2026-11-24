import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import { getSelectedKlinikId, klinikApi, setSelectedKlinikId } from '../../api/klinik';
import { getLayananAdminById } from '../../api/layanan';
import { useEffect, useState } from 'react';

const modules = [
  { title: 'Profil Layanan Klinik', desc: 'Identitas, deskripsi, kontak, alamat, foto, dan informasi layanan.', path: '/admin/klinik/profil', icon: '01' },
  { title: 'Jam Operasional Layanan', desc: 'Atur jadwal buka dan tutup layanan setiap hari.', path: '/admin/klinik/jam-operasional', icon: '02' },
  { title: 'Dokter & Jadwal Layanan', desc: 'Kelola dokter yang bertugas dan jadwal praktik layanan.', path: '/admin/klinik/dokter', icon: '03' },
  { title: 'Galeri Fasilitas Layanan', desc: 'Tambahkan foto dan informasi fasilitas layanan.', path: '/admin/klinik/galeri', icon: '04' },
];

export default function KlinikManagePage() {
  const [params] = useSearchParams();
  const clinicId = params.get('klinik_id') || getSelectedKlinikId();
  const serviceId = params.get('layanan_id');
  const [clinic, setClinic] = useState(null);
  const [service, setService] = useState(null);

  useEffect(() => {
    setSelectedKlinikId(clinicId);
    klinikApi.list().then((items) => setClinic(items.find((item) => String(item.id) === String(clinicId)))).catch(() => {});
    if (serviceId) getLayananAdminById(serviceId).then(setService).catch(() => {});
  }, [clinicId, serviceId]);

  return <DashboardLayout>
    <div className="min-h-screen min-w-0 bg-slate-50">
      <PageHeader title="Lengkapi Data Layanan Klinik" desc="Pilih bagian informasi yang ingin dilengkapi untuk layanan klinik ini." />
      <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wider text-red-700">Layanan klinik yang dipilih</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{service?.nama || 'Memuat layanan klinik...'}</h2>
        <p className="mt-1 text-sm text-slate-600">{service?.deskripsi || 'Informasi layanan klinik sedang dimuat.'}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((item) => <Link key={item.path} to={`${item.path}?klinik_id=${clinicId}&layanan_id=${serviceId || ''}`} onClick={() => setSelectedKlinikId(clinicId)} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-sm font-bold text-red-700 group-hover:bg-red-700 group-hover:text-white">{item.icon}</span>
          <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-red-700">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
          <p className="mt-5 text-sm font-bold text-red-700">Isi data →</p>
        </Link>)}
      </div>
    </div>
  </DashboardLayout>;
}
