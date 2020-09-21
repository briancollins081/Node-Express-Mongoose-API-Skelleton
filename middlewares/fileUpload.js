const multer = require('multer');
//  image uploads
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString()}-${file.originalname}`);
    }
});
const isImage = filemimetype => {
    switch (filemimetype) {
        case 'image/jpg':
            return true;
        case 'image/jpeg':
            return true;
        case 'image/png':
            return true;
        default:
            return false;
    }
}

const imageFilter = (req, file, cb) => {
    if (isImage(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// uploads
exports.imageUploadMiddleware = multer({ storage: imageStorage, fileFilter: imageFilter })
    .fields([
        { name: 'profilepic', maxCount: 1 },
        { name: 'postimage', maxCount: 1 },
    ]);

