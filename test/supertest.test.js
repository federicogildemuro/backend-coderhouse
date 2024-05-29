import * as chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js'

const expect = chai.expect;
const requester = supertest(config.frontendUrl);

describe('Test del proyecto final del curso de Programación Backend de Coderhouse', () => {
    describe('Test de products', () => {
        it('GET /api/products', async () => {
            console.log('GET /api/products');
        });

        it('GET /api/products/:pid', async () => {
            console.log('GET /api/products/:pid');
        });

        it('POST /api/products', async () => {
            console.log('POST /api/products');
        });

        it('PUT /api/products/:pid', async () => {
            console.log('PUT /api/products/:pid');
        });

        it('DELETE /api/products/:pid', async () => {
            console.log('DELETE /api/products/:pid');
        });
    });

    describe('Test de carts', () => {
        it('POST /api/carts', async () => {
            console.log('POST /api/carts');
        });

        it('GET /api/carts/:cid', async () => {
            console.log('GET /api/carts/:cid');
        });

        it('POST /api/carts/:cid/products/:pid', async () => {
            console.log('POST /api/carts/:cid/products/:pid');
        });

        it('PUT /api/carts/:cid/products/:pid', async () => {
            console.log('PUT /api/carts/:cid/products/:pid');
        });

        it('DELETE /api/carts/:cid/products/:pid', async () => {
            console.log('DELETE /api/carts/:cid/products/:pid');
        });

        it('DELETE /api/carts/:cid', async () => {
            console.log('DELETE /api/carts/:cid');
        });

        it('POST /api/carts/:cid/purchase', async () => {
            console.log('POST /api/carts/:cid/purchase');
        });
    });

    describe('Test de sessions', () => {
        it('POST /api/sessions/register', async () => {
            console.log('POST /api/sessions/register');
        });

        it('POST /api/sessions/login', async () => {
            console.log('POST /api/sessions/login');
        });

        it('GET /api/sessions/github', async () => {
            console.log('GET /api/sessions/github');
        });

        it('GET /api/sessions/githubcallback', async () => {
            console.log('GET /api/sessions/githubcallback');
        });

        it('POST /api/sessions/restore-password', async () => {
            console.log('POST /api/sessions/restore-password');
        });

        it('POST /api/sessions/reset-password', async () => {
            console.log('POST /api/sessions/reset-password');
        });

        it('PUT /api/sessions/premium/:uid', async () => {
            console.log('PUT /api/sessions/premium/:uid');
        });

        it('GET /api/sessions/current', async () => {
            console.log('GET /api/sessions/current');
        });

        it('POST /api/sessions/logout', async () => {
            console.log('POST /api/sessions/logout');
        });
    });
});