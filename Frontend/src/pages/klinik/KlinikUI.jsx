import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import MessageError from '../../components/MessageError';
import { Image, Upload } from '../../components/Icons';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const fotoSrc = (path) =>
  !path ? '' : /^https?:\/\//.test(path) ? path : `${API_URL}${path}`;

// TIME dari backend "HH:MM:SS" -> "HH:MM"
export const time5 = (t) => (t ? String(t).slice(0, 5) : '');

export const inputCls =
  'mt-2 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 disabled:bg-slate-100 disabled:text-slate-400 sm:px-4';

export function useFlash() {
  const [msg, setMsg] = useState('');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const flash = (text) => {
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(''), 3500);
  };
  return [msg, flash];
}

export function PageHeader({ title, desc, crumb }) {
  return (
    <div className="mb-6">
      <p className="text-xs text-slate-500">
        Admin &gt; Klinik &gt; <b className="text-slate-800">{crumb || title}</b>
      </p>
      <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
      {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
    </div>
  );
}

export function Notice({ message, error, onCloseError }) {
  return (
    <>
      {(error || message) && (
        <div className="mb-6 space-y-3">
          <MessageError message={error} onClose={onCloseError} />
          {message && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
              {message}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export const LoadingBox = ({ text = 'Memuat data...' }) => (
  <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
    {text}
  </div>
);

export const EmptyBox = ({ title, hint }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-10">
    <p className="text-sm font-medium text-slate-700">{title}</p>
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            value === t.value
              ? 'bg-red-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export const Toolbar = ({ children }) => (
  <div className="mb-6 flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
    {children}
  </div>
);

export const ActiveBadge = ({ active, on = 'Aktif', off = 'Nonaktif' }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
      active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
    }`}
  >
    {active ? on : off}
  </span>
);

export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex shrink-0 items-center gap-4 text-xs">
      <button
        type="button"
        onClick={onEdit}
        className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="font-semibold text-red-600 transition-colors hover:text-red-800"
      >
        Hapus
      </button>
    </div>
  );
}

export function Field({ label, required, hint, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      {required && ' *'}
      {hint && <span className="ml-1 font-normal text-slate-400">{hint}</span>}
      {children}
    </label>
  );
}

export function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold sm:p-4">
      <span className="min-w-0">
        {label}
        {hint && (
          <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-red-700"
      />
    </label>
  );
}

export function PhotoInput({ file, url, onChange, label = 'Foto', required }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);
  const src = preview || fotoSrc(url);

  return (
    <div>
      <p className="text-sm font-semibold text-slate-800">
        {label}{' '}
        <span className="font-normal text-slate-400">
          {required ? '(wajib)' : '(opsional)'}
        </span>
      </p>
      <div className="mt-2 flex min-h-[180px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
        {src ? (
          <img src={src} alt={label} className="max-h-44 max-w-full rounded-lg object-contain" />
        ) : (
          <>
            <Upload className="h-9 w-9 text-red-700" />
            <p className="mt-2 text-sm font-semibold text-slate-700">Pilih foto JPG/PNG</p>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="mt-4 w-full max-w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-red-700 hover:file:bg-red-100"
        />
      </div>
    </div>
  );
}

export const Thumb = ({ src, alt, className = 'h-16 w-16' }) =>
  src ? (
    <img
      src={fotoSrc(src)}
      alt={alt}
      loading="lazy"
      className={`${className} shrink-0 rounded-lg bg-slate-100 object-cover`}
    />
  ) : (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400`}
    >
      <Image className="h-6 w-6" />
    </div>
  );

// Modal form: error backend ditampilkan di dalam modal
export function FormModal({ title, onClose, onSubmit, saving, error, onCloseError, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-5">
      <form
        onSubmit={onSubmit}
        className="my-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
          >
            &times;
          </button>
        </div>

        <div className="min-h-0 space-y-5 overflow-y-auto p-4 sm:p-5">
          <MessageError message={error} onClose={onCloseError} />
          {children}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </div>
  );
}