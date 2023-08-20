import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: "products",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
      default: []
});

const CartModel = mongoose.model("carts", cartSchema);
export default CartModel;