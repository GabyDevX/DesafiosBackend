import ProductosRepository from '../persistence/Repositories/ProductosRepository.js'

const productosRepo = new ProductosRepository()

const addProduct = async ({ data }) => {
  const newProductId = await productosRepo.save(data)
  const id = newProductId
  return newProductId
    ? { id: newProductId }
    : res
        .status(400)
        .json({ error: 'invalid key. Please verify the body content' })
}

const getAllProducts = async () => {
  const products = await productosRepo.getAll()
  console.log(products)
  return products
}

const getProductById = async ({ id }) => {
  const product = await productosRepo.getById(id)

  if (!product) {
    return res.status(404).json({
      error: `Error producto no encontrado`,
    })
  } else {
    return product
  }
}

const updateProductById = async ({ id, data }) => {
  const wasUpdated = await productosRepo.updateById(id, data)

  if (!wasUpdated) {
    return res.status(404).json({
      error: `Error producto no encontrado`,
    })
  } else {
    const product = await productosRepo.getById(id)
    console.log(product)
    return { id, ...product }
  }
}

const deleteProductById = async ({ id }) => {
  const product = await productosRepo.getById(id)

  if (!product) {
    return null
  } else {
    await productosRepo.deleteById(id)
    return id
  }
}

export {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  deleteProductById,
}
