import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import SearchInput from '../../components/SearchInput';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus } from '../../components/Icons';
import { buildBody, dokterApi, jadwalApi } from '../../api/klinik';
import {
  ActiveBadge,
  EmptyBox,
  Field,
  FormModal,
  HARI,
  LoadingBox,
  Notice,
  PageHeader,
  PhotoInput,
  RowActions,
  Tabs,
  Thumb,
  Toggle,
  Toolbar,
  inputCls,
  time5,
  useFlash,
} from './KlinikUI';

const dokterInitial = { nama: '', spesialisasi: '', no_str: '', is_active: true, foto: null, fotoUrl: '' };
const jadwalInitial = {
  dokter_id: '',
  hari: 'Senin',
  jam_mulai: '08:00',
  jam_selesai: '12:00',
  ruang: '',
  is_active: true,
};

export default function DokterJadwal() {
  const [tab, setTab] = useState('dokter');
  const [dokter, setDokter] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, flash] = useFlash();

  const [editing, setEditing] = useState(null); // { type, item|null }
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // { type, item }

  const load = async () => {
    try {
      setLoading(true);
      const [d, j] = await Promise.all([dokterApi.list(), jadwalApi.list()]);
      setDokter(Array.isArray(d) ? d : []);
      setJadwal(Array.isArray(j) ? j : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal memuat data dokter dan jadwal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredDokter = useMemo(
    () => dokter.filter((d) => (d.nama || '').toLowerCase().includes(query.toLowerCase())),
    [dokter, query]
  );

  const sortedJadwal = useMemo(
    () =>
      [...jadwal]
        .filter((j) => (j.dokter?.nama || '').toLowerCase().includes(query.toLowerCase()))
        .sort(
          (a, b) =>
            HARI.indexOf(a.hari) - HARI.indexOf(b.hari) ||
            time5(a.jam_mulai).localeCompare(time5(b.jam_mulai))
        ),
    [jadwal, query]
  );

  const openForm = (type, item) => {
    setFormError('');
    setEditing({ type, item: item || null });
    if (type === 'dokter') {
      setForm(
        item
          ? {
              nama: item.nama || '',
              spesialisasi: item.spesialisasi || '',
              no_str: item.no_str || '',
              is_active: item.is_active,
              foto: null,
              fotoUrl: item.foto || '',
            }
          : dokterInitial
      );
    } else {
      setForm(
        item
          ? {
              dokter_id: String(item.dokter_id),
              hari: item.hari,
              jam_mulai: time5(item.jam_mulai),
              jam_selesai: time5(item.jam_selesai),
              ruang: item.ruang || '',
              is_active: item.is_active,
            }
          : jadwalInitial
      );
    }
  };

  const set = (f) => (v) => setForm((c) => ({ ...c, [f]: v }));
  const onChange = (f) => (e) => set(f)(e.target.value);

  const submit = async (e) => {
    e.preventDefault();
    const { type, item } = editing;

    if (type === 'dokter' && !form.nama.trim()) return setFormError('Nama dokter wajib diisi.');
    if (type === 'jadwal') {
      if (!form.dokter_id || !form.hari || !form.jam_mulai || !form.jam_selesai)
        return setFormError('Dokter, hari, jam mulai, dan jam selesai wajib diisi.');
      if (form.jam_selesai <= form.jam_mulai)
        return setFormError('Jam selesai harus lebih besar dari jam mulai.');
    }

    try {
      setSaving(true);
      setFormError('');
      if (type === 'dokter') {
        const body = buildBody(
          {
            nama: form.nama,
            spesialisasi: form.spesialisasi,
            no_str: form.no_str,
            is_active: form.is_active,
          },
          form.foto
        );
        if (item) await dokterApi.update(item.id, body);
        else await dokterApi.create(body);
      } else {
        const body = { ...form, dokter_id: Number(form.dokter_id) };
        if (item) await jadwalApi.update(item.id, body);
        else await jadwalApi.create(body);
      }
      setEditing(null);
      flash(type === 'dokter' ? 'Data dokter berhasil disimpan.' : 'Jadwal praktik berhasil disimpan.');
      await load();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const { type, item } = pendingDelete;
    try {
      if (type === 'dokter') await dokterApi.remove(item.id);
      else await jadwalApi.remove(item.id);
      flash(type === 'dokter' ? 'Dokter berhasil dihapus.' : 'Jadwal praktik berhasil dihapus.');
      await load();
    } catch (err) {
      setError(err.message || 'Gagal menghapus data.');
    } finally {
      setPendingDelete(null);
    }
  };

  const deleteMessage =
    pendingDelete?.type === 'dokter'
      ? `Dokter "${pendingDelete.item.nama}" akan dihapus beserta ${
          pendingDelete.item.jadwal?.length || 0
        } jadwal praktiknya.`
      : 'Jadwal praktik ini akan dihapus.';

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <PageHeader
          title="Dokter & Jadwal Praktik"
          crumb="Dokter & Jadwal"
          desc="Kelola data dokter dan jadwal praktiknya."
        />
        <Notice message={msg} error={error} onCloseError={() => setError('')} />

        <Tabs
          value={tab}
          onChange={(v) => {
            setTab(v);
            setQuery('');
          }}
          tabs={[
            { value: 'dokter', label: `Dokter (${dokter.length})` },
            { value: 'jadwal', label: `Jadwal Praktik (${jadwal.length})` },
          ]}
        />

        <Toolbar>
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama dokter..."
            className="w-full sm:max-w-md"
          />
          <Button
            type="button"
            onClick={() => openForm(tab)}
            disabled={tab === 'jadwal' && dokter.length === 0}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            {tab === 'dokter' ? 'Tambah Dokter' : 'Tambah Jadwal'}
          </Button>
        </Toolbar>

        {loading ? (
          <LoadingBox />
        ) : tab === 'dokter' ? (
          filteredDokter.length === 0 ? (
            <EmptyBox
              title={query ? 'Dokter tidak ditemukan.' : 'Belum ada dokter.'}
              hint={query ? 'Coba gunakan kata kunci lain.' : 'Tambahkan dokter pertama.'}
            />
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {filteredDokter.map((d) => (
                <article
                  key={d.id}
                  className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex min-w-0 flex-1 gap-4 p-4 sm:p-5">
                    <Thumb src={d.foto} alt={d.nama} className="h-20 w-20" />
                    <div className="min-w-0">
                      <ActiveBadge active={d.is_active} />
                      <h3 className="mt-2 break-words font-bold text-slate-900">{d.nama}</h3>
                      <p className="break-words text-xs text-slate-500">{d.spesialisasi || '-'}</p>
                      <p className="mt-1 break-words text-xs text-slate-400">
                        STR: {d.no_str || '-'} · {d.jadwal?.length || 0} jadwal
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-slate-100 p-4">
                    <RowActions
                      onEdit={() => openForm('dokter', d)}
                      onDelete={() => setPendingDelete({ type: 'dokter', item: d })}
                    />
                  </div>
                </article>
              ))}
            </div>
          )
        ) : sortedJadwal.length === 0 ? (
          <EmptyBox
            title={query ? 'Jadwal tidak ditemukan.' : 'Belum ada jadwal praktik.'}
            hint={dokter.length === 0 ? 'Tambahkan dokter terlebih dahulu.' : 'Tambahkan jadwal pertama.'}
          />
        ) : (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {sortedJadwal.map((j) => (
              <div
                key={j.id}
                className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <p className="break-words font-bold text-slate-900">{j.dokter?.nama || `Dokter #${j.dokter_id}`}</p>
                  <p className="text-xs text-slate-500">
                    {j.dokter?.spesialisasi || '-'}
                    {j.ruang ? ` · Ruang ${j.ruang}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                  <span className="text-sm font-semibold text-slate-700">
                    {j.hari}, {time5(j.jam_mulai)} – {time5(j.jam_selesai)}
                  </span>
                  <ActiveBadge active={j.is_active} />
                  <RowActions
                    onEdit={() => openForm('jadwal', j)}
                    onDelete={() => setPendingDelete({ type: 'jadwal', item: j })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <FormModal
          title={`${editing.item ? 'Edit' : 'Tambah'} ${editing.type === 'dokter' ? 'Dokter' : 'Jadwal Praktik'}`}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          saving={saving}
          error={formError}
          onCloseError={() => setFormError('')}
        >
          {editing.type === 'dokter' ? (
            <>
              <Field label="Nama Dokter" required>
                <input value={form.nama} onChange={onChange('nama')} className={inputCls} placeholder="dr. ..." />
              </Field>
              <Field label="Spesialisasi">
                <input value={form.spesialisasi} onChange={onChange('spesialisasi')} className={inputCls} />
              </Field>
              <Field label="No. STR">
                <input value={form.no_str} onChange={onChange('no_str')} className={inputCls} />
              </Field>
              <PhotoInput file={form.foto} url={form.fotoUrl} onChange={set('foto')} label="Foto Dokter" />
              <Toggle
                label="Aktif"
                hint="Dokter nonaktif tidak tampil di website."
                checked={form.is_active}
                onChange={set('is_active')}
              />
            </>
          ) : (
            <>
              <Field label="Dokter" required>
                <select value={form.dokter_id} onChange={onChange('dokter_id')} className={inputCls}>
                  <option value="">Pilih dokter</option>
                  {dokter.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama}
                      {d.spesialisasi ? ` — ${d.spesialisasi}` : ''}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Hari" required>
                <select value={form.hari} onChange={onChange('hari')} className={inputCls}>
                  {HARI.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Jam Mulai" required>
                  <input type="time" value={form.jam_mulai} onChange={onChange('jam_mulai')} className={inputCls} />
                </Field>
                <Field label="Jam Selesai" required>
                  <input type="time" value={form.jam_selesai} onChange={onChange('jam_selesai')} className={inputCls} />
                </Field>
              </div>
              <Field label="Ruang" hint="(opsional)">
                <input value={form.ruang} onChange={onChange('ruang')} className={inputCls} />
              </Field>
              <Toggle label="Aktif" checked={form.is_active} onChange={set('is_active')} />
            </>
          )}
        </FormModal>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
        message={deleteMessage}
      />
    </DashboardLayout>
  );
}