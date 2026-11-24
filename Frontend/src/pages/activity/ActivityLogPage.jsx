import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import { getActivities } from '../../api/activities';

const actionLabel = (action) => ({
  VIEW: 'Melihat', POST: 'Menambah', PUT: 'Mengubah', PATCH: 'Mengubah', DELETE: 'Menghapus', LOGIN: 'Login',
}[action] || action);

const actionClass = (action) => ({
  VIEW: 'bg-slate-100 text-slate-600', LOGIN: 'bg-emerald-50 text-emerald-700',
  POST: 'bg-blue-50 text-blue-700', PUT: 'bg-amber-50 text-amber-700', PATCH: 'bg-amber-50 text-amber-700',
  DELETE: 'bg-red-50 text-red-700',
}[action] || 'bg-slate-100 text-slate-600');

const formatDate = (value) => new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value));

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setLogs(await getActivities(200));
      setError('');
    } catch (err) {
      setError(err.message || 'Gagal memuat log aktivitas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return logs;
    return logs.filter((log) => [log.admin_username, log.action, log.method, log.path]
      .some((value) => String(value || '').toLowerCase().includes(needle)));
  }, [logs, query]);

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        <PageHeader
          breadcrumb={[{ label: 'Admin' }, { label: 'Log Aktivitas' }]}
          title="Log Aktivitas Admin"
          subtitle="Pantau aktivitas akun admin di dalam CMS."
          actions={<button type="button" onClick={load} className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800">Muat ulang</button>}
        />

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="font-bold text-slate-900">Aktivitas terbaru</p>
              <p className="mt-1 text-xs text-slate-500">{filtered.length} aktivitas ditampilkan</p>
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari admin atau aktivitas..." className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:max-w-xs" />
          </div>

          {loading ? <p className="p-6 text-sm text-slate-500">Memuat log aktivitas...</p> : error ? <p className="p-6 text-sm text-red-700">{error}</p> : filtered.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">Belum ada aktivitas yang cocok.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr><th className="px-5 py-3 font-bold">Waktu</th><th className="px-5 py-3 font-bold">Admin</th><th className="px-5 py-3 font-bold">Aktivitas</th><th className="px-5 py-3 font-bold">Endpoint</th><th className="px-5 py-3 font-bold">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((log) => <tr key={log.id} className="hover:bg-slate-50/70"><td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">{formatDate(log.createdAt)}</td><td className="px-5 py-4 font-semibold text-slate-800">{log.admin_username}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${actionClass(log.action)}`}>{actionLabel(log.action)}</span><span className="ml-2 text-xs text-slate-400">{log.method}</span></td><td className="max-w-[280px] truncate px-5 py-4 font-mono text-xs text-slate-500" title={log.path}>{log.path}</td><td className={`px-5 py-4 text-xs font-bold ${log.status >= 400 ? 'text-red-600' : 'text-emerald-600'}`}>{log.status}</td></tr>)}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
