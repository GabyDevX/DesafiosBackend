import express from 'express'
import ApiProductosMock from '../api/productos.js'

class ProductosRouter extends express.Router {
    constructor() {
        super()

        const apiProductos = new ApiProductosMock()

        this.get('/productos-test', async (req, res, next) => {
            try {
                const productosFaker = await apiProductos.popular()
                res.render("inicio", {
                    productos: productosFaker,
                    })
            } catch (error) {
                next(error)
            }
        })
    }
}

export default ProductosRouter