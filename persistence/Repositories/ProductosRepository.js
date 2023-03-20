import ProductosDaoFactory from "../Factories/ProductossDaoFactory.js";
import { transformarADTO } from "../DTOs/ProductosDTO.js";
import ProductoRepo from "../../models/ProductoRepo.js";

export default class ProductosRepository {
  dao;

  constructor() {
    this.dao = ProductosDaoFactory.getDao();
  }

  async getAll() {
    const productos = await this.dao.getAll();
    return productos.map((p) => new ProductoRepo(p));
  }

  async getById(id) {
    const producto = await this.dao.getById(id);
    return new ProductoRepo(producto);
  }

  async save(nuevo) {
    await this.dao.save(transformarADTO(nuevo));
    return nuevo;
  }

  async updateById(id, nuevo) {
    const producto = await this.dao.updateById(id, nuevo);
    return new ProductoRepo(producto);
  }

  async deleteById(id) {
    const producto = await this.dao.deleteById(id);
    return new ProductoRepo(producto);
  }
}
