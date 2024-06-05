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

    async getUsers(queryParams) {
        try {
            const { page } = queryParams;
            return await userModel.paginate({}, { page, lean: true });
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await userModel.findById(id).lean();
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await userModel.findOne({ email }).lean();
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

    async deleteInactiveUsers() {
        try {
            /* const cutOffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); */
            const cutOffDate = new Date(Date.now() - 30 * 60 * 1000);
            const deletedUsers = await userModel.find({ last_connection: { $lt: cutOffDate } });
            await userModel.deleteMany({ last_connection: { $lt: cutOffDate } });
            return deletedUsers;
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