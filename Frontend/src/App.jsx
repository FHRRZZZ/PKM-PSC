import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/berita" element={<BeritaPage />} />
          <Route path="/admin/berita/tambah" element={<FormBerita />} />
          <Route path="/admin/faq" element={<FaqPage />} />
          <Route path="/admin/faq/tambah" element={<FormFaq />} />
          <Route path="/admin/kontak" element={<KontakPage />} />
          <Route path="/admin/layanan" element={<LayananPage />} />
          <Route path="/admin/layanan/tambah" element={<FormLayanan />} />
        </Route>
        <Route path="/forbidden" element={<ForbiddenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
