import fs from 'fs';

export default class UsersFsDAO {
    static #instance;
    url = 'src/dao/fs/data/users.json';

    constructor() {
        this.users = [];
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new UsersFsDAO();
        }
        this.#instance.users = JSON.parse(fs.readFileSync(this.#instance.url, 'utf-8'));
        return this.#instance;
    }

    getUsers(queryParams) {
        try {
            const { page } = queryParams;
            const limit = 10;
            const totalDocs = this.users.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
            const totalPages = Math.ceil(totalDocs / limit);
            const pagingCounter = (page - 1) * limit + 1;
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;
            return {
                docs: paginatedUsers,
                totalDocs,
                limit,
                totalPages,
                page,
                pagingCounter,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            };
        } catch (error) {
            throw error;
        }
    }

    getUserById(id) {
        try {
            return this.users.find(user => user._id === id);
        } catch (error) {
            throw error;
        }
    }

    getUserByEmail(email) {
        try {
            return this.users.find(user => user.email === email);
        } catch (error) {
            throw error;
        }
    }

    createUser(user) {
        try {
            const lastUser = this.users[this.users.length - 1];
            const newUser = {
                _id: lastUser?._id + 1 || 1,
                ...user,
            }
            this.users.push(newUser);
            fs.writeFileSync(this.url, JSON.stringify(this.users, null, '\t'));
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    updateUser(id, user) {
        try {
            const index = this.users.findIndex(user => user._id === id);
            if (index === -1) {
                return null;
            }
            const updatedUser = {
                _id: id,
                ...user
            }
            this.users[index] = updatedUser;
            fs.writeFileSync(this.url, JSON.stringify(this.users, null, '\t'));
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    deleteInactiveUsers() {
        try {
            const cutOffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
            const deletedUsers = this.users.filter(user => new Date(user.last_connection) < cutOffDate);
            const updatedUsers = users.filter(user => new Date(user.last_connection) >= cutOffDate);
            fs.writeFileSync(this.url, JSON.stringify(updatedUsers, null, '\t'));
            return deletedUsers;
        } catch (error) {
            throw error;
        }
    }

    deleteUser(id) {
        try {
            id = parseInt(id);
            const index = this.users.findIndex(user => user._id === id);
            const deletedUser = this.users.splice(index, 1);
            fs.writeFileSync(this.url, JSON.stringify(this.users, null, '\t'));
            return deletedUser;
        } catch (error) {
            throw error;
        }
    }
}