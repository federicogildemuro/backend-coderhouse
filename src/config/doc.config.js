import __dirname from "../utils.js";
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del proyecto final del curso de Programación Backend de Coderhouse',
            version: '1.0.0',
            description: 'Definición de endpoints de la API del ecommerce'
        }
    },
    apis: [`${path.join(__dirname, '../docs/**/*.yaml')}`]
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

export default swaggerSpecs;