import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(`http://localhost:8080/api`);
const requesterSession = supertest("http://localhost:8080/session")

let cookies;

describe("Testeando los recursos de mi ecommerce", () => {
  describe("Testeando Products", () => {
    it("INICIANDO SESIÓN PARA PODER CREAR PRODUCTO", async () => {
      const user = {
        email: "adminCoder@coder.com",
        password: "adminCod3r123"
      }
      const response = await requesterSession.post("/login").send(user)
      expect(response).to.have.property("statusCode", 200);
    })
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
      console.log(id)
      expect(_body).to.be.a("object");
    });
    it("Testeando que la lectura de un producto por id devuelva el producto como un objeto", async () => {
      const response = await requester.get("/productos/" + id);
      const { _body } = response;
      expect(_body).to.be.a("object");
    });
    it("Testeando que la actualización de un producto devuelva el producto actualizado", async () => {
      const productUpdate = {
        title: "Producto con titulo actualizado",
        description: "Descripción actualizada del producto 1",
      };
      const response = await requester
        .put("/productos/" + id)
        .send(productUpdate);
      const { _body } = response;
      expect(_body).to.be.a("object");
    });
    it("Testeando que la eliminación de un producto responda con un status 200", async () => {
      const response = await requester.delete("/productos/" + id);
      expect(response).to.have.property("statusCode", 200);
      ;
    });
    it("CERRANDO SESIÓN", async () => {
      const response = await requesterSession.get("/logout").redirects(1);
      expect(response).to.have.property("statusCode", 200);
    })
  });
  describe("Carrito", () => {
    let cartId;
    let productId = "64d94197acde9964de79f082"
    it("REGISTRANDONOS PARA PODER CREAR CARRITO", async () => {
      const newUser = {
        first_name: "NOMBRE",
        last_name: "APELLIDO", 
        username: "USERNAME", 
        email: "coder@gmail.com", 
        password: "p4ssw0rd"
      }
      
      const response = await requesterSession.post("/register").send(newUser);
      cookies = response.header['set-cookie']

      const cookie = {
        name: response.header["set-cookie"][0].split("=")[0],
        value: response.header["set-cookie"][0].split("=")[1],
      };
      
      expect(cookie.name).to.be.equals("accessToken");
    })
    it("Testeando que la creación de un carrito responda con status 200", async () => {
      const response = await requester.post("/cart").set("Cookie", cookies);
      cartId = response._body.info._id
      expect(response).to.have.property("statusCode", 200);
    })
    it("Testeando que la lectura del carrito creado nos responda con un objeto", async () => {
      const response = await requester.get("/cart/" + cartId);
      const { _body } = response;
      expect(_body).to.be.a("object");
    })
    it("Testeando que la lectura de todos los carritos devuelva los carritos en un array", async () => {
      const response = await requester.get("/cart");
      const { _body } = response;
      expect(_body.info).to.be.a("array");
    })
    it("Testeando que la creación de un producto en el carrito devuelva el carrito actualizado", async () => {
      const response = await requester.post(`/cart/${cartId}/product/${productId}`);
      const { _body } = response;
      expect(_body).to.be.a("object");
    })
    it("Testeando que la actualización de la cantidad de un producto del carrito devuelva el carrito actualizado con quantity = 2", async () => {
      const response = await requester.put(`/cart/${cartId}/product/${productId}`).send({newQuantity: 1});
      const { _body } = response;
      const productUpdated = _body.info.products.find(prod => prod.product._id == productId)

      expect(productUpdated.quantity).to.be.equals(2);
    })
    it("Testeando que la eliminación de un carrito devuelva status 200", async () => {
      const response = await requester.delete(`/cart/test/${cartId}`);
      console.log(response);
      expect(response).to.have.property("statusCode", 200);
    })
    it("CERRANDO SESIÓN", async () => {
      const response = await requesterSession.get("/logout").redirects(1);
      expect(response).to.have.property("statusCode", 200);
    })
  })
});
