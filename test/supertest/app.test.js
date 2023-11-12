import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(`http://localhost:8080/api`);

describe("Testeando los recursos de mi ecommerce", () => {
  describe("Testeando Products", () => {
    let id = null;
    it("Testeando que se cree un producto y se devuelva como objeto", async () => {
      const newProduct = {
        title: "Producto 1",
        description: "Descripción del producto 1",
        price: 100,
        status: true,
        thumbnail: "image.png",
        code: 1,
        stock: 100,
      };
      const response = await requester.post("/productos").send(newProduct);
      const { _body } = response;
      id = _body.info._id;
      expect(_body).to.be.a("object");
    });
    it("Testeando que la lectura de un producto por id devuelva el producto como un objeto", async () => {
      const response = await requester.get("/productos" + id);
      const { _body } = response;
      expect(_body).to.be.a("object");
    });
    it("Testeando que la actualización de un producto devuelva el producto actualizado", async () => {
      const productUpdate = {
        title: "Producto con titulo actualizado",
        description: "Descripción actualizada del producto 1",
      };
      const response = await requester
        .put("/productos" + id)
        .send(productUpdate);
      const { _body } = response;
      expect(_body).to.be.a("object");
    });
    it("Testeando que la eliminación de un producto responda con un status 200", async () => {
      const response = await requester.delete("/productos" + id);
      expect(response.status).to.have.status(200);
    });
  });
});
