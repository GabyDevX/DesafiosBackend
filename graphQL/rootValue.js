import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  deleteProductById,
} from "../services/productosGraphQL.js";

const rootValueFn = () => {
  return {
    getAllProducts,
    getProductById,
    addProduct,
    updateProductById,
    deleteProductById,
  };
};

export default rootValueFn;
