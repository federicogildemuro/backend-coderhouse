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
};
let cartId;
const quantity = Math.floor(Math.random() * 10) + 1;
const updatedQuantity = Math.floor(Math.random() * 10) + 1;
updatedQuantity === quantity ? updatedQuantity + 1 : updatedQuantity; */

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
            console.log(`Error en before: ${error.message}`);
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
        /* describe('GET /api/carts/:cid', () => {
            it('Debería devolver un carrito', async () => {
                const response = await requester.get(`/api/carts/${cartId}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
        });

        describe('POST /api/carts/:cid/products/:pid', () => {
            it('Debería agregar un producto al carrito', async () => {
                const response = await requester.post(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.have.lengthOf(1);
            });
            it('Si el producto ya está en el carrito, debería incrementar la cantidad', async () => {
                const response = await requester.post(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.have.lengthOf(1);
            });
            it('Si el producto no existe, debería agregarlo al carrito', async () => {
                const response = await requester.post(`/api/carts/${cartId}/products/${existingProductId2}`).set('Cookie', token).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.have.lengthOf(2);
            });
        });

        describe('PUT /api/carts/:cid/products/:pid', () => {
            it('Debería actualizar la cantidad de un producto en el carrito', async () => {
                const response = await requester.put(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products[0].quantity).to.equal(updatedQuantity);
            });
        });

        describe('DELETE /api/carts/:cid/products/:pid', () => {
            it('Debería eliminar un producto del carrito', async () => {
                await requester.post(`/api/carts/${cartId}/products/${existingProductId2}`).set('Cookie', token).send({ quantity: quantity });
                const response = await requester.delete(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.not.include({ _id: existingProductId1 });
            });
        });

        describe('DELETE /api/carts/:cid', () => {
            it('Debería vaciar un carrito', async () => {
                const response = await requester.delete(`/api/carts/${cartId}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.be.empty;
            });
        }); */
    });

    describe('Test de Users', () => {
        /* describe('POST /api/sessions/register', () => {
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
        }); */
    });
});