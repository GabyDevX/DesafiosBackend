import axios from "axios";

const deleteProduct = async (id) => {
  const deleteProduct = await axios.delete(
    `http://localhost:8080/api/productos/${id}`
  );
  console.log({
    status: deleteProduct.status,
    data: deleteProduct.data,
  });
};

export default { deleteProduct };
