import * as chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';

const expect = chai.expect;
const requester = supertest(config.frontendUrl);

// Variables globales para los tests
// Before
let userToken;
let premiumToken;
let adminToken;
// Products
let existingProductId1;
let existingProductId2;
const unexistingProductId = '60b7b3b3b3b3b3b3b3b3b3b3';
const newProduct = {
    title: 'Producto de prueba premium',
    code: 'PDPP',
    price: 100,
    stock: 10,
    owner: 'fgildemuro@hotmail.com'
};
let newProductId;
const newAdminProduct = {
    title: 'Producto de prueba admin',
    code: 'PDPA',
    price: 100,
};
let newAdminProductId;
const updatedProduct = {
    title: 'Producto de prueba premium actualizado',
    code: 'PDPP',
    price: 100,
    owner: 'fgildemuro@hotmail.com'
};
const updatedAdminProduct = {
    title: 'Producto de prueba admin actualizado',
    code: 'PDPA',
    price: 100,
};
const productWithoutTitle = {
    code: 'PDPP',
    price: 100
};
const productWithoutCode = {
    title: 'Producto de prueba',
    price: 100
};
const productWithoutPrice = {
    title: 'Producto de prueba',
    code: 'PDPP'
};
let userCartId = '6660d81a2a9abd672389746b';
let premiumCartId = '6660d80a2a9abd6723897466';
let unexistingCartId = '60b7b3b3b3b3b3b3b3b3b3b3';
let newCartId;
const quantity = Math.floor(Math.random() * 10) + 1;
const updatedQuantity = Math.floor(Math.random() * 10) + 1;
updatedQuantity === quantity ? updatedQuantity + 1 : updatedQuantity;

/* let userId;
let userEmail;
const validEmail = 'user@mail.com';
const invalidEmail = 'email';
const validPassword = 'Password123!';
const invalidPassword = 'password';
const newUser = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: validEmail,
    password: validPassword
};
const userWithoutFirstName = {
    last_name: 'user_last_name',
    email: validEmail,
    password: validPassword
};
const userWithoutLastName = {
    first_name: 'user_first_name',
    email: validEmail,
    password: validPassword
};
const userWithoutEmail = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    password: validPassword
};
const userWithoutPassword = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: validEmail
};
const userWithInvalidEmail = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: invalidEmail,
    password: validPassword
};
const userWithInvalidPassword = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: validEmail,
    password: invalidPassword
};
const unregisteredUser = {
    email: 'unregistered@mail.com',
    password: 'unregistered'
}; */

describe('Test del proyecto final del curso de Programación Backend de Coderhouse', () => {
    before(async () => {
        try {
            let response = await requester.post('/api/sessions/login').send({ email: 'fgildemuro@hotmail.com', password: 'Fede1066$' });
            let cookies = response.headers['set-cookie'];
            premiumToken = cookies.find(cookie => cookie.startsWith('token='));
            response = await requester.post('/api/sessions/login').send({ email: 'hector@mail.com', password: 'Fede1066$' });
            cookies = response.headers['set-cookie'];
            userToken = cookies.find(cookie => cookie.startsWith('token='));
            response = await requester.post('/api/sessions/login').send({ email: config.adminEmail, password: config.adminPassword });
            cookies = response.headers['set-cookie'];
            adminToken = cookies.find(cookie => cookie.startsWith('token='));
        } catch (error) {
            console.log(`Error en before general: ${error.message}`);
        }
    });

    describe('Test de Products', () => {
        describe('GET /api/products', () => {
            it('Debería devolver un array de productos sin estar logueado', async () => {
                const response = await requester.get('/api/products');
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(Array.isArray(response.body.payload.docs)).to.be.true;
                existingProductId1 = response.body.payload.docs[0]._id;
                existingProductId2 = response.body.payload.docs[1]._id;
            });
            it('Debería devolver un array de productos logueado como user', async () => {
                const response = await requester.get('/api/products').set('Cookie', userToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(Array.isArray(response.body.payload.docs)).to.be.true;
            });
            it('Debería devolver un array de productos logueado como premium', async () => {
                const response = await requester.get('/api/products').set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(Array.isArray(response.body.payload.docs)).to.be.true;
            });
            it('Debería devolver un array de productos logueado como admin', async () => {
                const response = await requester.get('/api/products').set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(Array.isArray(response.body.payload.docs)).to.be.true;
            });
        });

        describe('GET /api/products/:pid', () => {
            it('Debería devolver un producto sin estar logueado', async () => {
                const response = await requester.get(`/api/products/${existingProductId1}`);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('Debería devolver un producto logueado como user', async () => {
                const response = await requester.get(`/api/products/${existingProductId1}`).set('Cookie', userToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('Debería devolver un producto logueado como premium', async () => {
                const response = await requester.get(`/api/products/${existingProductId1}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('Debería devolver un producto logueado como admin', async () => {
                const response = await requester.get(`/api/products/${existingProductId1}`).set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería devolver un producto inexistente sin estar logueado', async () => {
                const response = await requester.get(`/api/products/${unexistingProductId}`);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería devolver un producto inexistente logueado como user', async () => {
                const response = await requester.get(`/api/products/${unexistingProductId}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería devolver un producto inexistente logueado como premium', async () => {
                const response = await requester.get(`/api/products/${unexistingProductId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería devolver un producto inexistente logueado como admin', async () => {
                const response = await requester.get(`/api/products/${unexistingProductId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('POST /api/products', () => {
            it('No debería crear un producto sin estar logueado', async () => {
                const response = await requester.post('/api/products').send(newProduct);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto logueado como user', async () => {
                const response = await requester.post('/api/products').set('Cookie', userToken).send(newProduct);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('Debería crear un producto logueado como premium', async () => {
                const response = await requester.post('/api/products').set('Cookie', premiumToken).send(newProduct);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload._id).to.not.be.null;
                newProductId = response.body.payload._id;
            });
            it('Debería crear un producto logueado como admin', async () => {
                const response = await requester.post('/api/products').set('Cookie', adminToken).send(newAdminProduct);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload._id).to.not.be.null;
                newAdminProductId = response.body.payload._id;
            });
            it('No debería crear un producto sin título logueado como premium', async () => {
                const response = await requester.post('/api/products').set('Cookie', premiumToken).send(productWithoutTitle);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto sin código logueado como premium', async () => {
                const response = await requester.post('/api/products').set('Cookie', premiumToken).send(productWithoutCode);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto sin precio logueado como premium', async () => {
                const response = await requester.post('/api/products').set('Cookie', premiumToken).send(productWithoutPrice);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto con código repetido logueado como premium', async () => {
                const response = await requester.post('/api/products').set('Cookie', premiumToken).send(newProduct);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto sin título logueado como admin', async () => {
                const response = await requester.post('/api/products').set('Cookie', adminToken).send(productWithoutTitle);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto sin código logueado como admin', async () => {
                const response = await requester.post('/api/products').set('Cookie', adminToken).send(productWithoutCode);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto sin precio logueado como admin', async () => {
                const response = await requester.post('/api/products').set('Cookie', adminToken).send(productWithoutPrice);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto con código repetido logueado como admin', async () => {
                const response = await requester.post('/api/products').set('Cookie', adminToken).send(newAdminProduct);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('PUT /api/products/:pid', () => {
            it('No debería actualizar un producto sin estar logueado', async () => {
                const response = await requester.put(`/api/products/${newProductId}`).send(updatedProduct);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto logueado como user', async () => {
                const response = await requester.put(`/api/products/${newProductId}`).set('Cookie', userToken).send(updatedProduct);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('Debería actualizar un producto logueado como premium', async () => {
                const response = await requester.put(`/api/products/${newProductId}`).set('Cookie', premiumToken).send(updatedProduct);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('Debería actualizar un producto logueado como admin', async () => {
                const response = await requester.put(`/api/products/${newAdminProductId}`).set('Cookie', adminToken).send(updatedAdminProduct);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería actualizar un producto inexistente logueado como premium', async () => {
                const response = await requester.put(`/api/products/${unexistingProductId}`).set('Cookie', premiumToken).send(updatedProduct);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto inexistente logueado como admin', async () => {
                const response = await requester.put(`/api/products/${unexistingProductId}`).set('Cookie', adminToken).send(updatedAdminProduct);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin título logueado como premium', async () => {
                const response = await requester.put(`/api/products/${newProductId}`).set('Cookie', premiumToken).send(productWithoutTitle);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin código logueado como premium', async () => {
                const response = await requester.put(`/api/products/${newProductId}`).set('Cookie', premiumToken).send(productWithoutCode);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin precio logueado como premium', async () => {
                const response = await requester.put(`/api/products/${newProductId}`).set('Cookie', premiumToken).send(productWithoutPrice);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto con código repetido logueado como premium', async () => {
                const response = await requester.put(`/api/products/${newProductId}`).set('Cookie', premiumToken).send(newAdminProduct);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto logueado como premium si no es el dueño', async () => {
                const response = await requester.put(`/api/products/${newAdminProductId}`).set('Cookie', premiumToken).send(updatedAdminProduct);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin título logueado como admin', async () => {
                const response = await requester.put(`/api/products/${newAdminProductId}`).set('Cookie', adminToken).send(productWithoutTitle);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin código logueado como admin', async () => {
                const response = await requester.put(`/api/products/${newAdminProductId}`).set('Cookie', adminToken).send(productWithoutCode);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin precio logueado como admin', async () => {
                const response = await requester.put(`/api/products/${newAdminProductId}`).set('Cookie', adminToken).send(productWithoutPrice);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('DELETE /api/products/:pid', () => {
            it('No debería eliminar un producto sin estar logueado', async () => {
                const response = await requester.delete(`/api/products/${newProductId}`);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto logueado como user', async () => {
                const response = await requester.delete(`/api/products/${newProductId}`).set('Cookie', userToken);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('Debería eliminar un producto logueado como premium', async () => {
                const response = await requester.delete(`/api/products/${newProductId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería eliminar un producto logueado como premium si no es el dueño', async () => {
                const response = await requester.delete(`/api/products/${newAdminProductId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('Debería eliminar un producto logueado como admin', async () => {
                const response = await requester.delete(`/api/products/${newAdminProductId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería eliminar un producto inexistente logueado como premium', async () => {
                const response = await requester.delete(`/api/products/${unexistingProductId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto inexistente logueado como admin', async () => {
                const response = await requester.delete(`/api/products/${unexistingProductId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });
    });

    describe('Test de Carts', () => {
        before(async () => {
            try {
                let response = await requester.post('/api/products').set('Cookie', premiumToken).send(newProduct);
                newProductId = response.body.payload._id;
            } catch (error) {
                console.log(`Error en before de carts: ${error.message}`);
            }
        });

        describe('GET /api/carts/:cid', () => {
            it('No debería devolver un carrito sin estar logueado', async () => {
                const response = await requester.get(`/api/carts/${userCartId}`);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('Debería devolver un carrito logueado como user', async () => {
                const response = await requester.get(`/api/carts/${userCartId}`).set('Cookie', userToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload._id).to.equal(userCartId);
            });
            it('Debería devolver un carrito logueado como premium', async () => {
                const response = await requester.get(`/api/carts/${premiumCartId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload._id).to.equal(premiumCartId);
            });
            it('Debería devolver un carrito logueado como admin', async () => {
                const response = await requester.get(`/api/carts/${userCartId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload._id).to.equal(userCartId);
            });
            it('No debería devolver un carrito que no le pertenece logueado como user', async () => {
                const response = await requester.get(`/api/carts/${premiumCartId}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería devolver un carrito que no le pertenece logueado como premium', async () => {
                const response = await requester.get(`/api/carts/${userCartId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería devolver un carrito inexistente logueado como user', async () => {
                const response = await requester.get(`/api/carts/${unexistingCartId}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería devolver un carrito inexistente logueado como premium', async () => {
                const response = await requester.get(`/api/carts/${unexistingCartId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería devolver un carrito inexistente logueado como admin', async () => {
                const response = await requester.get(`/api/carts/${unexistingCartId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('POST /api/carts', () => {
            it('No debería crear un carrito sin estar logueado', async () => {
                const response = await requester.post('/api/carts');
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un carrito logueado como user', async () => {
                const response = await requester.post('/api/carts').set('Cookie', userToken);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un carrito logueado como premium', async () => {
                const response = await requester.post('/api/carts').set('Cookie', premiumToken);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('Debería crear un carrito logueado como admin', async () => {
                const response = await requester.post('/api/carts').set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload._id).to.not.be.null;
                expect(response.body.payload.products).to.be.an('array').that.is.empty;
                newCartId = response.body.payload._id;
            });
        });

        describe('POST /api/carts/:cid/products/:pid', () => {
            it('No debería agregar un producto a un carrito sin estar logueado', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/products/${existingProductId1}`).send({ quantity: quantity });
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('Debería agregar un producto a un carrito logueado como user', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/products/${existingProductId1}`).set('Cookie', userToken).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const product = products.find(p => p.product === existingProductId1);
                expect(product.product).to.equal(existingProductId1);
            });
            it('Debería agregar un producto a un carrito logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/products/${existingProductId1}`).set('Cookie', premiumToken).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const product = products.find(p => p.product === existingProductId1);
                expect(product.product).to.equal(existingProductId1);
            });
            it('Debería agregar un producto a un carrito logueado como admin', async () => {
                const response = await requester.post(`/api/carts/${newCartId}/products/${existingProductId1}`).set('Cookie', adminToken).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const product = products.find(p => p.product === existingProductId1);
                expect(product.product).to.equal(existingProductId1);
            });
            it('No debería agregar un producto a un carrito que no le pertenece logueado como user', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/products/${existingProductId1}`).set('Cookie', userToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto a un carrito que no le pertenece logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/products/${existingProductId1}`).set('Cookie', premiumToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto a un carrito inexistente logueado como user', async () => {
                const response = await requester.post(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', userToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto a un carrito inexistente logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', premiumToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto a un carrito inexistente logueado como admin', async () => {
                const response = await requester.post(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', adminToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto inexistente a un carrito logueado como user', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/products/${unexistingProductId}`).set('Cookie', userToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto inexistente a un carrito logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/products/${unexistingProductId}`).set('Cookie', premiumToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto inexistente a un carrito logueado como admin', async () => {
                const response = await requester.post(`/api/carts/${newCartId}/products/${unexistingProductId}`).set('Cookie', adminToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería agregar un producto que le pertenece logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/products/${newProductId}`).set('Cookie', premiumToken).send({ quantity: quantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('PUT /api/carts/:cid/products/:pid', () => {
            it('No debería actualizar la cantidad de un producto en un carrito sin estar logueado', async () => {
                const response = await requester.put(`/api/carts/${userCartId}/products/${existingProductId1}`).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('Debería actualizar la cantidad de un producto en un carrito logueado como user', async () => {
                const response = await requester.put(`/api/carts/${userCartId}/products/${existingProductId1}`).set('Cookie', userToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const product = products.find(p => p.product === existingProductId1);
                expect(product.quantity).to.equal(updatedQuantity);
            });
            it('Debería actualizar la cantidad de un producto en un carrito logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${premiumCartId}/products/${existingProductId1}`).set('Cookie', premiumToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const product = products.find(p => p.product === existingProductId1);
                expect(product.quantity).to.equal(updatedQuantity);
            });
            it('Debería actualizar la cantidad de un producto en un carrito logueado como admin', async () => {
                const response = await requester.put(`/api/carts/${newCartId}/products/${existingProductId1}`).set('Cookie', adminToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const product = products.find(p => p.product === existingProductId1);
                expect(product.quantity).to.equal(updatedQuantity);
            });
            it('No debería actualizar la cantidad de un producto en un carrito que no le pertenece logueado como user', async () => {
                const response = await requester.put(`/api/carts/${premiumCartId}/products/${existingProductId1}`).set('Cookie', userToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto en un carrito que no le pertenece logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${userCartId}/products/${existingProductId1}`).set('Cookie', premiumToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto en un carrito inexistente logueado como user', async () => {
                const response = await requester.put(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', userToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto en un carrito inexistente logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', premiumToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto en un carrito inexistente logueado como admin', async () => {
                const response = await requester.put(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', adminToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto inexistente en un carrito logueado como user', async () => {
                const response = await requester.put(`/api/carts/${userCartId}/products/${unexistingProductId}`).set('Cookie', userToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto inexistente en un carrito logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${premiumCartId}/products/${unexistingProductId}`).set('Cookie', premiumToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto inexistente en un carrito logueado como admin', async () => {
                const response = await requester.put(`/api/carts/${newCartId}/products/${unexistingProductId}`).set('Cookie', adminToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto que no se encuentra en el carrito logueado como user', async () => {
                const response = await requester.put(`/api/carts/${userCartId}/products/${existingProductId2}`).set('Cookie', userToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto que no se encuentra en el carrito logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${premiumCartId}/products/${existingProductId2}`).set('Cookie', premiumToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar la cantidad de un producto que no se encuentra en el carrito logueado como admin', async () => {
                const response = await requester.put(`/api/carts/${newCartId}/products/${existingProductId2}`).set('Cookie', adminToken).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('DELETE /api/carts/:cid/products/:pid', () => {
            it('No debería eliminar un producto de un carrito sin estar logueado', async () => {
                const response = await requester.delete(`/api/carts/${userCartId}/products/${existingProductId1}`);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('Debería eliminar un producto de un carrito logueado como user', async () => {
                const response = await requester.delete(`/api/carts/${userCartId}/products/${existingProductId1}`).set('Cookie', userToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const productExists = products.some(p => p.product._id === existingProductId1);
                expect(productExists).to.be.false;
            });
            it('Debería eliminar un producto de un carrito logueado como premium', async () => {
                const response = await requester.delete(`/api/carts/${premiumCartId}/products/${existingProductId1}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const productExists = products.some(p => p.product._id === existingProductId1);
                expect(productExists).to.be.false;
            });
            it('Debería eliminar un producto de un carrito logueado como admin', async () => {
                const response = await requester.delete(`/api/carts/${newCartId}/products/${existingProductId1}`).set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const { products } = response.body.payload;
                const productExists = products.some(p => p.product._id === existingProductId1);
                expect(productExists).to.be.false;
            });
            it('No debería eliminar un producto de un carrito que no le pertenece logueado como user', async () => {
                const response = await requester.delete(`/api/carts/${premiumCartId}/products/${existingProductId1}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto de un carrito que no le pertenece logueado como premium', async () => {
                const response = await requester.delete(`/api/carts/${userCartId}/products/${existingProductId1}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto de un carrito inexistente logueado como user', async () => {
                const response = await requester.delete(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto de un carrito inexistente logueado como premium', async () => {
                const response = await requester.delete(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto de un carrito inexistente logueado como admin', async () => {
                const response = await requester.delete(`/api/carts/${unexistingCartId}/products/${existingProductId1}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto inexistente de un carrito logueado como user', async () => {
                const response = await requester.delete(`/api/carts/${userCartId}/products/${unexistingProductId}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto inexistente de un carrito logueado como premium', async () => {
                const response = await requester.delete(`/api/carts/${premiumCartId}/products/${unexistingProductId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto inexistente de un carrito logueado como admin', async () => {
                const response = await requester.delete(`/api/carts/${newCartId}/products/${unexistingProductId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto que no se encuentra en el carrito logueado como user', async () => {
                const response = await requester.delete(`/api/carts/${userCartId}/products/${existingProductId2}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto que no se encuentra en el carrito logueado como premium', async () => {
                const response = await requester.delete(`/api/carts/${premiumCartId}/products/${existingProductId2}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un producto que no se encuentra en el carrito logueado como admin', async () => {
                const response = await requester.delete(`/api/carts/${newCartId}/products/${existingProductId2}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('PUT /api/carts/:cid', () => {
            before(async () => {
                try {
                    await requester.post(`/api/carts/${userCartId}/products/${existingProductId1}`).set('Cookie', userToken).send({ quantity: quantity });
                    await requester.post(`/api/carts/${premiumCartId}/products/${existingProductId1}`).set('Cookie', premiumToken).send({ quantity: quantity });
                    await requester.post(`/api/carts/${newCartId}/products/${existingProductId1}`).set('Cookie', adminToken).send({ quantity: quantity });
                } catch (error) {
                    console.log(`Error en before de PUT /api/carts/:cid: ${error.message}`);
                }
            });
            it('No debería vaciar un carrito sin estar logueado', async () => {
                const response = await requester.put(`/api/carts/${newCartId}`);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('Debería vaciar un carrito logueado como user', async () => {
                const response = await requester.put(`/api/carts/${userCartId}`).set('Cookie', userToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.be.empty;
            });
            it('Debería vaciar un carrito logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${premiumCartId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.be.empty;
            });
            it('Debería vaciar un carrito logueado como admin', async () => {
                const response = await requester.put(`/api/carts/${newCartId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.be.empty;
            });
            it('No debería vaciar un carrito que no le pertenece logueado como user', async () => {
                const response = await requester.put(`/api/carts/${premiumCartId}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería vaciar un carrito que no le pertenece logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${userCartId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería vaciar un carrito inexistente logueado como user', async () => {
                const response = await requester.put(`/api/carts/${unexistingCartId}`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería vaciar un carrito inexistente logueado como premium', async () => {
                const response = await requester.put(`/api/carts/${unexistingCartId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería vaciar un carrito inexistente logueado como admin', async () => {
                const response = await requester.put(`/api/carts/${unexistingCartId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('POST /api/carts/:cid/purchase', () => {
            it('No debería realizar una compra sin estar logueado', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/purchase`);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('Debería realizar una compra logueado como user', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/purchase`).set('Cookie', userToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('Debería realizar una compra logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/purchase`).set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería realizar una compra logueado como admin', async () => {
                const response = await requester.post(`/api/carts/${newCartId}/purchase`).set('Cookie', adminToken);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('No debería realizar una compra de un carrito inexistente logueado como user', async () => {
                const response = await requester.post(`/api/carts/${unexistingCartId}/purchase`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería realizar una compra de un carrito inexistente logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${unexistingCartId}/purchase`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería realizar una compra de un carrito que no le pertenece logueado como user', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/purchase`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería realizar una compra de un carrito que no le pertenece logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/purchase`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería realizar una compra de un carrito que contiene productos sin stock logueado como user', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/purchase`).set('Cookie', userToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería realizar una compra de un carrito que contiene productos sin stock logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/purchase`).set('Cookie', premiumToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('Debería realizar parcialmente una compra de un carrito que contiene productos sin stock logueado como user', async () => {
                const response = await requester.post(`/api/carts/${userCartId}/purchase`).set('Cookie', userToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('Debería realizar parcialmente una compra de un carrito que contiene productos sin stock logueado como premium', async () => {
                const response = await requester.post(`/api/carts/${premiumCartId}/purchase`).set('Cookie', premiumToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
        });

        describe('DELETE /api/carts/:cid', () => {
            it('No debería eliminar un carrito sin estar logueado', async () => {
                const response = await requester.delete(`/api/carts/${newCartId}`);
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un carrito logueado como user', async () => {
                const response = await requester.delete(`/api/carts/${userCartId}`).set('Cookie', userToken);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('No debería eliminar un carrito logueado como premium', async () => {
                const response = await requester.delete(`/api/carts/${premiumCartId}`).set('Cookie', premiumToken);
                expect(response.status).to.equal(403);
                expect(response.body.status).to.equal('error');
            });
            it('Debería eliminar un carrito logueado como admin', async () => {
                const response = await requester.delete(`/api/carts/${newCartId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería eliminar un carrito inexistente logueado como admin', async () => {
                const response = await requester.delete(`/api/carts/${unexistingCartId}`).set('Cookie', adminToken);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        after(async () => {
            try {
                await requester.delete(`/api/products/${newProductId}`).set('Cookie', adminToken);
            } catch (error) {
                console.log(`Error en after de carts: ${error.message}`);
            }
        });
    });

    /* describe('Test de Users', () => {
        describe('POST /api/sessions/register', () => {
            it('Debería crear un usuario', async () => {
                const response = await requester.post('/api/sessions/register').send(newUser);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería crear un usuario con correo electrónico repetido', async () => {
                const response = await requester.post('/api/sessions/register').send(newUser);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin nombre', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutFirstName);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin apellido', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutLastName);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin correo electrónico', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutEmail);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin contraseña', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutPassword);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario con correo electrónico inválido', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithInvalidEmail);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario con contraseña inválida', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithInvalidPassword);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('POST /api/sessions/login', () => {
            it('Debería iniciar sesión con un usuario registrado, generar un token y almacenarlo en una cookie', async () => {
                const response = await requester.post('/api/sessions/login').send({ email: newUser.email, password: newUser.password });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const cookies = response.headers['set-cookie'];
                expect(cookies).to.not.be.undefined;
                token = cookies.find(cookie => cookie.startsWith('token='));
                expect(token).to.not.be.undefined;
            });
            it('No debería iniciar sesión con un usuario no registrado', async () => {
                const response = await requester.post('/api/sessions/login').send({ email: unregisteredUser.email, password: unregisteredUser.password });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería iniciar sesión con una contraseña incorrecta', async () => {
                const response = await requester.post('/api/sessions/login').send({ email: newUser.email, password: unregisteredUser.password });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });


        describe('GET /api/sessions/current', () => {
            it('Debería devolver el usuario autenticado', async () => {
                const response = await requester.get('/api/sessions/current').set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                userId = response.body.payload._id;
                userEmail = response.body.payload.email;
                cartId = response.body.payload.cart;
            });
            it('No debería devolver el usuario si no está autenticado', async () => {
                const response = await requester.get('/api/sessions/current');
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('PUT /api/sessions/premium/:userId', () => {
            it('Debería cambiar el rol de un usuario comun a premium y viceversa', async () => {
                const response = await requester.put(`/api/sessions/premium/${userId}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const cookies = response.headers['set-cookie'];
                token = cookies.find(cookie => cookie.startsWith('token='));
            });
        });

        describe('POST /api/sessions/logout', () => {
            it('Debería cerrar la sesión de un usuario autenticado', async () => {
                const response = await requester.post('/api/sessions/logout').set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería cerrar la sesión de un usuario si no está autenticado', async () => {
                const response = await requester.post('/api/sessions/logout');
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
        });
    }); */
});