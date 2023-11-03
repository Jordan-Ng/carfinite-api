const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage }).array('images', 3);

module.exports = upload;
