import axios from "axios";

const getData = async (id) => {
  let getProducts;
  if (id == undefined) {
    getProducts = await axios.get(`http://localhost:8080/api/productos`);
  } else {
    getProducts = await axios.get(`http://localhost:8080/api/productos/${id}`);
  }
  console.log({
    status: getProducts.status,
    data: getProducts.data,
  });
};

export default { getData };
