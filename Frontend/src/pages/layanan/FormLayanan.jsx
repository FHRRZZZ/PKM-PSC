import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/Button";
import FormField from "../../components/FormField";
import MessageError from "../../components/MessageError";
import ToggleSwitch from "../../components/ToggleSwitch";
import { Upload } from "../../components/Icons";
import {
  createLayanan,
  getLayananAdminById,
  updateLayanan,
} from "../../api/layanan";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initial = {
  nama: "",
  deskripsi: "",
  tarif: "",
  tarif_is_active: false,
  is_active: true,
  foto: null,
  fotoUrl: "",
};

export default function FormLayanan() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get("id");

  useEffect(() => {
    if (!id) return;

    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const item = await getLayananAdminById(id);

        if (!active) return;

        setForm({
          nama: item.nama || "",
          deskripsi: item.deskripsi || "",
          tarif: item.tarif ?? "",
          tarif_is_active: Boolean(item.tarif_is_active),
          is_active: Boolean(item.is_active),
          foto: null,
          fotoUrl: item.foto || "",
        });
      } catch (err) {
        if (active) setError(err.message || "Gagal memuat data layanan.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const tarif = form.tarif === "" ? null : Number(form.tarif);

    const body = form.foto
      ? new FormData()
      : {
          nama: form.nama,
          deskripsi: form.deskripsi,
          tarif,
          tarif_is_active: form.tarif_is_active,
          is_active: form.is_active,
          ...(form.fotoUrl ? { foto: form.fotoUrl } : {}),
        };

    if (form.foto) {
      body.append("nama", form.nama);
      body.append("deskripsi", form.deskripsi);
      if (form.tarif !== "") body.append("tarif", String(form.tarif));
      body.append("tarif_is_active", String(form.tarif_is_active));
      body.append("is_active", String(form.is_active));
      body.append("foto", form.foto);
    }

    try {
      if (id) await updateLayanan(id, body);
      else await createLayanan(body);

      navigate("/admin/layanan");
    } catch (err) {
      setError(err.message || "Gagal menyimpan layanan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen min-w-0 bg-slate-50">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Admin &gt; Layanan &gt; <b className="text-slate-800">{id ? "Edit" : "Tambah"}</b>
          </p>

          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            {id ? "Edit Layanan" : "Tambah Layanan"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Lengkapi informasi layanan ambulans di bawah ini.
          </p>
        </div>

        {/* Error */}
        <div className="mb-6">
          <MessageError
            message={error}
            onClose={() => setError("")}
          />
        </div>

        {loading ? (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            Memuat data layanan...
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="grid min-w-0 grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-8">
              {/* Form informasi */}
              <div className="min-w-0 space-y-5">
                <label className="block text-sm font-semibold text-slate-800">
                  Nama Layanan *
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(event) =>
                      handleChange("nama", event.target.value)
                    }
                    required
                    className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                    placeholder="Contoh: Ambulans Darurat"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-800">
                  Deskripsi / Ringkasan *
                  <textarea
                    value={form.deskripsi}
                    onChange={(event) =>
                      handleChange("deskripsi", event.target.value)
                    }
                    required
                    rows={7}
                    className="mt-2 w-full min-w-0 resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 sm:px-4"
                    placeholder="Jelaskan layanan yang tersedia..."
                  />
                </label>

                <FormField
                  label="Tarif Layanan"
                  name="tarif"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.tarif}
                  onChange={(event) =>
                    handleChange("tarif", event.target.value)
                  }
                  placeholder="Contoh: 150000"
                />

                <div className="min-w-0 rounded-xl border border-slate-100 p-3 sm:p-4">
                  <ToggleSwitch
                    checked={form.tarif_is_active}
                    onChange={(value) =>
                      handleChange("tarif_is_active", value?.target ? value.target.checked : value)
                    }
                    label="Aktifkan tarif"
                    description="Tampilkan informasi tarif layanan kepada masyarakat."
                    size="large"
                  />
                </div>
              </div>

              {/* Foto dan status */}
              <div className="min-w-0 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-800">
                    Foto Utama{" "}
                    <span className="font-normal text-slate-400">
                      (opsional)
                    </span>
                  </label>

                  <div className="mt-2 flex min-h-[220px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center sm:min-h-[280px] sm:p-5">
                    {form.foto ? (
                      <img
                        src={URL.createObjectURL(form.foto)}
                        alt="Preview foto layanan"
                        className="max-h-56 max-w-full rounded-lg object-contain"
                      />
                    ) : form.fotoUrl ? (
                      <img
                        src={`${API_URL}${form.fotoUrl}`}
                        alt="Foto layanan saat ini"
                        className="max-h-56 max-w-full rounded-lg object-contain"
                      />
                    ) : (
                      <>
                        <Upload className="h-9 w-9 text-red-700 sm:h-10 sm:w-10" />
                        <p className="mt-3 text-sm font-semibold text-slate-700">
                          Pilih foto JPG/PNG
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Unggah foto untuk layanan ini.
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(event) =>
                        handleChange(
                          "foto",
                          event.target.files?.[0] || null
                        )
                      }
                      className="mt-4 w-full max-w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-red-700 hover:file:bg-red-100"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 p-3 sm:p-4">
                  <ToggleSwitch
                    checked={form.is_active}
                    onChange={(value) =>
                      handleChange("is_active", value?.target ? value.target.checked : value)
                    }
                    label="Tampilkan di website"
                    description="Status layanan akan terlihat oleh pengunjung."
                    size="large"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/layanan")}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}