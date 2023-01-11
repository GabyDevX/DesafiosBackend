import { faker } from '@faker-js/faker'
faker.locale = 'es'

function generarProducto() {
    return {
        titulo: faker.commerce.product(),
        precio: faker.commerce.price(),
        imagen: faker.image.animals()
    }
}

export { generarProducto }