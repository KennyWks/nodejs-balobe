const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/img-users");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '.' + file.mimetype.split('/')[1]);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2,
    } 
});
module.exports = upload;