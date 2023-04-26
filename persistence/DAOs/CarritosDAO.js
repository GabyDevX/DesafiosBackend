import mongoose from "mongoose";
import * as modelProd from "../../models/producto.js";
import * as carritosModel from "../../models/carrito.js";

class CartsDAOMongoDB {
  constructor(url) {
    this.url = url;
  }

  async connect() {
    try {
      await mongoose.connect(this.url, {
        useNewUrlParser: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      this.connect();

      const cart = await carritosModel.carritos.find({ _id: id });
      console.log(cart);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      this.connect();

      const cart = await carritosModel.carritos.deleteOne({ _id: id });
      return cart;
      
    } catch (error) {
      console.log(error);
    }
  }

  async updateById(id, newData) {
    try {
      this.connect();

      const cart = await carritosModel.carritos.updateOne(
        { _id: id },
        {
          $set: { ...newData },
        }
      );

      return cart;

    } catch (error) {
      console.log(error);
    }
  }

  async addToArrayById(id, objectToAddId) {
    try {
      this.connect();

      const carrito = await carritosModel.carritos.findOne({ _id: id });

      const product = await modelProd.productos.findOne({ _id: objectToAddId });

      carrito.products.push(JSON.parse(JSON.stringify(product)));

      const updated = await carritosModel.carritos.updateOne(
        { _id: id },
        {
          $set: { ...carrito },
        }
      );

      return updated;
    } catch (error) {
      console.log(error);
    }
  }

  async removeFromArrayById(id, objectToRemoveId) {
    const carrito = await carritosModel.carritos.findOne({ _id: id });

    console.log(carrito.products);

    carrito.products = carrito.products.filter(
      (e) => e._id !== objectToRemoveId
    );

    console.log(carrito.products);

    const updated = await carritosModel.carritos.updateOne(
      { _id: id },
      {
        $set: { ...carrito },
      }
    );

    return updated;
  }

  async save(object) {
    try {
      this.connect();

      const saveCart = new carritosModel.carritos(object);

      const saved = await saveCart.save();

      console.log(saved._id);
      return saved._id;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      this.connect();
      const carts = await carritosModel.carritos.find({}, { __v: 0 }).lean();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }
}

export default { CartsDAOMongoDB }
