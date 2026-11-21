const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// ==================== PROFIL KLINIK ====================
const KlinikProfile = sequelize.define('KlinikProfile', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    melayani: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Keterangan siapa saja yang dilayani'
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telepon: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    whatsapp: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    maps_embed: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'URL embed Google Maps'
    },
    akreditasi: {
        type: DataTypes.STRING(150),
        allowNull: true,
        comment: 'Status akreditasi klinik'
    },
    akreditasi_tahun: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    izin_operasional_nomor: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    izin_operasional_penerbit: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    izin_operasional_file: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'klinik_profile',
    timestamps: false
});

// ==================== JAM OPERASIONAL ====================
const JamOperasional = sequelize.define('JamOperasional', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    hari: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    jam_buka: {
        type: DataTypes.TIME,
        allowNull: true
    },
    jam_tutup: {
        type: DataTypes.TIME,
        allowNull: true
    },
    is_tutup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    keterangan: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'jam_operasional',
    timestamps: false
});

// ==================== DOKTER ====================
const Dokter = sequelize.define('Dokter', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    spesialisasi: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    no_str: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'dokter',
    timestamps: false
});

// ==================== JADWAL PRAKTIK ====================
const JadwalPraktik = sequelize.define('JadwalPraktik', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    dokter_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: Dokter, key: 'id' },
        onDelete: 'CASCADE'
    },
    hari: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    jam_mulai: {
        type: DataTypes.TIME,
        allowNull: false
    },
    jam_selesai: {
        type: DataTypes.TIME,
        allowNull: false
    },
    ruang: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'jadwal_praktik',
    timestamps: false
});

Dokter.hasMany(JadwalPraktik, { foreignKey: 'dokter_id', as: 'jadwal' });
JadwalPraktik.belongsTo(Dokter, { foreignKey: 'dokter_id', as: 'dokter' });

// ==================== STRUKTUR ORGANISASI ====================
const StrukturOrganisasi = sequelize.define('StrukturOrganisasi', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    jabatan: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    parent_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'Atasan langsung untuk struktur bertingkat'
    },
    urutan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'struktur_organisasi',
    timestamps: false
});

// ==================== ALUR BEROBAT ====================
const AlurBerobat = sequelize.define('AlurBerobat', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    judul: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    urutan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'alur_berobat',
    timestamps: false
});

// ==================== PENJAMINAN ====================
const Penjaminan = sequelize.define('Penjaminan', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Contoh: BPJS Kesehatan, Umum, Asuransi'
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    urutan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'penjaminan',
    timestamps: false
});

// ==================== GALERI FASILITAS ====================
const GaleriFasilitas = sequelize.define('GaleriFasilitas', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    judul: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    urutan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'galeri_fasilitas',
    timestamps: false
});

module.exports = {
    KlinikProfile,
    JamOperasional,
    Dokter,
    JadwalPraktik,
    StrukturOrganisasi,
    AlurBerobat,
    Penjaminan,
    GaleriFasilitas
};
