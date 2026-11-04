import { useState } from "react";
import FormField from "../components/common/FormField";

export default function ExamplePage() {
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form>
      <FormField
        label="Nama Layanan"
        name="nama"
        value={form.nama}
        onChange={handleChange}
        placeholder="Masukkan nama layanan"
        required
      />

      <FormField
        label="Deskripsi"
        name="deskripsi"
        type="textarea"
        value={form.deskripsi}
        onChange={handleChange}
        placeholder="Masukkan deskripsi"
      />
    </form>
  );
}