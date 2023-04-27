export default class CarritoDTO {
    constructor(carrito) {
        this.id = carrito._id;
        this.timestamp = carrito.timestamp;
        this.products = carrito.products;
    }
}

export function transformarADTO(carritos) {
    if (Array.isArray(carritos)) {
      return carritos.map((p) => new CarritoDTO(p));
    } else {
      return new CarritoDTO(carritos);
    }
  }