import { randomUUID } from "crypto";
import CartModel from "../../schemas/cart.schema.js"
import ProductModel from "../../schemas/product.schema.js";

class CartManager{
    constructor(){}

    async getCarts() {
        try{
            const carts = await CartModel.find();
            return carts;
        } catch{
            return [];
        }

    }

    async addCart() {
        try{
            const cart = await CartModel.create();
            return cart._id;
        } catch(e) {
            console.log(e);
        }
    }

    async getCartById(id){
        const foundCart = await CartModel.findOne({_id: id})
        if (foundCart){
            return foundCart;
        } else{
            console.log('Not Found');
        };
    };

    async addProductInCart(cartId, prodId) {
        try {
            const foundProduct = await ProductModel.findOne({_id: prodId});
            if (!foundProduct){
                console.log("El producto no existe")
                return;
            } else {
                const productIndex = await ProductModel.findOne({_id: prodId}, {_id: 1})
                if (productIndex !== -1) {
                    const productToUpdate = `products.${productIndex}.quantity`;
                    await CartModel.findOneAndUpdate({ _id: cartId }, { $inc: { [productToUpdate]: 1 } });
                } else {
                    await CartModel.findOneAndUpdate({ _id: cartId }, { $push: { products: { id: prodId, quantity: 1 } } });
                }
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }
}

const cartManager = new CartManager()

export default cartManager;