import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus } from '../../components/Icons';
import { alurApi, penjaminanApi } from '../../api/klinik';
import {
  ActiveBadge,
  EmptyBox,
  Field,
  FormModal,
  LoadingBox,
  Notice,
  PageHeader,
  RowActions,
  Tabs,
  Toggle,
  Toolbar,
  inputCls,
  useFlash,
} from './KlinikUI';

// Konfigurasi dua subbagian: field judul berbeda (alur: judul, penjaminan: nama)
const SECTIONS = {
  alur: {
    label: 'Alur Berobat',
    api: alurApi,
    titleKey: 'judul',
    titleLabel: 'Judul Langkah',
    descRequired: true,
    addLabel: 'Tambah Langkah',
    emptyTitle: 'Belum ada alur berobat.',
  },
  penjaminan: {
    label: 'Penjaminan',
    api: penjaminanApi,
    titleKey: 'nama',
    titleLabel: 'Nama Penjaminan',
    descRequired: false,
    addLabel: 'Tambah Penjaminan',
    emptyTitle: 'Belum ada data penjaminan.',
  },
};

function Section({ type, onError, onFlash }) {
  const cfg = SECTIONS[type];
  const { api, titleKey } = cfg;
  const initial = { [titleKey]: '', deskripsi: '', urutan: 0, is_active: true };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(initial);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      onError(err.message || `Gagal memuat ${cfg.label.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openForm = (item) => {
    setFormError('');
    setEditing(item || 'new');
    setForm(
      item
        ? {
            [titleKey]: item[titleKey] || '',
            deskripsi: item.deskripsi || '',
            urutan: item.urutan ?? 0,
            is_active: item.is_active,
          }
        : { ...initial, urutan: items.length + 1 }
    );
  };

  const onChange = (f) => (e) => setForm((c) => ({ ...c, [f]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form[titleKey].trim()) return setFormError(`${cfg.titleLabel} wajib diisi.`);
    if (cfg.descRequired && !form.deskripsi.trim()) return setFormError('Deskripsi wajib diisi.');
    if (Number(form.urutan) < 0 || !Number.isInteger(Number(form.urutan)))
      return setFormError('Urutan harus bilangan bulat ≥ 0.');

    const body = { ...form, urutan: Number(form.urutan || 0) };
    try {
      setSaving(true);
      setFormError('');
      if (editing === 'new') await api.create(body);
      else await api.update(editing.id, body);
      setEditing(null);
      onFlash(`${cfg.label} berhasil disimpan.`);
      await load();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.remove(pendingDelete.id);
      onFlash('Data berhasil dihapus.');
      await load();
    } catch (err) {
      onError(err.message || 'Gagal menghapus data.');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <Toolbar>
        <p className="text-sm text-slate-500">{items.length} data</p>
        <Button
          type="button"
          onClick={() => openForm()}
          className="flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          {cfg.addLabel}
        </Button>
      </Toolbar>

      {loading ? (
        <LoadingBox />
      ) : items.length === 0 ? (
        <EmptyBox title={cfg.emptyTitle} hint="Tambahkan data pertama." />
      ) : (
        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"
            >
              <div className="flex min-w-0 gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-700">
                  {item.urutan}
                </span>
                <div className="min-w-0">
                  <p className="break-words font-bold text-slate-900">{item[titleKey]}</p>
                  <p className="mt-1 whitespace-pre-line break-words text-xs leading-relaxed text-slate-500">
                    {item.deskripsi || 'Tidak ada deskripsi.'}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                <ActiveBadge active={item.is_active} />
                <RowActions onEdit={() => openForm(item)} onDelete={() => setPendingDelete(item)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <FormModal
          title={`${editing === 'new' ? 'Tambah' : 'Edit'} ${cfg.label}`}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          saving={saving}
          error={formError}
          onCloseError={() => setFormError('')}
        >
          <Field label={cfg.titleLabel} required>
            <input value={form[titleKey]} onChange={onChange(titleKey)} className={inputCls} />
          </Field>
          <Field label="Deskripsi" required={cfg.descRequired}>
            <textarea
              rows={5}
              value={form.deskripsi}
              onChange={onChange('deskripsi')}
              className={`${inputCls} resize-y`}
            />
          </Field>
          <Field label="Urutan" hint="(angka kecil tampil lebih dulu)">
            <input
              type="number"
              min={0}
              step={1}
              value={form.urutan}
              onChange={onChange('urutan')}
              className={inputCls}
            />
          </Field>
          <Toggle
            label="Tampilkan di website"
            checked={form.is_active}
            onChange={(v) => setForm((c) => ({ ...c, is_active: v }))}
          />
        </FormModal>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
        message={`"${pendingDelete?.[titleKey] || ''}" akan dihapus.`}
      />
    </>
  );
}

export default function InformasiPasien() {
  const [tab, setTab] = useState('alur');
  const [error, setError] = useState('');
  const [msg, flash] = useFlash();

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <PageHeader
          title="Informasi Pasien"
          desc="Kelola alur berobat dan jenis penjaminan."
        />
        <Notice message={msg} error={error} onCloseError={() => setError('')} />

        <Tabs
          value={tab}
          onChange={setTab}
          tabs={Object.entries(SECTIONS).map(([value, s]) => ({ value, label: s.label }))}
        />

        {/* key memaksa state bagian di-reset saat berpindah tab */}
        <Section key={tab} type={tab} onError={setError} onFlash={flash} />
      </div>
    </DashboardLayout>
  );
}