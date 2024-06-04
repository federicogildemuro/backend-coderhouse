import { createHash } from '../utils/passwords.utils.js';
import CartsServices from './carts.services.js';
import UserDTO from '../dao/dtos/user.dto.js';
import { Users } from '../dao/factory.js';

export default class UsersServices {
    static async getUsers() {
        try {
            return await Users.getInstance().getUsers();
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id) {
        try {
            return await Users.getInstance().getUserById(id);
        } catch (error) {
            throw error;
        }
    }

    static async getUserByEmail(email) {
        try {
            return await Users.getInstance().getUserByEmail(email);
        } catch (error) {
            throw error;
        }
    }

    static async createUser(user) {
        try {
            // Se valida si el usuario tiene una contraseña y si la tiene, se encripta
            if (user.password && user.password.length > 0) {
                user.password = createHash(user.password);
            }
            // Se crea un carrito para el usuario y se le asigna
            const cart = await CartsServices.createCart();
            user.cart = cart._id;
            const newUser = new UserDTO(user);
            return await Users.getInstance().createUser(newUser);
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(id, user) {
        try {
            const updatedUser = new UserDTO(user);
            return await Users.getInstance().updateUser(id, updatedUser);
        } catch (error) {
            throw error;
        }
    }

    static async updateUserPassword(id, user) {
        try {
            if (user.password && user.password.length > 0) {
                user.password = createHash(user.password);
            }
            const updatedUser = new UserDTO(user);
            return await Users.getInstance().updateUser(id, updatedUser);
        } catch (error) {
            throw error;
        }
    }

    static async deleteUsers() {
        try {
            return await Users.getInstance().deleteUsers();
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            return await Users.getInstance().deleteUser(id);
        } catch (error) {
            throw error;
        }
    }
}