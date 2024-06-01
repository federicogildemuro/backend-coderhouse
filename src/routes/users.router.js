import CustomRouter from './custom.router.js';
import UsersController from '../controllers/users.controller.js';

export default class UsersRouter extends CustomRouter {
    static #instance;

    constructor() {
        super();
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new UsersRouter();
        }
        return this.#instance;
    }

    init() {
        this.get('/', ['ADMIN'], UsersController.getUsers);

        this.get('/:uid', ['USER', 'PREMIUM', 'ADMIN'], UsersController.getUserById);

        this.post('/', ['PUBLIC'], UsersController.createUser);

        this.post('/:uid/documents', ['USER', 'PREMIUM'], UsersController.uploadUserDocument);

        this.put('/:uid', ['USER', 'PREMIUM', 'ADMIN'], UsersController.updateUser);

        this.delete('/', ['ADMIN'], UsersController.deleteUsers);

        this.delete('/:uid', ['USER', 'PREMIUM', 'ADMIN'], UsersController.deleteUser);
    }
}