import { faker } from "@faker-js/faker";

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()],
    }
}