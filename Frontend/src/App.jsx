import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admins/AdminsPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BeritaPage from "./pages/berita/BeritaPage";
import FaqPage from "./pages/faq/FaqPage";
import KontakPage from "./pages/kontak/KontakPage";
import LayananPage from "./pages/layanan/LayananPage";
import FormBerita from "./pages/berita/FormBerita";
import FormFaq from "./pages/faq/FormFaq";
import FormLayanan from "./pages/layanan/FormLayanan";
import ProfilKlinik from "./pages/klinik/ProfilKlinik";
import JamOperasional from "./pages/klinik/JamOperasional";
import DokterJadwal from "./pages/klinik/DokterJadwal";
import StrukturOrganisasi from "./pages/klinik/StrukturOrganisasi";
import InformasiPasien from "./pages/klinik/InformasiPasien";
import GaleriFasilitas from "./pages/klinik/GaleriFasilitas";
import LayananDetail from "./pages/layanan/LayananDetail";
import BeritaPublikPage from './pages/berita/BeritaPublikPage';
import BeritaDetailPublikPage from './pages/berita/BeritaDetailPublikPage';
import KlinikDetail from './pages/klinik/KlinikDetail';
import TentangDetail from './pages/tentang/TentangDetail';
import PanduanDetail from "./components/public/PanduanDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/layanan" element={<LayananDetail />} />
        <Route path="/layanan/:slug" element={<LayananDetail />} />
        <Route path="/berita" element={<BeritaPublikPage />} />
        <Route path="/berita/:slug" element={<BeritaDetailPublikPage />} />
        <Route path="/klinik" element={<KlinikDetail />} />
        <Route path="/klinik/:slug" element={<KlinikDetail />} />
        <Route path="/tentang" element={<TentangDetail />} />
        <Route path="/tentang/:slug" element={<TentangDetail />} />
        <Route path="/panduan" element={<PanduanDetail />} />
        <Route path="/panduan/:slug" element={<PanduanDetail />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/berita" element={<BeritaPage />} />
          <Route path="/admin/berita/tambah" element={<FormBerita />} />
          <Route path="/admin/faq" element={<FaqPage />} />
          <Route path="/admin/faq/tambah" element={<FormFaq />} />
          <Route path="/admin/kontak" element={<KontakPage />} />
          <Route path="/admin/layanan" element={<LayananPage />} />
          <Route path="/admin/layanan/tambah" element={<FormLayanan />} />
          <Route path="/admin/klinik/profil" element={<ProfilKlinik />} />
          <Route path="/admin/klinik/jam-operasional" element={<JamOperasional />} />
          <Route path="/admin/klinik/dokter" element={<DokterJadwal />} />
          <Route path="/admin/klinik/struktur-organisasi" element={<StrukturOrganisasi />} />
          <Route path="/admin/klinik/informasi-pasien" element={<InformasiPasien />} />
          <Route path="/admin/klinik/galeri" element={<GaleriFasilitas />} />
        </Route>
        <Route path="/forbidden" element={<ForbiddenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;