const multer = require("multer")
const fs = require('fs')
const path = require('path')


UploadMiddleware= {
    upload: (fieldname) => {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "uploads/images")
            },
            filename: (req, file, cb) => {
                const fileExtension = file.mimetype.split("/")[1]
                const storedFileName = Date.now() + "." + fileExtension        
                cb(null, storedFileName)       
            }
        })
        const upload = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                const allowableFileTypes = /jpeg|jpg|png|gif/
                const isValidFileExt = allowableFileTypes.test(path.extname(file.originalname).toLowerCase())
                const isValidMimeType = allowableFileTypes.test(file.mimetype)

                if (isValidFileExt && isValidMimeType){
                    return cb(null, true)
                } else {
                    req.errors = "one or more unsupported file type"
                    return cb(null, false)
                }
            }
        })      
        
        
        return upload.array(fieldname, 3)        
    }
}

module.exports = UploadMiddleware