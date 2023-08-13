import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: []
    },
});

const CartModel = mongoose.model("carts", cartSchema);
export default CartModel;