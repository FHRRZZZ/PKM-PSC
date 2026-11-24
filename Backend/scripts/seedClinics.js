require('dotenv').config();
const { sequelize } = require('../config/db');
const { KlinikProfile } = require('../models/klinikModels');

const clinics = [
  {
    slug: 'klinik-psc-119',
    nama: 'Klinik PSC 119 Kota Depok',
    alamat: 'Kantor Operasional PSC 119 Kota Depok',
    telepon: '119',
    deskripsi: 'Pusat layanan keselamatan terpadu dan informasi kesehatan darurat Kota Depok.',
  },
  {
    slug: 'klinik-psc-beji',
    nama: 'Klinik PSC Beji',
    alamat: 'Kecamatan Beji, Kota Depok',
    telepon: '119',
    deskripsi: 'Layanan informasi dan pertolongan awal untuk warga wilayah Beji.',
  },
  {
    slug: 'klinik-psc-cimanggis',
    nama: 'Klinik PSC Cimanggis',
    alamat: 'Kecamatan Cimanggis, Kota Depok',
    telepon: '119',
    deskripsi: 'Layanan kesehatan darurat dan rujukan untuk wilayah Cimanggis.',
  },
  {
    slug: 'klinik-psc-sawangan',
    nama: 'Klinik PSC Sawangan',
    alamat: 'Kecamatan Sawangan, Kota Depok',
    telepon: '119',
    deskripsi: 'Informasi layanan, jadwal, dan akses bantuan kesehatan untuk warga Sawangan.',
  },
  {
    slug: 'klinik-psc-tapos',
    nama: 'Klinik PSC Tapos',
    alamat: 'Kecamatan Tapos, Kota Depok',
    telepon: '119',
    deskripsi: 'Pusat informasi dan koordinasi layanan medis darurat wilayah Tapos.',
  },
];

async function seed() {
  await sequelize.authenticate();
  for (const clinic of clinics) {
    const [record] = await KlinikProfile.findOrCreate({
      where: { slug: clinic.slug },
      defaults: { ...clinic, is_active: true },
    });
    if (record.id === 1) await record.update({ ...clinic, is_active: true });
  }
  const legacyDuplicate = await KlinikProfile.findOne({ where: { slug: 'klinik-psc-119-kota-depok' } });
  if (legacyDuplicate && legacyDuplicate.id !== 1) {
    await legacyDuplicate.update({
      slug: 'klinik-psc-margonda',
      nama: 'Klinik PSC Margonda',
      alamat: 'Kecamatan Beji, Kota Depok',
      deskripsi: 'Layanan informasi kesehatan darurat untuk kawasan Margonda.',
    });
  }
  console.log(`Seeded ${clinics.length} clinic records.`);
  await sequelize.close();
}

seed().catch((error) => { console.error(error); process.exitCode = 1; });
