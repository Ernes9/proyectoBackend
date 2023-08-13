import { randomUUID } from 'crypto';
import fs from 'fs';
import { deflate } from 'zlib';

class ProductManager{
    constructor(){
        this.path = './db/products.json';
    }

    async #saveProduct(product) {
        await fs.promises.writeFile(this.path, JSON.stringify(product));
        return product;
    }

    async getProducts(){
        try{
            const file = await fs.promises.readFile(this.path, "utf8");
            const products = JSON.parse(file);
            return products;
        } catch {
            return [];
        }
    };

    async getProductById(id){
        const products = await this.getProducts();
        const foundProduct = products.find((item) => item.id == id);
        if (foundProduct){
            return foundProduct;
        } else{
            console.log('Not Found');
        };
    };

    async addProduct({ title, description, price, thumbnail, code, stock }){
        try {
            const products = await this.getProducts();
            const product = {
                id: randomUUID(),
                title,
                description,
                price,
                status: true,
                thumbnail,
                code,
                stock,
            };
            if (products.some((item) => item.code === code)) {
                return console.log('The code already exists!');
            } else {
                products.push(product);
                await this.#saveProduct(products);
                return product;
            }
        } catch (error) {
                    console.log(error);
        };
    }

    async updateProduct({id, updatedFields}) {
        const products = await this.getProducts();
        try {
            const index = products.findIndex((item) => item.id === id);
            if (index !== -1) {
            const updatedProduct = { ...products[index], ...updatedFields };
            products[index] = updatedProduct;
            await this.#saveProduct(products);
            return updatedProduct;
            } else {
            console.log('Product not found');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((item) => item.id === id);
            if (index!== -1) {
            products.splice(index, 1);
            await this.#saveProduct(products);
            } else {
            console.log('Product not found');
            }
        } catch (error) {
            console.log(error);
        }
    }
};

const productManager = new ProductManager();

export default productManager;