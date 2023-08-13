import mongoose from "mongoose";

/* const product = {
                id: randomUUID(),
                title,
                description,
                price,
                status: true,
                thumbnail,
                code,
                stock,
            }; */

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;