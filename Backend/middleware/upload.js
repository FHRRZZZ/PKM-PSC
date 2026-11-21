const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDir),
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, extension)
            .replace(/[^a-z0-9-_]/gi, '-')
            .replace(/-+/g, '-')
            .slice(0, 60) || 'foto';
        callback(null, `${Date.now()}-${baseName}${extension}`);
    }
});

const imageUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
            return callback(null, true);
        }
        return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'foto'));
    }
});

module.exports = { imageUpload, uploadDir };
