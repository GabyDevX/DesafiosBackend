import CarritosDAOFactory from '../Factories/CarritosDAOFactory.js'
import { transformarADTO } from '../DTOs/CarritosDTO.js'
import carritoRepo from '../../models/CarritoRepo.js'

export default class CarritosRepository {
  dao

  constructor() {
    this.dao = CarritosDAOFactory.getDao()
  }

  async getAll() {
    const carritos = await this.dao.getAll()
    return carritos.map((p) => transformarADTO(p))
  }

  async getById(id) {
    const carrito = await this.dao.getById(id)
    return carrito
  }

  async save(nuevo) {
    return await this.dao.save(transformarADTO(nuevo))
  }

  async updateById(id, nuevo) {
    const carrito = await this.dao.updateById(id, nuevo)
    return carrito
  }

  async deleteById(id) {
    const carrito = await this.dao.deleteById(id)
    return new carritoRepo(carrito)
  }

  async addToArrayById(id, objectToAddId) {
    const carrito = await this.dao.addToArrayById(id, objectToAddId)

    return carrito
  }

  async removeFromArrayById(id, objectToRemoveId) {
    const carrito = await this.dao.removeFromArrayById(id, objectToRemoveId)

    return carrito
  }
}