import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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

productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;