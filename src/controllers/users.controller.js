import UsersServices from '../services/users.services.js';
import UserWithoutPasswordDTO from '../dao/dtos/user.without.password.dto.js';
import { generateToken } from '../utils/tokens.utils.js';
import config from '../config/config.js';

export default class UsersController {
    static async getUsers(req, res) {
        try {
        } catch (error) {
        }
    }

    static async getUserById(req, res) {
        try {
        } catch (error) {
        }
    }

    static async createUser(req, res) {
        try {
        } catch (error) {
        }
    }

    static async uploadUserDocument(req, res) {
        try {
        } catch (error) {
        }
    }

    static async updateUser(req, res) {
        try {
        } catch (error) {
        }
    }

    static async changeUserRole(req, res) {
        try {
            const { uid } = req.params;
            // Se busca el usuario por su id
            const user = await UsersServices.getInstance().getUserById(uid);
            // Se cambia el rol  y se actualiza el usuario
            user.role = user.role === 'user' ? 'premium' : 'user';
            await UsersServices.getInstance().updateUser(uid, user);
            // Se elimina la contraseña del usuario y se actualiza la petición
            const UserWithoutPassword = new UserWithoutPasswordDTO(user);
            req.user = { ...UserWithoutPassword };
            // Se genera un nuevo token con el usuario actualizado y se almacena en una cookie
            const token = generateToken(req.user);
            res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
            req.logger.info(`Rol de usuario ${user.email} modificado exitosamente a ${user.role}`);
            res.sendSuccessMessage(`Rol de usuario ${user.email} modificado exitosamente a ${user.role}`);
        } catch (error) {
            req.logger.error(`Error al cambiar rol de usuario ${user.email}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async deleteUsers(req, res) {
        try {
        } catch (error) {
        }
    }

    static async deleteUser(req, res) {
        try {
        } catch (error) {
        }
    }
}