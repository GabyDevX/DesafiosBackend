import axios from "axios";
import { generarProducto } from "./faker/ProductosFaker.js";

const addProduct = async () => {
  const product = generarProducto();
  const addProduct = await axios.post(
    `http://localhost:8080/api/productos`,
    product
  );
  console.log({
    status: addProduct.status,
    data: addProduct.data,
  });
  return addProduct.data;
};

export default { addProduct };
