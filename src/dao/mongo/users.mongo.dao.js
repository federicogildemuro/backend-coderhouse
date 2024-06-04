import userModel from './models/user.model.js';

export default class UsersMongoDAO {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new UsersMongoDAO();
        }
        return this.#instance;
    }

    async getUsers() {
        try {
            return await userModel.find();
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await userModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await userModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async createUser(user) {
        try {
            return await userModel.create(user);
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, user) {
        try {
            return await userModel.findByIdAndUpdate(id, user, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteUsers() {
        try {
            // dos días
            /* const cutOffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); */
            // 30 minutos
            const cutOffDate = new Date(Date.now() - 30 * 60 * 1000);
            return await userModel.deleteMany({ last_connection: { $lt: cutOffDate } });
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            return await userModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}