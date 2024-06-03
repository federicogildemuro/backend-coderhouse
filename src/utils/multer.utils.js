import multer from 'multer';
import __dirname from '../utils/dirname.js';

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

export const uploader = multer({ storage });