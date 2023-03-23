import axios from "axios";

const putProduct = async (id) => {
  const putProduct = await axios.put(
    `http://localhost:8080/api/productos/${id}`,
    {
      title: `producto Axios`,
      price: 1234,
      image: `URL Axios`,
      description: `descripción Axios`,
      code: 33333,
      stock: 3,
    }
  );
  console.log({
    status: putProduct.status,
    data: putProduct.data,
  });
};

export default { putProduct };
