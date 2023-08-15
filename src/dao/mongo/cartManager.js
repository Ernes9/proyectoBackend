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
    async updateCart(cid, prod) {
        try {
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cid },
                { products: prod }
            );
            console.log("Carrito actualizado", updatedCart);
            return updatedCart;
        } catch (error) {
            console.log(error);
        }
    }
    async updateQuantity(cid, pid, quantity) {
        try {
            const currentCart = await CartModel.findOne({_id: cid});
            const indexProduct = currentCart.products.findIndex((item) => item.product._id == pid);
            console.log(indexProduct)
            if (indexProduct !== -1) {
              currentCart.products[indexProduct].quantity = quantity;
              console.log(`Cantidad actualizada`)
              
            } else {
              return 'Product not found'
            }
            await currentCart.save()
            return currentCart;
            
          } catch (error) {
            console.error(`Error: ${error}`);
          }
    };

    async deleteProd(cid, pid) {
        try {
            let cart = await CartModel.findById(cid);
            const prodIndex = cart.products.findIndex(
                (prod) => prod.product == pid
            );
            if (cart.products[prodIndex].quantity > 1) {
                cart.products[prodIndex].quantity--;
            } else {
                cart = await CartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { product: pid } } }, { 'new': true });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.log(error)
        }
    }

    async emptyCart(cid) {
        try {
            const cart = await CartModel.findById(cid);
            cart.products = [];
            await cart.save();
            return cart;
        } catch (err) {
            console.error(err);
        }
    }

}

const cartManager = new CartManager()

export default cartManager;