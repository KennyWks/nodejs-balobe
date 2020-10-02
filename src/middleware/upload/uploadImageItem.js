const multer = require("multer");
require('dotenv').config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/img-item");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '.' + file.mimetype.split('/')[1]);
    }
});

const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: process.env.APP_ENV === 'development' ? storage : memoryStorage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    }
});
module.exports = upload;