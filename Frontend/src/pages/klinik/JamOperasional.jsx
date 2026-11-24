import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus } from '../../components/Icons';
import { jamApi } from '../../api/klinik';
import {
  EmptyBox,
  Field,
  FormModal,
  HARI,
  LoadingBox,
  Notice,
  PageHeader,
  RowActions,
  Toggle,
  Toolbar,
  inputCls,
  time5,
  useFlash,
} from './KlinikUI';

const initial = {
  hari: 'Senin',
  jam_buka: '08:00',
  jam_tutup: '17:00',
  is_tutup: false,
  keterangan: '',
};

export default function JamOperasional() {
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
      const data = await jamApi.list();
      setItems(
        (Array.isArray(data) ? data : []).sort(
          (a, b) => HARI.indexOf(a.hari) - HARI.indexOf(b.hari)
        )
      );
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal memuat jam operasional.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openForm = (item) => {
    setFormError('');
    setEditing(item || 'new');
    setForm(
      item
        ? {
            hari: item.hari,
            jam_buka: time5(item.jam_buka),
            jam_tutup: time5(item.jam_tutup),
            is_tutup: item.is_tutup,
            keterangan: item.keterangan || '',
          }
        : initial
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.is_tutup && (!form.jam_buka || !form.jam_tutup)) {
      return setFormError('Jam buka dan jam tutup wajib diisi.');
    }
    if (!form.is_tutup && form.jam_tutup <= form.jam_buka) {
      return setFormError('Jam tutup harus lebih besar dari jam buka.');
    }

    const body = {
      hari: form.hari,
      is_tutup: form.is_tutup,
      keterangan: form.keterangan,
      ...(form.is_tutup ? {} : { jam_buka: form.jam_buka, jam_tutup: form.jam_tutup }),
    };

    try {
      setSaving(true);
      setFormError('');
      if (editing === 'new') await jamApi.create(body);
      else await jamApi.update(editing.id, body);
      setEditing(null);
      flash('Jam operasional berhasil disimpan.');
      await load();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan jam operasional.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await jamApi.remove(pendingDelete.id);
      flash('Jam operasional berhasil dihapus.');
      await load();
    } catch (err) {
      setError(err.message || 'Gagal menghapus jam operasional.');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <PageHeader title="Jam Operasional" desc="Atur jadwal buka klinik per hari." />
        <Notice message={msg} error={error} onCloseError={() => setError('')} />

        <Toolbar>
          <p className="text-sm text-slate-500">{items.length} hari terdaftar</p>
          <Button
            type="button"
            onClick={() => openForm()}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Tambah Jam
          </Button>
        </Toolbar>

        {loading ? (
          <LoadingBox />
        ) : items.length === 0 ? (
          <EmptyBox title="Belum ada jam operasional." hint="Tambahkan jam operasional pertama." />
        ) : (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{item.hari}</p>
                  {item.keterangan && (
                    <p className="mt-0.5 break-words text-xs text-slate-500">{item.keterangan}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  {item.is_tutup ? (
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
                      Klinik tutup
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-slate-700">
                      {time5(item.jam_buka)} – {time5(item.jam_tutup)}
                    </span>
                  )}
                  <RowActions onEdit={() => openForm(item)} onDelete={() => setPendingDelete(item)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <FormModal
          title={editing === 'new' ? 'Tambah Jam Operasional' : 'Edit Jam Operasional'}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          saving={saving}
          error={formError}
          onCloseError={() => setFormError('')}
        >
          <Field label="Hari" required>
            <select
              value={form.hari}
              onChange={(e) => setForm((c) => ({ ...c, hari: e.target.value }))}
              className={inputCls}
            >
              {HARI.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </Field>

          <Toggle
            label="Klinik tutup"
            hint="Aktifkan jika klinik tutup pada hari ini."
            checked={form.is_tutup}
            onChange={(v) => setForm((c) => ({ ...c, is_tutup: v }))}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Jam Buka" required={!form.is_tutup}>
              <input
                type="time"
                value={form.jam_buka}
                disabled={form.is_tutup}
                onChange={(e) => setForm((c) => ({ ...c, jam_buka: e.target.value }))}
                className={inputCls}
              />
            </Field>
            <Field label="Jam Tutup" required={!form.is_tutup}>
              <input
                type="time"
                value={form.jam_tutup}
                disabled={form.is_tutup}
                onChange={(e) => setForm((c) => ({ ...c, jam_tutup: e.target.value }))}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Keterangan" hint="(opsional)">
            <input
              value={form.keterangan}
              maxLength={255}
              onChange={(e) => setForm((c) => ({ ...c, keterangan: e.target.value }))}
              className={inputCls}
              placeholder="Mis. Istirahat 12.00–13.00"
            />
          </Field>
        </FormModal>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
        message={`Jam operasional hari ${pendingDelete?.hari || ''} akan dihapus.`}
      />
    </DashboardLayout>
  );
}