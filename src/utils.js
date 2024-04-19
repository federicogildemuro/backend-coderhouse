import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import config from './config/config.js';
import jwt from 'jsonwebtoken';

const __dirname = dirname(fileURLToPath(import.meta.url));

function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(config.bcryptSalt));
}

function isValidPassword(password, user) {
    return bcrypt.compareSync(password, user.password);
}

function generateToken(user) {
    return jwt.sign(user, config.jwtSecret, { expiresIn: config.jwtExpiration });
}

function validateToken(token) {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        return null;
    }
}

export { __dirname, createHash, isValidPassword, generateToken, validateToken };