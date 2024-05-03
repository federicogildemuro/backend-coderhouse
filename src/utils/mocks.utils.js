import { faker } from '@faker-js/faker/locale/es';

const generateFakerProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: `${faker.string.alpha({ length: 3, casing: 'upper', })}${faker.number.int(9)}${faker.number.int(9)}${faker.number.int(9)}`,
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ min: 10, max: 1000 }),
        category: faker.commerce.department(),
        thumbnails: [faker.image.url(), faker.image.url()]
    };
}

export { generateFakerProduct };