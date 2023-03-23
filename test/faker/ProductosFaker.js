import { faker } from "@faker-js/faker";

faker.locale = "es";

function generarProducto() {
  return {
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    image: faker.image.animals(),
    code: "Code",
    stock: 12,
    description: "desc",
  };
}

export { generarProducto };
