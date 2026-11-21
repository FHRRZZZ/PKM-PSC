const express = require("express");
const klinikController = require("../controllers/klinikController");
const { protects } = require("../middleware/protect");
const { imageUpload } = require("../middleware/upload");

const router = express.Router();

// Profil klinik (single row)
router.get("/profil", klinikController.getKlinikProfile);
router.put(
  "/profil",
  protects,
  imageUpload.single("foto"),
  klinikController.updateKlinikProfile,
);

// Jam operasional
router.get("/jam-operasional", klinikController.getAllJamOperasional);
router.post(
  "/jam-operasional",
  protects,
  klinikController.createJamOperasional,
);
router.put(
  "/jam-operasional/:id",
  protects,
  klinikController.updateJamOperasional,
);
router.delete(
  "/jam-operasional/:id",
  protects,
  klinikController.deleteJamOperasional,
);

// Dokter & jadwal praktik
router.get("/dokter", klinikController.getAllDokter);
router.get("/dokter/:id", klinikController.getDokterById);
router.post(
  "/dokter",
  protects,
  imageUpload.single("foto"),
  klinikController.createDokter,
);
router.put(
  "/dokter/:id",
  protects,
  imageUpload.single("foto"),
  klinikController.updateDokter,
);
router.delete("/dokter/:id", protects, klinikController.deleteDokter);

// Jadwal praktik
router.get("/jadwal-praktik", klinikController.getAllJadwal);
router.post("/jadwal-praktik", protects, klinikController.createJadwal);
router.put("/jadwal-praktik/:id", protects, klinikController.updateJadwal);
router.delete("/jadwal-praktik/:id", protects, klinikController.deleteJadwal);

// Struktur organisasi
router.get("/struktur-organisasi", klinikController.getAllStruktur);
router.post(
  "/struktur-organisasi",
  protects,
  imageUpload.single("foto"),
  klinikController.createStruktur,
);
router.put(
  "/struktur-organisasi/:id",
  protects,
  imageUpload.single("foto"),
  klinikController.updateStruktur,
);
router.delete(
  "/struktur-organisasi/:id",
  protects,
  klinikController.deleteStruktur,
);

// Alur & syarat berobat
router.get("/alur-berobat", klinikController.getAllAlur);
router.post("/alur-berobat", protects, klinikController.createAlur);
router.put("/alur-berobat/:id", protects, klinikController.updateAlur);
router.delete("/alur-berobat/:id", protects, klinikController.deleteAlur);

// Biaya & penjaminan
router.get("/penjaminan", klinikController.getAllPenjaminan);
router.post("/penjaminan", protects, klinikController.createPenjaminan);
router.put("/penjaminan/:id", protects, klinikController.updatePenjaminan);
router.delete("/penjaminan/:id", protects, klinikController.deletePenjaminan);

// Galeri fasilitas
router.get("/galeri", klinikController.getAllGaleri);
router.post(
  "/galeri",
  protects,
  imageUpload.single("foto"),
  klinikController.createGaleri,
);
router.put(
  "/galeri/:id",
  protects,
  imageUpload.single("foto"),
  klinikController.updateGaleri,
);
router.delete("/galeri/:id", protects, klinikController.deleteGaleri);

module.exports = router;
