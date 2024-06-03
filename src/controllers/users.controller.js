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

    static async uploadDocuments(req, res) {
        try {
            const { uid } = req.params;
            const documents = req.files;
            const user = await UsersServices.getInstance().getUserById(uid);
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
            await UsersServices.getInstance().updateUser(uid, user);
            // Se elimina la contraseña del usuario y se actualiza la petición
            const UserWithoutPassword = new UserWithoutPasswordDTO(user);
            req.user = { ...UserWithoutPassword };
            // Se genera un nuevo token con el usuario actualizado y se almacena en una cookie
            const token = generateToken(req.user);
            res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
            req.logger.info(`Documentos subidos exitosamente por el usuario ${user.email}`);
            res.sendSuccessMessage(`Documentos subidos exitosamente por el usuario ${user.email}`);
        } catch (error) {
            req.logger.error(`Error al subir documentos del usuario ${user.email}: ${error.message}`);
            res.sendServerError(error.message);
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
            const user = await UsersServices.getInstance().getUserById(uid);
            // Se verifica si el usuario es de tipo user y si ha subido los documentos necesarios para cambiar a premium
            if (user.role === 'user') {
                const documents = user.documents.map(document => document.name);
                if (!documents.includes('id') || !documents.includes('adress') || !documents.includes('account')) {
                    req.logger.warning('No se puede cambiar el rol del usuario a premium si no se han subido los documentos necesarios');
                    return res.sendUserError('No se puede cambiar el rol del usuario a premium si no ha subido su identificación, comprobante de domicilio y comprobante de estado de cuenta');
                }
            }
            // Se cambia el rol del usuario y se actualiza en la base de datos
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