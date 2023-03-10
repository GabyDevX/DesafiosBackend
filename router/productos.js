import express from 'express'
import ApiProductosMock from '../api/productos.js'

class ProductosRouter extends express.Router {
    constructor() {
        super()

        const apiProductos = new ApiProductosMock()

        this.get('/productos-test', async (req, res, next) => {
            
            try {
                req.session.usuario = req.query.nameLogin;

                const productosFaker = await apiProductos.popular()
                
                const data = {
                    productos: productosFaker,
                    nameLogin: req.session.usuario
                };
                
                res.render("inicio", data)
            } catch (error) {
                next(error)
            }
        })
    }
}

export default ProductosRouter