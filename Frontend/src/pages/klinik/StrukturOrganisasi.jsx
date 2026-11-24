import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus } from '../../components/Icons';
import { buildBody, strukturApi } from '../../api/klinik';
import {
  ActiveBadge,
  EmptyBox,
  Field,
  FormModal,
  LoadingBox,
  Notice,
  PageHeader,
  PhotoInput,
  RowActions,
  Thumb,
  Toggle,
  Toolbar,
  inputCls,
  useFlash,
} from './KlinikUI';

const initial = {
  nama: '',
  jabatan: '',
  parent_id: '',
  urutan: 0,
  is_active: true,
  foto: null,
  fotoUrl: '',
};

// Susun daftar datar menjadi urutan pohon dengan kedalaman
function flatten(items) {
  const ids = new Set(items.map((i) => i.id));
  const children = new Map();
  items.forEach((i) => {
    const key = i.parent_id != null && ids.has(i.parent_id) ? i.parent_id : null;
    if (!children.has(key)) children.set(key, []);
    children.get(key).push(i);
  });
  const out = [];
  const walk = (pid, depth) =>
    (children.get(pid) || []).forEach((i) => {
      out.push({ ...i, depth });
      walk(i.id, depth + 1);
    });
  walk(null, 0);
  return out;
}

function descendantIds(items, id) {
  const result = new Set();
  const walk = (pid) =>
    items.forEach((i) => {
      if (i.parent_id === pid && !result.has(i.id)) {
        result.add(i.id);
        walk(i.id);
      }
    });
  walk(id);
  return result;
}

export default function StrukturOrganisasi() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, flash] = useFlash();

  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(initial);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await strukturApi.list();
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal memuat struktur organisasi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => flatten(items), [items]);

  // Atasan tidak boleh diri sendiri atau bawahannya (hindari siklus)
  const parentOptions = useMemo(() => {
    if (!editing || editing === 'new') return rows;
    const blocked = descendantIds(items, editing.id);
    blocked.add(editing.id);
    return rows.filter((r) => !blocked.has(r.id));
  }, [rows, items, editing]);

  const openForm = (item) => {
    setFormError('');
    setEditing(item || 'new');
    setForm(
      item
        ? {
            nama: item.nama || '',
            jabatan: item.jabatan || '',
            parent_id: item.parent_id ? String(item.parent_id) : '',
            urutan: item.urutan ?? 0,
            is_active: item.is_active,
            foto: null,
            fotoUrl: item.foto || '',
          }
        : initial
    );
  };

  const set = (f) => (v) => setForm((c) => ({ ...c, [f]: v }));
  const onChange = (f) => (e) => set(f)(e.target.value);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.jabatan.trim())
      return setFormError('Nama dan jabatan wajib diisi.');
    if (Number(form.urutan) < 0 || !Number.isInteger(Number(form.urutan)))
      return setFormError('Urutan harus bilangan bulat ≥ 0.');

    const body = buildBody(
      {
        nama: form.nama,
        jabatan: form.jabatan,
        // null = tanpa atasan (JSON). Pada multipart, null tidak terkirim.
        parent_id: form.parent_id ? Number(form.parent_id) : null,
        urutan: Number(form.urutan || 0),
        is_active: form.is_active,
      },
      form.foto
    );

    try {
      setSaving(true);
      setFormError('');
      if (editing === 'new') await strukturApi.create(body);
      else await strukturApi.update(editing.id, body);
      setEditing(null);
      flash('Struktur organisasi berhasil disimpan.');
      await load();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await strukturApi.remove(pendingDelete.id);
      flash('Data berhasil dihapus.');
      await load();
    } catch (err) {
      // mis. 409: masih memiliki bawahan
      setError(err.message || 'Gagal menghapus data.');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <PageHeader
          title="Struktur Organisasi"
          desc="Kelola susunan jabatan dan atasan langsung."
        />
        <Notice message={msg} error={error} onCloseError={() => setError('')} />

        <Toolbar>
          <p className="text-sm text-slate-500">{items.length} anggota</p>
          <Button
            type="button"
            onClick={() => openForm()}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Tambah Anggota
          </Button>
        </Toolbar>

        {loading ? (
          <LoadingBox />
        ) : rows.length === 0 ? (
          <EmptyBox title="Belum ada struktur organisasi." hint="Tambahkan anggota pertama." />
        ) : (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {rows.map((r) => (
              <div
                key={r.id}
                style={{ paddingLeft: `${Math.min(r.depth, 5) * 24 + 16}px` }}
                className="flex min-w-0 flex-col gap-3 py-4 pr-4 sm:flex-row sm:items-center sm:justify-between sm:pr-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {r.depth > 0 && <span className="text-slate-300">└</span>}
                  <Thumb src={r.foto} alt={r.nama} className="h-12 w-12" />
                  <div className="min-w-0">
                    <p className="break-words font-bold text-slate-900">{r.nama}</p>
                    <p className="break-words text-xs text-slate-500">{r.jabatan}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                  <span className="text-xs text-slate-400">Urutan {r.urutan}</span>
                  <ActiveBadge active={r.is_active} />
                  <RowActions onEdit={() => openForm(r)} onDelete={() => setPendingDelete(r)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <FormModal
          title={editing === 'new' ? 'Tambah Anggota' : 'Edit Anggota'}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          saving={saving}
          error={formError}
          onCloseError={() => setFormError('')}
        >
          <Field label="Nama" required>
            <input value={form.nama} onChange={onChange('nama')} className={inputCls} />
          </Field>
          <Field label="Jabatan" required>
            <input value={form.jabatan} onChange={onChange('jabatan')} className={inputCls} />
          </Field>
          <Field label="Atasan" hint="(opsional)">
            <select value={form.parent_id} onChange={onChange('parent_id')} className={inputCls}>
              <option value="">Tanpa atasan (puncak)</option>
              {parentOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {'— '.repeat(o.depth)}
                  {o.nama} ({o.jabatan})
                </option>
              ))}
            </select>
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
          <PhotoInput file={form.foto} url={form.fotoUrl} onChange={set('foto')} label="Foto" />
          <Toggle label="Aktif" checked={form.is_active} onChange={set('is_active')} />
        </FormModal>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
        message={`"${pendingDelete?.nama || ''}" akan dihapus. Anggota yang masih memiliki bawahan tidak dapat dihapus.`}
      />
    </DashboardLayout>
  );
}