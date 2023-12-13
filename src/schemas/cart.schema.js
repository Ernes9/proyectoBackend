import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
      type: [
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
    }
      
});

// cartSchema.pre("find", function () {
//   this.populate("products.product");
// });

// cartSchema.pre("findOne", function () {
//   this.populate("products.product");
// });

// cartSchema.pre("findOneAndUpdate", function () {
//   this.populate("products.product");
// });

const CartModel = mongoose.model("carts", cartSchema);
export default CartModel;