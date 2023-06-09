const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination:"public/images",
    filename:(req,file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const uploadSingle = multer({
    storage: storage,
    // limits: { fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single("image")

const uploadMulti = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).array("image")

const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimetype)
    if(mimeType && extName){
        return cb(null, true)
    }else{
        cb("Error: Images Only !!")
    }
}

module.exports = {uploadSingle, uploadMulti}