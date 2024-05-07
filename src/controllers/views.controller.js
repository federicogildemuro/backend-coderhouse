import ProductsServices from '../services/products.services.js';
import CartsServices from '../services/carts.services.js';
import { generateFakerProduct } from '../utils/mocks.utils.js';

export default class ViewsController {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ViewsController();
        }
        return this.#instance;
    }

    renderIndex(req, res) {
        res.render('general/index');
    }

    renderLogin(req, res) {
        res.render('general/login');
    }

    renderRegister(req, res) {
        res.render('general/register');
    }

    renderRestorePassword(req, res) {
        res.render('general/restore-password');
    }

    renderResetPassword(req, res) {
        const { token } = req.query;
        res.render('general/reset-password', { token });
    }

    async renderProducts(req, res) {
        try {
            const queryParams = req.query;
            const user = req.user;
            const payload = await ProductsServices.getInstance().getProducts(queryParams);
            const { docs: products, ...pagination } = payload;
            // Se generan los enlaces de paginación
            const baseUrl = '/products';
            if (pagination.hasPrevPage) {
                pagination.prevLink = `${baseUrl}?${new URLSearchParams({ ...queryParams, page: pagination.page - 1 }).toString()}`;
            }
            if (pagination.hasNextPage) {
                pagination.nextLink = `${baseUrl}?${new URLSearchParams({ ...queryParams, page: pagination.page + 1 }).toString()}`;
            }
            res.render('user/products', { user, products, pagination });
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    async renderProduct(req, res) {
        try {
            const { pid } = req.params;
            const user = req.user;
            const product = await ProductsServices.getInstance().getProductById(pid);
            res.render('user/product', { user, product });
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    async renderCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartsServices.getInstance().getCartById(cid);
            // Se calcula el total de cada producto
            cart.products = cart.products.map(product => {
                return {
                    ...product,
                    total: product.product.price * product.quantity
                };
            });
            // Se calcula el total del carrito
            cart.total = cart.products.reduce((acc, product) => acc + product.total, 0).toFixed(2);
            res.render('user/cart', { cart });
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    renderProfile(req, res) {
        const user = req.user;
        res.render('user/profile', { user });
    }

    renderChat(req, res) {
        const user = req.user;
        res.render('user/chat', { user });
    }

    async renderAdminProducts(req, res) {
        try {
            const queryParams = req.query;
            const user = req.user;
            const payload = await ProductsServices.getInstance().getProducts(queryParams);
            const { docs: products, ...pagination } = payload;
            // Se generan los enlaces de paginación
            const baseUrl = '/admin/products';
            if (pagination.hasPrevPage) {
                pagination.prevLink = `${baseUrl}?${new URLSearchParams({ ...queryParams, page: pagination.page - 1 }).toString()}`;
            }
            if (pagination.hasNextPage) {
                pagination.nextLink = `${baseUrl}?${new URLSearchParams({ ...queryParams, page: pagination.page + 1 }).toString()}`;
            }
            res.render('admin/products', { user, products, pagination });
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    async renderAdminProduct(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductsServices.getInstance().getProductById(pid);
            res.render('admin/product', { product });
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    renderAdminAddProduct(req, res) {
        res.render('admin/add-product');
    }

    async renderAdminEditProduct(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductsServices.getInstance().getProductById(pid);
            res.render('admin/edit-product', { product });
        } catch (error) {
            req.logger.error(error);
            res.sendServerError(error.message);
        }
    }

    showMockingProducts(req, res) {
        const products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateFakerProduct());
        }
        res.json(products);
    }

    showLoggerTest(req, res) {
        req.logger.fatal('Este es un mensaje fatal');
        req.logger.error('Este es un mensaje de error');
        req.logger.warninging('Este es un mensaje de advertencia');
        req.logger.info('Este es un mensaje de información');
        req.logger.http('Este es un mensaje HTTP');
        req.logger.debug('Este es un mensaje de depuración');
        res.send('Mensajes de registro enviados');
    }

    renderNotFound(req, res) {
        res.redirect('/');
    }
}