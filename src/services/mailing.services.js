import nodemailer from 'nodemailer';
import config from '../config/config.js';

export default class MailingServices {
    static #instance;

    constructor() {
        this.transport = nodemailer.createTransport({
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
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MailingServices();
        }
        return this.#instance;
    }

    async sendResetPasswordEmail(user, resetLink) {
        try {
            return await this.transport.sendMail({
                from: `Programación Backend <${config.nodeMailerUser}>`,
                to: user.email,
                subject: 'Reestablecer contraseña',
                html:
                    `<p>Hola ${user.first_name},</p>
                    <p>Para reestablecer tu contraseña, haz clic en el siguiente enlace:</p>
                    <a href="${resetLink}">Reestablecer contraseña</a>
                    <p>Si no solicitaste reestablecer tu contraseña, ignora este mensaje.</p>`
            });
        } catch (error) {
            throw error;
        }
    }
}