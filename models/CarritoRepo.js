export default class CarritoRepo {
    #timestamp;
    #products;


    constructor(carrito) {
        this.#timestamp = carrito.timestamp;
        this.#products = carrito.products;
    }

    get timestamp(){
        return this.#timestamp;
    }

    set timestamp(timestamp) {
        console.log(timestamp);
        if (!timestamp) throw new Error('"timestamp" es un campo requerido');
        this.#timestamp = timestamp;
    }

    get products(){
        return this.products;
    }

    set products(products) {
        console.log(products);
        if (!products) throw new Error('"products" es un campo requerido');
        this.#products = products;
    }

    datos() {
        return JSON.parse(
          JSON.stringify({
            timestamp: this.#timestamp,
            products: this.products,
          })
        );
      }
}