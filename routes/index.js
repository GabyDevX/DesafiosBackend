import { Router } from 'express'
// Importar todos los routers;
import {CarritoRoutes} from './carrito.js'
import {ProductosRoutes} from './productos.js'

const router = Router();

// Configurar los routers
router.use('/api/carrito', CarritoRoutes);
router.use('/api/productos', ProductosRoutes);

export const routes = router;