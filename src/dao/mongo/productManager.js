import ProductModel from '../../schemas/product.schema.js';



class ProductManager{
    constructor(){}

    async getProducts(){
        try{
            const products = await ProductModel.find();
            this.products = products;
            return this.products;
        } catch {
            return [];
        }
    };

    async getProductById(id){
        const foundProduct = await ProductModel.findById(id).lean()
        if (foundProduct){
            return foundProduct;
        } else{
            console.log('Not Found');
        };
    };

    async addProduct(body){
        try {
            const products = await ProductModel.find();
            if (products.some((item) => item.code === body.code)) {
                return console.log('The code already exists!');
            } else {
                const product = await ProductModel.create(body)
                return product;
            }
        } catch (error) {
            console.log(error);
        };
    }

    async updateProduct({id, updatedFields}) {
        try{
            await ProductModel.findByIdAndUpdate(id, updatedFields)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteProduct(id) {
        try {
            await ProductModel.deleteOne({_id: id})
        } catch (error) {
            console.log(error);
        }
    }
};

const productManager = new ProductManager();

export default productManager;