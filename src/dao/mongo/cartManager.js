import CartModel from "../../schemas/cart.schema.js"

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
            const cart = await CartModel.create({products: []});
            return cart;
        } catch(e) {
            console.log(e);
        }
    }

    async getCartById(id){
        const foundCart = await CartModel.findById(id)
        .populate('products.product')
        .lean();
        
        if (foundCart){
          console.log(foundCart)
            return foundCart;
        } else{
            console.log('Not Found');
        };
    };

    async addProductInCart(cidCart, productById) {
        try {
          const filter = { _id: cidCart, "products._id": productById._id };
          const cart = await CartModel.findById(cidCart).lean();
          if (
            cart.products.find(
              (p) => p._id.toString() == productById._id.toString()
            )
          ) {
            const update = {
              $inc: { "products.$.quantity": 1 },
            };
            await CartModel.findOneAndUpdate(filter, update);
          } else {
            const update2 = {
              $push: {
                products: { _id: productById._id, quantity: productById.quantity },
              },
            };
            await CartModel.findOneAndUpdate({ _id: cidCart }, update2);
          }
          return await CartModel.findById(cidCart);
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
          console.log(quantity);
          const filter = { _id: cid, "products._id": pid };
          const cart = await CartModel.findById(cid).lean();
          if (cart.products.find((p) => p._id.toString() == pid)) {
            const update = {
              $set: { "products.$.quantity": quantity },
            };
            await CartModel.findOneAndUpdate(filter, update);
          }
    
          return await CartModel.findById(cid);
        } catch (error) {
          console.error(`Error: ${error}`);
        }
    }

    async deleteProd(cid, pid) {
        try {
          let cart = await CartModel.findById(cid).lean();
          const filter = { _id: cid, "products._id": pid };
          if (cart.products.find((p) => p.quantity > 0)) {
            const dec = {
              $inc: { "products.$.quantity": -1 },
            };
            cart = await CartModel.findOneAndUpdate(filter, dec);
          } else {
            const erase = {
              $pull: { products: { _id: pid } },
            };
            cart = await CartModel.findOneAndUpdate(filter, erase, {
              new: true,
            });
          }
    
          return cart;
        } catch (error) {
          console.log(error);
        }
      }
    

    async emptyCart(cid) {
        try {
            const cart = await CartModel.findById(cid);
            cart.products = [];
            cart.save();
            return cart;
        } catch (err) {
            console.error(err);
        }
    }

}

const cartManager = new CartManager()

export default cartManager;