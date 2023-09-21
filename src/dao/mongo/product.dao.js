import ProductModel from "../../schemas/product.schema.js";

export default class ProductDAO {
  constructor() {}

  async find({ limit, page, sortOpcion, query }) {
    return await ProductModel.paginate({}, { limit, page, sort: sortOpcion });
  }

  async findWithQuery({ limit, page, sortOpcion, query }) {
    return await ProductModel.paginate(
      { title: query },
      { limit, page, sort: sortOpcion }
    );
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }
  async create(body) {
    return await ProductModel.create(body);
  }

  async update(id, element) {
    return await ProductModel.updateOne({ _id: id }, { $set: element });
  }

  async delete(id) {
    await ProductModel.deleteOne({ _id: id });
  }
}
