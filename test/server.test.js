import request from "supertest";
import { expect } from "chai";
import { generarProducto } from "./faker/ProductosFaker.js";

const requestST = request("http://localhost:8080/api/productos");

describe(`Test Productos Rest API`, () => {
  describe(`GET / `, () => {
    it(`Debería retornar status 200`, async () => {
      const response = await requestST.get(`/`);
      expect(response.status).to.eql(200);
    });

    it(`Debería retornar un arreglo`, async () => {
      const response = await requestST.get(`/`);
      expect(typeof response.body).to.eql(`object`);
    });

    it("Debería retornar un objeto", async () => {
      const response = await requestST.get(`/641cd64b9e17eb1d17118e04`);
      const product = response.body;
      expect(typeof product).to.eql(`object`);
      expect(product).to.include.keys(
        "title",
        "price",
        "image",
        "code",
        "stock",
        "description"
      );
      expect(product.code).to.eql("Code");
    });
  });

  describe(`POST /`, () => {
    it(`Debería agregar un producto`, async () => {
      const response = await requestST.post(`/`).send(generarProducto());
      expect(response.status).to.eql(200);
    });
  });

  describe(`DELETE / `, () => {
    it(`Debería retornar status 200`, async () => {
      const response = await requestST.delete(`/641cdab14b72f0426ba3284b`);
      expect(response.status).to.eql(200);
    });
  });
});
