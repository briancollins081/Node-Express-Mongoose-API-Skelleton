const multer = require('multer');
const {transformFilename} = require('../constants/global')
//  image uploads
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        // console.log({file});
        const name = file.originalname;
        cb(null, `${new Date().toISOString()}-${transformFilename(18)}${name.substr(name.lastIndexOf('.'))}`);
    }
});
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/others/');
    },
    filename: (req, file, cb) => {
        const name = file.originalname;
        cb(null, `${new Date().toISOString()}-${transformFilename(18)}${name.substr(name.lastIndexOf('.'))}`);
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
