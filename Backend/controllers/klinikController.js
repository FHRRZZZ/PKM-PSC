const { sequelize } = require("../config/db");
const {
    KlinikProfile,
    JamOperasional,
    Dokter,
    JadwalPraktik,
    StrukturOrganisasi,
    AlurBerobat,
    Penjaminan,
    GaleriFasilitas
} = require("../models/klinikModels");
const { handleError, parseId } = require("../utils/api");

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function isNonNegativeInteger(value) {
  return (
    value !== null &&
    value !== "" &&
    Number.isSafeInteger(Number(value)) &&
    Number(value) >= 0
  );
}

function validTime(value) {
  return (
    typeof value === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)
  );
}

function toBool(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }
  return value === true || value === "true";
}

function isValidBool(value) {
  return typeof value === "boolean" || value === "true" || value === "false";
}

// ==================== PROFIL KLINIK ====================

async function getOrCreateProfile() {
  let profile = await KlinikProfile.findByPk(1);
  if (!profile) {
    profile = await KlinikProfile.create({ id: 1, nama: "Klinik" });
  }
  return profile;
}

exports.getKlinikProfile = async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    return res.status(200).json(profile);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateKlinikProfile = async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    const body = req.body || {};
    const updates = {};

    if (req.file) {
      updates.foto = `/uploads/${req.file.filename}`;
    }
    const stringFields = [
      "nama",
      "deskripsi",
      "melayani",
      "alamat",
      "telepon",
      "whatsapp",
      "email",
      "maps_embed",
      "akreditasi",
      "akreditasi_tahun",
      "izin_operasional_nomor",
      "izin_operasional_penerbit",
      "izin_operasional_file",
    ];
    for (const field of stringFields) {
      if (body[field] !== undefined) {
        if (body[field] !== null && typeof body[field] !== "string") {
          return res
            .status(400)
            .json({ message: `${field} must be a string or null` });
        }
        if (field === "nama" && !body[field].trim()) {
          return res.status(400).json({ message: "nama cannot be empty" });
        }
        updates[field] =
          body[field] === null || body[field] === ""
            ? null
            : body[field].trim();
      }
    }

    await profile.update(updates);
    return res.status(200).json(profile);
  } catch (error) {
    return handleError(res, error);
  }
};

// ==================== JAM OPERASIONAL ====================

exports.getAllJamOperasional = async (req, res) => {
  try {
    const jam = await JamOperasional.findAll({
      where: req.user ? {} : { is_tutup: false },
      order: [["id", "ASC"]],
    });
    return res.status(200).json(jam);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createJamOperasional = async (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body.hari !== "string" || !HARI.includes(body.hari)) {
      return res
        .status(400)
        .json({ message: `hari must be one of: ${HARI.join(", ")}` });
    }
    const isTutup = toBool(body.is_tutup, false);
    if (!isTutup && (!validTime(body.jam_buka) || !validTime(body.jam_tutup))) {
      return res
        .status(400)
        .json({ message: "jam_buka and jam_tutup are required (HH:MM)" });
    }
    const jam = await JamOperasional.create({
      hari: body.hari,
      jam_buka: isTutup ? null : body.jam_buka,
      jam_tutup: isTutup ? null : body.jam_tutup,
      is_tutup: isTutup,
      keterangan: body.keterangan || null,
    });
    return res.status(201).json(jam);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateJamOperasional = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const jam = await JamOperasional.findByPk(id);
    if (!jam) {
      return res.status(404).json({ message: "Jam operasional not found" });
    }
    const body = req.body || {};
    const updates = {};

    if (body.hari !== undefined) {
      if (typeof body.hari !== "string" || !HARI.includes(body.hari)) {
        return res
          .status(400)
          .json({ message: `hari must be one of: ${HARI.join(", ")}` });
      }
      updates.hari = body.hari;
    }
    if (body.is_tutup !== undefined) {
      if (!isValidBool(body.is_tutup)) {
        return res.status(400).json({ message: "is_tutup must be a boolean" });
      }
      updates.is_tutup = toBool(body.is_tutup, jam.is_tutup);
      if (updates.is_tutup) {
        updates.jam_buka = null;
        updates.jam_tutup = null;
      }
    }
    for (const field of ["jam_buka", "jam_tutup"]) {
      if (body[field] !== undefined) {
        if (!validTime(body[field])) {
          return res
            .status(400)
            .json({ message: `${field} must be in HH:MM format` });
        }
        updates[field] = body[field];
      }
    }
    if (body.keterangan !== undefined) {
      if (body.keterangan !== null && typeof body.keterangan !== "string") {
        return res.status(400).json({ message: "keterangan must be a string" });
      }
      updates.keterangan = body.keterangan || null;
    }

    await jam.update(updates);
    return res.status(200).json(jam);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteJamOperasional = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const jam = await JamOperasional.findByPk(id);
    if (!jam) {
      return res.status(404).json({ message: "Jam operasional not found" });
    }
    await jam.destroy();
    return res
      .status(200)
      .json({ message: "Jam operasional deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

// ==================== DOKTER ====================

exports.getAllDokter = async (req, res) => {
  try {
    const dokter = await Dokter.findAll({
      where: req.user ? {} : { is_active: true },
      include: [{ model: JadwalPraktik, as: "jadwal" }],
      order: [["nama", "ASC"]],
    });
    return res.status(200).json(dokter);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.getDokterById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const dokter = await Dokter.findOne({
      where: { id, ...(req.user ? {} : { is_active: true }) },
      include: [{ model: JadwalPraktik, as: "jadwal" }],
    });
    if (!dokter) {
      return res.status(404).json({ message: "Dokter not found" });
    }
    return res.status(200).json(dokter);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createDokter = async (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body.nama !== "string" || !body.nama.trim()) {
      return res.status(400).json({ message: "nama is required" });
    }
    const dokter = await Dokter.create({
      nama: body.nama.trim(),
      spesialisasi: body.spesialisasi || null,
      no_str: body.no_str || null,
      foto: req.file ? `/uploads/${req.file.filename}` : body.foto || null,
      is_active: toBool(body.is_active, true),
    });
    return res.status(201).json(dokter);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateDokter = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const dokter = await Dokter.findByPk(id);
    if (!dokter) {
      return res.status(404).json({ message: "Dokter not found" });
    }
    const body = req.body || {};
    const updates = {};

    if (req.file) {
      updates.foto = `/uploads/${req.file.filename}`;
    }
    for (const field of ["nama", "spesialisasi", "no_str"]) {
      if (body[field] !== undefined) {
        if (body[field] !== null && typeof body[field] !== "string") {
          return res
            .status(400)
            .json({ message: `${field} must be a string or null` });
        }
        if (field === "nama" && !body[field].trim()) {
          return res.status(400).json({ message: "nama cannot be empty" });
        }
        updates[field] = body[field] === null ? null : body[field].trim();
      }
    }
    if (body.foto !== undefined && !req.file) {
      if (body.foto !== null && typeof body.foto !== "string") {
        return res
          .status(400)
          .json({ message: "foto must be a string or null" });
      }
      updates.foto = body.foto || null;
    }
    if (body.is_active !== undefined) {
      if (!isValidBool(body.is_active)) {
        return res.status(400).json({ message: "is_active must be a boolean" });
      }
      updates.is_active = toBool(body.is_active, dokter.is_active);
    }

    await dokter.update(updates);
    return res.status(200).json(dokter);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteDokter = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const dokter = await Dokter.findByPk(id);
    if (!dokter) {
      return res.status(404).json({ message: "Dokter not found" });
    }
    await dokter.destroy();
    return res.status(200).json({ message: "Dokter deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

// ==================== JADWAL PRAKTIK ====================

exports.getAllJadwal = async (req, res) => {
  try {
    const jadwal = await JadwalPraktik.findAll({
      include: [
        {
          model: Dokter,
          as: "dokter",
          attributes: ["id", "nama", "spesialisasi"],
        },
      ],
      order: [["id", "ASC"]],
    });
    return res.status(200).json(jadwal);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createJadwal = async (req, res) => {
  try {
    const body = req.body || {};
    const dokterId = parseId(String(body.dokter_id ?? ""));
    if (!dokterId) {
      return res.status(400).json({ message: "dokter_id is invalid" });
    }
    const dokter = await Dokter.findByPk(dokterId);
    if (!dokter) {
      return res.status(404).json({ message: "Dokter not found" });
    }
    if (typeof body.hari !== "string" || !body.hari.trim()) {
      return res.status(400).json({ message: "hari is required" });
    }
    if (!validTime(body.jam_mulai) || !validTime(body.jam_selesai)) {
      return res
        .status(400)
        .json({ message: "jam_mulai and jam_selesai are required (HH:MM)" });
    }
    const jadwal = await JadwalPraktik.create({
      dokter_id: dokterId,
      hari: body.hari.trim(),
      jam_mulai: body.jam_mulai,
      jam_selesai: body.jam_selesai,
      ruang: body.ruang || null,
      is_active: toBool(body.is_active, true),
    });
    return res.status(201).json(jadwal);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateJadwal = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const jadwal = await JadwalPraktik.findByPk(id);
    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal praktik not found" });
    }
    const body = req.body || {};
    const updates = {};

    if (body.dokter_id !== undefined) {
      const dokterId = parseId(String(body.dokter_id));
      if (!dokterId) {
        return res.status(400).json({ message: "dokter_id is invalid" });
      }
      const dokter = await Dokter.findByPk(dokterId);
      if (!dokter) {
        return res.status(404).json({ message: "Dokter not found" });
      }
      updates.dokter_id = dokterId;
    }
    if (body.hari !== undefined) {
      if (typeof body.hari !== "string" || !body.hari.trim()) {
        return res.status(400).json({ message: "hari cannot be empty" });
      }
      updates.hari = body.hari.trim();
    }
    for (const field of ["jam_mulai", "jam_selesai"]) {
      if (body[field] !== undefined) {
        if (!validTime(body[field])) {
          return res
            .status(400)
            .json({ message: `${field} must be in HH:MM format` });
        }
        updates[field] = body[field];
      }
    }
    if (body.ruang !== undefined) {
      if (body.ruang !== null && typeof body.ruang !== "string") {
        return res
          .status(400)
          .json({ message: "ruang must be a string or null" });
      }
      updates.ruang = body.ruang || null;
    }
    if (body.is_active !== undefined) {
      if (!isValidBool(body.is_active)) {
        return res.status(400).json({ message: "is_active must be a boolean" });
      }
      updates.is_active = toBool(body.is_active, jadwal.is_active);
    }

    await jadwal.update(updates);
    return res.status(200).json(jadwal);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteJadwal = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const jadwal = await JadwalPraktik.findByPk(id);
    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal praktik not found" });
    }
    await jadwal.destroy();
    return res
      .status(200)
      .json({ message: "Jadwal praktik deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

// ==================== STRUKTUR ORGANISASI ====================

exports.getAllStruktur = async (req, res) => {
  try {
    const struktur = await StrukturOrganisasi.findAll({
      where: req.user ? {} : { is_active: true },
      order: [
        ["urutan", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.status(200).json(struktur);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createStruktur = async (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body.nama !== "string" || !body.nama.trim()) {
      return res.status(400).json({ message: "nama is required" });
    }
    if (typeof body.jabatan !== "string" || !body.jabatan.trim()) {
      return res.status(400).json({ message: "jabatan is required" });
    }
    if (body.parent_id !== undefined && body.parent_id !== null) {
      const parentId = parseId(String(body.parent_id));
      if (!parentId) {
        return res.status(400).json({ message: "parent_id is invalid" });
      }
      const parent = await StrukturOrganisasi.findByPk(parentId);
      if (!parent) {
        return res.status(404).json({ message: "Parent not found" });
      }
    }
    if (body.urutan !== undefined && !isNonNegativeInteger(body.urutan)) {
      return res
        .status(400)
        .json({ message: "urutan must be a non-negative integer" });
    }
    const struktur = await StrukturOrganisasi.create({
      nama: body.nama.trim(),
      jabatan: body.jabatan.trim(),
      foto: req.file ? `/uploads/${req.file.filename}` : body.foto || null,
      parent_id: body.parent_id ? Number(body.parent_id) : null,
      urutan: body.urutan === undefined ? 0 : Number(body.urutan),
      is_active: toBool(body.is_active, true),
    });
    return res.status(201).json(struktur);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateStruktur = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const struktur = await StrukturOrganisasi.findByPk(id);
    if (!struktur) {
      return res.status(404).json({ message: "Struktur organisasi not found" });
    }
    const body = req.body || {};
    const updates = {};

    if (req.file) {
      updates.foto = `/uploads/${req.file.filename}`;
    }
    for (const field of ["nama", "jabatan"]) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string" || !body[field].trim()) {
          return res.status(400).json({ message: `${field} cannot be empty` });
        }
        updates[field] = body[field].trim();
      }
    }
    if (body.parent_id !== undefined) {
      if (body.parent_id === null) {
        updates.parent_id = null;
      } else {
        const parentId = parseId(String(body.parent_id));
        if (!parentId) {
          return res.status(400).json({ message: "parent_id is invalid" });
        }
        if (parentId === id) {
          return res
            .status(400)
            .json({ message: "parent_id cannot be itself" });
        }
        const parent = await StrukturOrganisasi.findByPk(parentId);
        if (!parent) {
          return res.status(404).json({ message: "Parent not found" });
        }
        updates.parent_id = parentId;
      }
    }
    if (body.foto !== undefined && !req.file) {
      if (body.foto !== null && typeof body.foto !== "string") {
        return res
          .status(400)
          .json({ message: "foto must be a string or null" });
      }
      updates.foto = body.foto || null;
    }
    if (body.urutan !== undefined) {
      if (!isNonNegativeInteger(body.urutan)) {
        return res
          .status(400)
          .json({ message: "urutan must be a non-negative integer" });
      }
      updates.urutan = Number(body.urutan);
    }
    if (body.is_active !== undefined) {
      if (!isValidBool(body.is_active)) {
        return res.status(400).json({ message: "is_active must be a boolean" });
      }
      updates.is_active = toBool(body.is_active, struktur.is_active);
    }

    await struktur.update(updates);
    return res.status(200).json(struktur);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteStruktur = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const struktur = await StrukturOrganisasi.findByPk(id);
    if (!struktur) {
      return res.status(404).json({ message: "Struktur organisasi not found" });
    }
    const anak = await StrukturOrganisasi.findOne({ where: { parent_id: id } });
    if (anak) {
      return res
        .status(409)
        .json({ message: "Struktur ini masih memiliki bawahan" });
    }
    await struktur.destroy();
    return res
      .status(200)
      .json({ message: "Struktur organisasi deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

// ==================== ALUR BEROBAT ====================

exports.getAllAlur = async (req, res) => {
  try {
    const alur = await AlurBerobat.findAll({
      where: req.user ? {} : { is_active: true },
      order: [
        ["urutan", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.status(200).json(alur);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createAlur = async (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body.judul !== "string" || !body.judul.trim()) {
      return res.status(400).json({ message: "judul is required" });
    }
    if (typeof body.deskripsi !== "string" || !body.deskripsi.trim()) {
      return res.status(400).json({ message: "deskripsi is required" });
    }
    if (body.urutan !== undefined && !isNonNegativeInteger(body.urutan)) {
      return res
        .status(400)
        .json({ message: "urutan must be a non-negative integer" });
    }
    const alur = await AlurBerobat.create({
      judul: body.judul.trim(),
      deskripsi: body.deskripsi.trim(),
      urutan: body.urutan === undefined ? 0 : Number(body.urutan),
      is_active: toBool(body.is_active, true),
    });
    return res.status(201).json(alur);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateAlur = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const alur = await AlurBerobat.findByPk(id);
    if (!alur) {
      return res.status(404).json({ message: "Alur berobat not found" });
    }
    const body = req.body || {};
    const updates = {};

    for (const field of ["judul", "deskripsi"]) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string" || !body[field].trim()) {
          return res.status(400).json({ message: `${field} cannot be empty` });
        }
        updates[field] = body[field].trim();
      }
    }
    if (body.urutan !== undefined) {
      if (!isNonNegativeInteger(body.urutan)) {
        return res
          .status(400)
          .json({ message: "urutan must be a non-negative integer" });
      }
      updates.urutan = Number(body.urutan);
    }
    if (body.is_active !== undefined) {
      if (!isValidBool(body.is_active)) {
        return res.status(400).json({ message: "is_active must be a boolean" });
      }
      updates.is_active = toBool(body.is_active, alur.is_active);
    }

    await alur.update(updates);
    return res.status(200).json(alur);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteAlur = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const alur = await AlurBerobat.findByPk(id);
    if (!alur) {
      return res.status(404).json({ message: "Alur berobat not found" });
    }
    await alur.destroy();
    return res
      .status(200)
      .json({ message: "Alur berobat deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

// ==================== PENJAMINAN ====================

exports.getAllPenjaminan = async (req, res) => {
  try {
    const penjaminan = await Penjaminan.findAll({
      where: req.user ? {} : { is_active: true },
      order: [
        ["urutan", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.status(200).json(penjaminan);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createPenjaminan = async (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body.nama !== "string" || !body.nama.trim()) {
      return res.status(400).json({ message: "nama is required" });
    }
    if (
      body.deskripsi !== undefined &&
      body.deskripsi !== null &&
      typeof body.deskripsi !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "deskripsi must be a string or null" });
    }
    if (body.urutan !== undefined && !isNonNegativeInteger(body.urutan)) {
      return res
        .status(400)
        .json({ message: "urutan must be a non-negative integer" });
    }
    const penjaminan = await Penjaminan.create({
      nama: body.nama.trim(),
      deskripsi: body.deskripsi || null,
      urutan: body.urutan === undefined ? 0 : Number(body.urutan),
      is_active: toBool(body.is_active, true),
    });
    return res.status(201).json(penjaminan);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updatePenjaminan = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const penjaminan = await Penjaminan.findByPk(id);
    if (!penjaminan) {
      return res.status(404).json({ message: "Penjaminan not found" });
    }
    const body = req.body || {};
    const updates = {};

    if (body.nama !== undefined) {
      if (typeof body.nama !== "string" || !body.nama.trim()) {
        return res.status(400).json({ message: "nama cannot be empty" });
      }
      updates.nama = body.nama.trim();
    }
    if (body.deskripsi !== undefined) {
      if (body.deskripsi !== null && typeof body.deskripsi !== "string") {
        return res
          .status(400)
          .json({ message: "deskripsi must be a string or null" });
      }
      updates.deskripsi = body.deskripsi || null;
    }
    if (body.urutan !== undefined) {
      if (!isNonNegativeInteger(body.urutan)) {
        return res
          .status(400)
          .json({ message: "urutan must be a non-negative integer" });
      }
      updates.urutan = Number(body.urutan);
    }
    if (body.is_active !== undefined) {
      if (!isValidBool(body.is_active)) {
        return res.status(400).json({ message: "is_active must be a boolean" });
      }
      updates.is_active = toBool(body.is_active, penjaminan.is_active);
    }

    await penjaminan.update(updates);
    return res.status(200).json(penjaminan);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deletePenjaminan = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const penjaminan = await Penjaminan.findByPk(id);
    if (!penjaminan) {
      return res.status(404).json({ message: "Penjaminan not found" });
    }
    await penjaminan.destroy();
    return res.status(200).json({ message: "Penjaminan deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};

// ==================== GALERI FASILITAS ====================

exports.getAllGaleri = async (req, res) => {
  try {
    const galeri = await GaleriFasilitas.findAll({
      where: req.user ? {} : { is_active: true },
      order: [
        ["urutan", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.status(200).json(galeri);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.createGaleri = async (req, res) => {
  try {
    const body = req.body || {};
    if (typeof body.judul !== "string" || !body.judul.trim()) {
      return res.status(400).json({ message: "judul is required" });
    }
    if (!req.file && !body.foto) {
      return res
        .status(400)
        .json({ message: 'foto is required (upload via field "foto")' });
    }
    if (
      body.deskripsi !== undefined &&
      body.deskripsi !== null &&
      typeof body.deskripsi !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "deskripsi must be a string or null" });
    }
    if (body.urutan !== undefined && !isNonNegativeInteger(body.urutan)) {
      return res
        .status(400)
        .json({ message: "urutan must be a non-negative integer" });
    }
    const galeri = await GaleriFasilitas.create({
      judul: body.judul.trim(),
      deskripsi: body.deskripsi || null,
      foto: req.file ? `/uploads/${req.file.filename}` : body.foto,
      urutan: body.urutan === undefined ? 0 : Number(body.urutan),
      is_active: toBool(body.is_active, true),
    });
    return res.status(201).json(galeri);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.updateGaleri = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const galeri = await GaleriFasilitas.findByPk(id);
    if (!galeri) {
      return res.status(404).json({ message: "Galeri fasilitas not found" });
    }
    const body = req.body || {};
    const updates = {};

    if (req.file) {
      updates.foto = `/uploads/${req.file.filename}`;
    }
    if (body.judul !== undefined) {
      if (typeof body.judul !== "string" || !body.judul.trim()) {
        return res.status(400).json({ message: "judul cannot be empty" });
      }
      updates.judul = body.judul.trim();
    }
    if (body.deskripsi !== undefined) {
      if (body.deskripsi !== null && typeof body.deskripsi !== "string") {
        return res
          .status(400)
          .json({ message: "deskripsi must be a string or null" });
      }
      updates.deskripsi = body.deskripsi || null;
    }
    if (body.urutan !== undefined) {
      if (!isNonNegativeInteger(body.urutan)) {
        return res
          .status(400)
          .json({ message: "urutan must be a non-negative integer" });
      }
      updates.urutan = Number(body.urutan);
    }
    if (body.is_active !== undefined) {
      if (!isValidBool(body.is_active)) {
        return res.status(400).json({ message: "is_active must be a boolean" });
      }
      updates.is_active = toBool(body.is_active, galeri.is_active);
    }

    await galeri.update(updates);
    return res.status(200).json(galeri);
  } catch (error) {
    return handleError(res, error);
  }
};

exports.deleteGaleri = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "id is invalid" });
    }
    const galeri = await GaleriFasilitas.findByPk(id);
    if (!galeri) {
      return res.status(404).json({ message: "Galeri fasilitas not found" });
    }
    await galeri.destroy();
    return res
      .status(200)
      .json({ message: "Galeri fasilitas deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
};
