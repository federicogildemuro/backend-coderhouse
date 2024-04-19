import nodemailer from 'nodemailer';
import config from './config.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config.nodeMailerUser,
        pass: config.nodeMailerPass
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transport;