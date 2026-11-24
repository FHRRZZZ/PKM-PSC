const express = require("express");
const klinikController = require("../controllers/klinikController");
const { protects, requireRole } = require("../middleware/protect");
const { imageUpload } = require("../middleware/upload");

const router = express.Router();
const requireSuperadmin = requireRole('admin', 'superadmin');

// Katalog klinik
router.get("/daftar", klinikController.getKlinikProfiles);
router.post("/daftar", protects, requireSuperadmin, klinikController.createKlinikProfile);
router.put("/daftar/:id", protects, requireSuperadmin, klinikController.updateKlinikProfileById);
router.delete("/daftar/:id", protects, requireSuperadmin, klinikController.deleteKlinikProfile);

// Profil klinik terpilih/utama (kompatibilitas API lama)
router.get("/profil", klinikController.getKlinikProfile);
router.put(
  "/profil",
  protects,
  requireSuperadmin,
  imageUpload.single("foto"),
  klinikController.updateKlinikProfile,
);

// Jam operasional
router.get("/jam-operasional", klinikController.getAllJamOperasional);
router.post(
  "/jam-operasional",
  protects,
  requireSuperadmin,
  klinikController.createJamOperasional,
);
router.put(
  "/jam-operasional/:id",
  protects,
  requireSuperadmin,
  klinikController.updateJamOperasional,
);
router.delete(
  "/jam-operasional/:id",
  protects,
  requireSuperadmin,
  klinikController.deleteJamOperasional,
);

// Dokter & jadwal praktik
router.get("/dokter", klinikController.getAllDokter);
router.get("/dokter/:id", klinikController.getDokterById);
router.post(
  "/dokter",
  protects,
  requireSuperadmin,
  imageUpload.single("foto"),
  klinikController.createDokter,
);
router.put(
  "/dokter/:id",
  protects,
  requireSuperadmin,
  imageUpload.single("foto"),
  klinikController.updateDokter,
);
router.delete("/dokter/:id", protects, requireSuperadmin, klinikController.deleteDokter);

// Jadwal praktik
router.get("/jadwal-praktik", klinikController.getAllJadwal);
router.post("/jadwal-praktik", protects, requireSuperadmin, klinikController.createJadwal);
router.put("/jadwal-praktik/:id", protects, requireSuperadmin, klinikController.updateJadwal);
router.delete("/jadwal-praktik/:id", protects, requireSuperadmin, klinikController.deleteJadwal);

// Struktur organisasi
router.get("/struktur-organisasi", klinikController.getAllStruktur);
router.post(
  "/struktur-organisasi",
  protects,
  requireSuperadmin,
  imageUpload.single("foto"),
  klinikController.createStruktur,
);
router.put(
  "/struktur-organisasi/:id",
  protects,
  requireSuperadmin,
  imageUpload.single("foto"),
  klinikController.updateStruktur,
);
router.delete(
  "/struktur-organisasi/:id",
  protects,
  requireSuperadmin,
  klinikController.deleteStruktur,
);

// Alur & syarat berobat
router.get("/alur-berobat", klinikController.getAllAlur);
router.post("/alur-berobat", protects, requireSuperadmin, klinikController.createAlur);
router.put("/alur-berobat/:id", protects, requireSuperadmin, klinikController.updateAlur);
router.delete("/alur-berobat/:id", protects, requireSuperadmin, klinikController.deleteAlur);

// Biaya & penjaminan
router.get("/penjaminan", klinikController.getAllPenjaminan);
router.post("/penjaminan", protects, requireSuperadmin, klinikController.createPenjaminan);
router.put("/penjaminan/:id", protects, requireSuperadmin, klinikController.updatePenjaminan);
router.delete("/penjaminan/:id", protects, requireSuperadmin, klinikController.deletePenjaminan);

// Galeri fasilitas
router.get("/galeri", klinikController.getAllGaleri);
router.post(
  "/galeri",
  protects,
  requireSuperadmin,
  imageUpload.single("foto"),
  klinikController.createGaleri,
);
router.put(
  "/galeri/:id",
  protects,
  requireSuperadmin,
  imageUpload.single("foto"),
  klinikController.updateGaleri,
);
router.delete("/galeri/:id", protects, requireSuperadmin, klinikController.deleteGaleri);

module.exports = router;
