import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContextBaru.jsx"; // Sesuaikan path dengan struktur folder proyek Anda

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/'); // Redirect ke Dashboard setelah sukses
    } catch (err) {
      setError(err.message || 'Email atau kata sandi salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Sisi Kiri: Panel Dekoratif Merah (Hidden di layar mobile kecil, muncul di lg) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#A30A0A] to-[#600303] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Konten Bagian Tengah */}
        <div className="my-auto max-w-lg">
          {/* Logo / Shield Badge */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center p-3 shadow-lg border border-white/20">
              {/* Anda bisa mengganti ini dengan tag <img> logo aslinya */}
              <div className="text-center font-bold">
                <span className="block text-xs bg-red-600 text-white rounded px-1 mb-0.5">119</span>
                <span className="text-[10px] tracking-tighter leading-none block">KOTA DEPOK</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            PSC 119
          </h1>
          <h2 className="text-2xl font-bold text-red-100 mb-4">
            Dinas Kesehatan Kota Depok
          </h2>
          <p className="text-red-200 text-sm leading-relaxed">
            Dinas Kesehatan Kota Depok. Masuk untuk memantau dan menangani laporan darurat medis dengan cepat.
          </p>
        </div>

        {/* Footer Sisi Kiri (Opsional dekorasi) */}
        <div className="text-xs text-red-300">
          Sistem Informasi Kegawatdaruratan Medis Terpadu
        </div>
      </div>

      {/* Sisi Kanan: Form Login */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-24">
        {/* Tombol Kembali di Pojok Kiri Atas */}
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors font-medium"
          >
            &lt; Kembali
          </button>
        </div>

        {/* Konten Utama Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Masuk Akun
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Layanan Kegawatdaruratan PSC 119
            </p>
          </div>

          {/* Notifikasi Error dari Backend */}
          {error && (
            <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Input Kata Sandi */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                <span aria-hidden="true">{showPassword ? '🙈' : '👁'}</span>
                </button>
              </div>
            </div>

            {/* Opsi Ingat Saya & Lupa Kata Sandi */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-600 border-stone-300 rounded focus:ring-red-500"
                />
                <span className="text-stone-600 select-none">Ingat Saya</span>
              </label>

              <a
                href="#lupa-sandi"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Silakan hubungi Superadmin untuk reset kata sandi.');
                }}
                className="text-red-700 hover:text-red-800 font-medium text-xs sm:text-sm"
              >
                Lupa Kata Sandi?
              </a>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#A30A0A] hover:bg-[#850808] text-white font-semibold rounded-lg shadow-md transition-colors text-sm disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer Hak Cipta */}
        <div className="text-center text-xs text-stone-400 pt-6">
          © 2026 Dinas Kesehatan Kota Depok
        </div>
      </div>
    </div>
  );
}
