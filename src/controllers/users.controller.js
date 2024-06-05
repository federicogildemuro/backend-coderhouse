import UsersServices from '../services/users.services.js';
import UserWithoutPasswordDTO from '../dao/dtos/user.without.password.dto.js';
import { generateToken } from '../utils/tokens.utils.js';
import config from '../config/config.js';
import CartsServices from '../services/carts.services.js';
import MailingServices from '../services/mailing.services.js';

export default class UsersController {
    static async getUsers(req, res) {
        try {
            const queryParams = req.query;
            const payload = await UsersServices.getUsers(queryParams);
            // Se eliminan las contraseñas de los usuarios
            payload.docs = payload.docs.map(user => new UserWithoutPasswordDTO(user));
            req.logger.info('Consulta de usuarios exitosa');
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al consultar usuarios: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async getUserById(req, res) {
        try {
            const { uid } = req.params;
            const payload = await UsersServices.getUserById(uid);
            if (!payload) {
                req.logger.warning(`No existe un usuario con el id ${uid}`);
                return res.sendUserError(`No existe un usuario con el id ${uid}`);
            }
            req.logger.info(`Consulta del usuario id ${uid} exitosa`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al consultar usuario id ${uid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async uploadUserDocuments(req, res) {
        try {
            const { uid } = req.params;
            const documents = req.files;
            const user = await UsersServices.getUserById(uid);
            if (!user) {
                req.logger.warning(`No existe un usuario con el id ${uid}`);
                return res.sendUserError(`No existe un usuario con el id ${uid}`);
            }
            // Se recorren los documentos subidos
            Object.keys(documents).forEach(documentKey => {
                // Se obtiene el array de documentos por cada tipo
                const documentArray = documents[documentKey];
                // Se busca si el tipo de documento ya existe en el usuario
                documentArray.forEach(document => {
                    const existingDocument = user.documents.find(doc => doc.name === documentKey);
                    // Si el documento existe se actualiza la referencia, sino se agrega
                    if (existingDocument) {
                        documentKey === 'profile' ? existingDocument.reference = `uploads/profiles/${document.filename}` : `uploads/documents/${document.filename}`;
                    } else {
                        documentKey === 'profile' ? user.documents.push({
                            name: documentKey,
                            reference: `uploads/profiles/${document.filename}`
                        }) : user.documents.push({
                            name: documentKey,
                            reference: `uploads/documents/${document.filename}`
                        });
                    }
                });
            });
            // Se actualiza el usuario con los documentos subidos
            await UsersServices.updateUser(uid, user);
            // Se elimina la contraseña del usuario y se actualiza la petición
            const UserWithoutPassword = new UserWithoutPasswordDTO(user);
            req.user = { ...UserWithoutPassword };
            // Se genera un nuevo token con el usuario actualizado y se almacena en una cookie
            const token = generateToken(req.user);
            res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
            req.logger.info(`Documentos subidos exitosamente por el usuario id ${uid}`);
            res.sendSuccessPayload(user);
        } catch (error) {
            req.logger.error(`Error al subir documentos del usuario ${uid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async changeUserRole(req, res) {
        try {
            const { uid } = req.params;
            const user = await UsersServices.getUserById(uid);
            if (!user) {
                req.logger.warning(`No existe un usuario con el id ${uid}`);
                return res.sendUserError(`No existe un usuario con el id ${uid}`);
            }
            // Se verifica si el usuario es de tipo user y si ha subido los documentos necesarios para cambiar a premium
            if (user.role === 'user') {
                const documents = user.documents.map(document => document.name);
                if (!documents.includes('id') || !documents.includes('adress') || !documents.includes('account')) {
                    req.logger.warning(`No se puedo cambiar el rol del usuario id ${uid} a premium porque no ha subido los documentos necesarios`);
                    return res.sendUserError('No se puede cambiar el rol del usuario a premium si no se han subido los documentos necesarios');
                }
            }
            // Se cambia el rol del usuario y se actualiza en la base de datos
            user.role = user.role === 'user' ? 'premium' : 'user';
            await UsersServices.updateUser(uid, user);
            // Se elimina la contraseña del usuario y se actualiza la petición
            const UserWithoutPassword = new UserWithoutPasswordDTO(user);
            req.user = { ...UserWithoutPassword };
            // Se genera un nuevo token con el usuario actualizado y se almacena en una cookie
            const token = generateToken(req.user);
            res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
            req.logger.info(`Rol de usuario id ${uid} modificado exitosamente a ${user.role}`);
            res.sendSuccessPayload(user);
        } catch (error) {
            req.logger.error(`Error al cambiar rol de usuario id ${uid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async deleteInactiveUsers(req, res) {
        try {
            const deletedUsers = await UsersServices.deleteInactiveUsers();
            deletedUsers.forEach(async user => {
                await CartsServices.deleteCart(user.cart);
                await MailingServices.getInstance().sendUserDeletedEmail(user);
            });
            req.logger.info('Usuarios eliminados exitosamente');
            res.sendSuccessPayload(deletedUsers);
        } catch (error) {
            req.logger.error(`Error al eliminar usuarios: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async deleteUser(req, res) {
        try {
            const { uid } = req.params;
            const user = await UsersServices.getUserById(uid);
            if (!user) {
                req.logger.warning(`No existe un usuario con el id ${uid}`);
                return res.sendUserError(`No existe un usuario con el id ${uid}`);
            }
            const deletedUser = await UsersServices.deleteUser(uid);
            await CartsServices.deleteCart(user.cart);
            await MailingServices.getInstance().sendUserDeletedEmail(user);
            req.logger.info(`Usuario id ${uid} eliminado exitosamente`);
            res.sendSuccessPayload(deletedUser);
        } catch (error) {
            req.logger.error(`Error al eliminar usuario id ${uid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }
}