import * as ProductService from "../services/products.service.js";

export const GETAllProducts = async (req, res) => {
  const { limit = 5, page = 1, order, query } = req.query;
  const products = await ProductService.getAllProducts({
    limit,
    page,
    order,
    query,
  });
  res.send(products);
};

export const GETProductById = async (req, res) => {
  const { pid } = req.params;
  const product = await ProductService.getProductById(pid);
  res.send(product);
};

export const POSTNewProduct = async (req, res) => {
  const newProduct = req.body;
  const result = await ProductService.postNewProduct(newProduct);
  res.send(result);
};

export const PUTUpdateProduct = async (req, res) => {
  const { pid } = req.params;
  const newData = req.body;
  const product = await ProductService.putUpdateProduct(pid, newData);
  res.send(product);
};

export const DELETEProductById = async (req, res) => {
  const { pid } = req.params;
  const status = await ProductService.deleteProductById(pid);
  res.send(status);
};