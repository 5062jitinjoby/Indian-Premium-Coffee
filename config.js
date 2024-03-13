const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
module.exports={
    database:'mongodb://localhost:27017/indiancoffee',
    secret:'my-secret-key',
    storage:storage
}