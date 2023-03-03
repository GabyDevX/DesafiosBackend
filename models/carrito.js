import mongoose from'mongoose'

const Schema = mongoose.Schema

const carritoSchema = new Schema({
  timestamp : {type: String},
  products: {type: Array}
})

export const carritos = mongoose.model('Carrito', carritoSchema)