import React from 'react';
import { Upload, ShieldCheck } from 'lucide-react';

const FileUpload = ({ 
  label = "Foto Utama Berita", 
  required = true,
  helperText = "Format JPG atau PNG (Maks. 5MB, resolusi rekomendasi 1200×630px)",
  securityNote = "Foto utama akan otomatis dioptimasi untuk rasio media sosial serta pratinjau pesan darurat.",
  heightClass = "h-[340px]",
  onFileSelect
}) => {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Upload Dropzone Container */}
      <div className={`w-full bg-[#F5F5F5] rounded-2xl p-8 flex flex-col items-center justify-center text-center ${heightClass} border-2 border-dashed border-transparent hover:border-gray-300 transition-all cursor-pointer`}>
        {/* Circle Icon Container */}
        <div className="w-12 h-12 rounded-full bg-red-100/70 flex items-center justify-center text-red-700 mb-4">
          <Upload className="w-5 h-5 stroke-[2.5]" />
        </div>

        <h4 className="font-bold text-base text-gray-900 mb-1">
          Klik atau seret foto ke sini
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[240px] mb-6">
          {helperText}
        </p>

        <label className="bg-gray-200/80 hover:bg-gray-300 text-gray-800 font-semibold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer">
          Pilih Berkas Komputer
          <input 
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg"
            onChange={(e) => onFileSelect && onFileSelect(e.target.files[0])}
          />
        </label>
      </div>

      {/* Info Box Bawah Upload */}
      {securityNote && (
        <div className="mt-4 bg-[#F5F5F5] rounded-xl p-3.5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 font-medium leading-tight">
            {securityNote}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;