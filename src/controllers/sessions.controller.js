import { generateToken, validateToken } from '../utils.js';
import config from '../config/config.js';
import UsersRepository from '../repositories/users.repository.js';
import MailingServices from '../services/mailing.services.js';

export default class SessionsController {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new SessionsController();
        }
        return this.#instance;
    }

    register(req, res) {
        res.sendSuccessMessage('Usuario registrado exitosamente');
    }

    login(req, res) {
        const user = req.user;
        const token = generateToken(user);
        res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
        res.sendSuccessPayload(req.user);
    }

    githubCallback(req, res) {
        const user = req.user;
        const token = generateToken(user);
        res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
        res.redirect('/products');
    }

    async restorePassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.sendUserError('El campo correo electrónico es obligatorio');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.sendUserError('El correo electrónico ingresado no es válido');
            }
            const user = await UsersRepository.getInstance().getUserByEmail(email);
            if (!user) {
                return res.sendUserError(`No existe un usuario registrado con el correo electrónico ${email}`);
            }
            const token = generateToken({ email });
            const resetLink = `${config.frontendUrl}/reset-password?token=${token}`;
            await MailingServices.getInstance().sendResetPasswordEmail(user, resetLink);
            res.sendSuccessMessage(`Se ha enviado un correo electrónico a ${user.email} con las instrucciones para restaurar tu contraseña`);
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!password) {
                return res.sendUserError('El campo contraseña es obligatorio');
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.sendUserError('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial');
            }
            const decoded = validateToken(token);
            if (!decoded) {
                return res.sendUserError('No se ha proporcionado un token válido');
            }
            const user = await UsersRepository.getInstance().getUserByEmail(decoded.email);
            if (!user) {
                return res.sendUserError('No se ha encontrado un usuario asociado al token proporcionado');
            }
            user.password = password;
            await UsersRepository.getInstance().updateUserPassword(user._id, user);
            res.sendSuccessMessage('Contraseña reestablecida exitosamente');
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    current(req, res) {
        res.sendSuccessPayload(req.user);
    }

    logout(req, res) {
        res.clearCookie('token');
        res.sendSuccessMessage('Sesión cerrada exitosamente');
    }
}