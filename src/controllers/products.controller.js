import ProductsServices from '../services/products.services.js';

export default class ProductsController {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProductsController();
        }
        return this.#instance;
    }

    async getProducts(req, res) {
        try {
            const queryParams = req.query;
            const payload = await ProductsServices.getInstance().getProducts(queryParams);
            req.logger.info('Consulta de productos exitosa');
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al consultar productos: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const payload = await ProductsServices.getInstance().getProductById(pid);
            if (!payload) {
                req.logger.warn(`No existe un producto con el ID ${pid}`);
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            req.logger.info(`Consulta de producto ID ${pid} exitosa`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al consultar producto ID ${pid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = req.body;
            const product = await ProductsServices.getInstance().getProductByCode(newProduct.code);
            if (product) {
                req.logger.warn(`Ya existe un producto con el código ${newProduct.code}`);
                return res.sendUserError(`Ya existe un producto con el código ${newProduct.code}`);
            }
            const payload = await ProductsServices.getInstance().createProduct(newProduct);
            req.logger.info(`Producto creado exitosamente: ${JSON.stringify(payload)}`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al crear producto: ${error.message}`);
            if (error.code === 1) {
                return res.sendUserError(`${error.message}: ${error.cause}`);
            }
            res.sendServerError(error.message);
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updatedProduct = req.body;
            let product = await ProductsServices.getInstance().getProductById(pid);
            if (!product) {
                req.logger.warn(`No existe un producto con el ID ${pid}`)
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            if (updatedProduct.code !== product.code) {
                product = await ProductsServices.getInstance().getProductByCode(updatedProduct.code);
                if (product) {
                    req.logger.warn(`Ya existe un producto con el código ${updatedProduct.code}`);
                    return res.sendUserError(`Ya existe un producto con el código ${updatedProduct.code}`);
                }
            }
            const payload = await ProductsServices.getInstance().updateProduct(pid, updatedProduct);
            req.logger.info(`Producto ID ${pid} actualizado exitosamente: ${JSON.stringify(payload)}`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al actualizar producto ID ${pid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductsServices.getInstance().getProductById(pid);
            if (!product) {
                req.logger.warn(`No existe un producto con el ID ${pid}`);
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            const payload = await ProductsServices.getInstance().deleteProduct(pid);
            req.logger.info(`Producto ID ${pid} eliminado exitosamente: ${JSON.stringify(payload)}`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al eliminar producto ID ${pid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }
}