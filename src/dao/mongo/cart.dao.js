import CartModel from "../../schemas/cart.schema.js";

export default class CartDAO {
  constructor() {}

  async find() {
    return await CartModel.find();
  }

  async create() {
    return await CartModel.create({ products: [] });
  }

  async getCartById(id) {
    return await CartModel.findById(id).populate("products.product").lean().exec();
  }

  async update(id, data) {
    return await CartModel.updateOne({ _id: id }, data);
  }
}
