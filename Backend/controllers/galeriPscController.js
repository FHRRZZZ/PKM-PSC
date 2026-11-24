const GaleriPSC = require('../models/GaleriPSC');

const bool = (value, fallback) => value === undefined ? fallback : value === true || value === 'true';
const integer = (value) => Number.isSafeInteger(Number(value)) && Number(value) >= 0;

exports.list = async (req, res) => {
  const rows = await GaleriPSC.findAll({ where: req.user ? {} : { is_active: true }, order: [['urutan', 'ASC'], ['id', 'ASC']] });
  res.json(rows);
};
exports.create = async (req, res) => {
  const body = req.body || {};
  if (!body.judul?.trim() || (!req.file && !body.foto)) return res.status(400).json({ message: 'Judul dan foto wajib diisi.' });
  const row = await GaleriPSC.create({ judul: body.judul.trim(), deskripsi: body.deskripsi || null, foto: req.file ? `/uploads/${req.file.filename}` : body.foto, urutan: integer(body.urutan) ? Number(body.urutan) : 0, is_active: bool(body.is_active, true) });
  res.status(201).json(row);
};
exports.update = async (req, res) => {
  const row = await GaleriPSC.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Foto galeri PSC tidak ditemukan.' });
  const body = req.body || {};
  const updates = {};
  if (body.judul !== undefined) updates.judul = body.judul.trim();
  if (body.deskripsi !== undefined) updates.deskripsi = body.deskripsi || null;
  if (body.urutan !== undefined && integer(body.urutan)) updates.urutan = Number(body.urutan);
  if (body.is_active !== undefined) updates.is_active = bool(body.is_active, row.is_active);
  if (req.file) updates.foto = `/uploads/${req.file.filename}`;
  else if (body.foto !== undefined) updates.foto = body.foto;
  await row.update(updates);
  res.json(row);
};
exports.remove = async (req, res) => {
  const row = await GaleriPSC.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: 'Foto galeri PSC tidak ditemukan.' });
  await row.destroy();
  res.json({ message: 'Foto galeri PSC dihapus.' });
};
