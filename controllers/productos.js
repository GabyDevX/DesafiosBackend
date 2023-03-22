import ProductosRepository from "../persistence/Repositories/ProductosRepository.js";
const productosRepo = new ProductosRepository();

const admin = true;

/* ------------------------ Product Endpoints ------------------------ */

// GET api/productos
const get = async (req, res) => {
  const { id } = req.params;
  if (id) {
    const product = await productosRepo.getById(id);

    product
      ? res.status(200).json(product)
      : res.status(400).json({ error: "product not found" });
  } else {
    const products = await productosRepo.getAll();
    // res.status(200);
    res.status(200).json(products);
  }
};

// POST api/productos
const post = async (req, res, next) => {
  if (admin) {
    const { body } = req;
    console.log(body);
    const newProductId = await productosRepo.save(body);

    newProductId
      ? res
          .status(200)
          .json({ success: "product added with ID: " + newProductId })
      : res
          .status(400)
          .json({ error: "invalid key. Please verify the body content" });
  } else {
    res.json({
      error: -1,
      descripcion: "ruta api/productos metodo post no autorizada",
    });
  }
};

// PUT api/productos/:id
const put = async (req, res, next) => {
  if (admin) {
    const { id } = req.params;
    const { body } = req;

    const wasUpdated = await productosRepo.updateById(id, body);

    wasUpdated
      ? res.status(200).json({ success: "product updated" })
      : res.status(404).json({ error: "product not found" });
  } else {
    res.json({
      error: -1,
      descripcion: "ruta api/productos metodo post no autorizada",
    });
  }
};

// DELETE /api/productos/:id
const deleteProduct = async (req, res, next) => {
  if (admin) {
    const { id } = req.params;
    const wasDeleted = await productosRepo.deleteById(id);

    wasDeleted
      ? res.status(200).json({ success: "product successfully removed" })
      : res.status(404).json({ error: "product not found" });
  } else {
    res.json({
      error: -1,
      descripcion: "ruta api/productos metodo post no autorizada",
    });
  }
};

export default { get, post, put, deleteProduct };
