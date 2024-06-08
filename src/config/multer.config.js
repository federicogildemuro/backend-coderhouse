import multer from 'multer';
import __dirname from '../utils/dirname.utils.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';
        if (file.fieldname === 'profile') {
            folder = 'profiles';
        } else if (file.fieldname === 'product') {
            folder = 'products';
        } else if (file.fieldname === 'id' || file.fieldname === 'adress' || file.fieldname === 'account') {
            folder = 'documents';
        }
        cb(null, `${__dirname}/public/uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        const user = req.user;
        if (file.fieldname === 'profile') {
            cb(null, `${user._id}.${Date.now()}`);
        } else if (file.fieldname === 'product') {
            cb(null, `${user._id}.${Date.now()}`);
        } else if (file.fieldname === 'id') {
            cb(null, `${user._id}.${Date.now()}.id`);
        } else if (file.fieldname === 'adress') {
            cb(null, `${user._id}.${Date.now()}.adress`);
        } else if (file.fieldname === 'account') {
            cb(null, `${user._id}.${Date.now()}.account`);
        }
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos JPG'), false);
    }
};

const uploader = multer(
    {
        storage,
        fileFilter
    })
    .fields([
        { name: 'profile', maxCount: 1 },
        { name: 'product', maxCount: 2 },
        { name: 'id', maxCount: 1 },
        { name: 'adress', maxCount: 1 },
        { name: 'account', maxCount: 1 }
    ]);

export default uploader;