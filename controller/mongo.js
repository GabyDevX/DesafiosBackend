import mongoose from "mongoose";
import * as mensajesModel from "./../models/mensaje.js";
import * as usuariosModel from "./../models/usuario.js";
import * as modelProd from "./../models/producto.js";
import * as modelCar from "./../models/carrito.js";

class Mongo {
  constructor(url, type) {
    this.url = url;
    this.type = type;
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

      if (this.type == "producto") {
        const product = await modelProd.productos.find({ _id: id });
        return product;
      } else if (this.type == "carrito") {
        const cart = await modelCar.carritos.find({ _id: id });
        console.log(cart);
        return cart;
      } else if (this.type == "mensajes") {
        const mensaje = await mensajesModel.mensajes.find({ _id: id });
        return mensaje;
      } else if (this.type == "usuarios") {
        const usuario = await usuariosModel.usuarios.find({ _id: id });
        return usuario;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      this.connect();

      if (this.type == "producto") {
        const product = await modelProd.productos.deleteOne({ _id: id });
        return product;
      } else if (this.type == "carrito") {
        const cart = await modelCar.carritos.deleteOne({ _id: id });
        return cart;
      } else if (this.type == "mensajes") {
        const mensaje = await mensajesModel.mensajes.deleteOne({ _id: id });
        return mensaje;
      } else if (this.type == "usuarios") {
        const usuario = await usuariosModel.usuarios.deleteOne({ _id: id });
        return usuario;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateById(id, newData) {
    try {
      this.connect();

      if (this.type == "producto") {
        const product = await modelProd.productos.updateOne(
          { _id: id },
          {
            $set: { ...newData },
          }
        );

        return product;
      } else if (this.type == "carrito") {
        const cart = await modelCar.carritos.updateOne(
          { _id: id },
          {
            $set: { ...newData },
          }
        );

        return cart;
      } else if (this.type == "mensajes") {
        const mensaje = await mensajesModel.mensajes.updateOne(
          { _id: id },
          {
            $set: { ...newData },
          }
        );
        return mensaje;
      } else if (this.type == "usuarios") {
        const usuario = await usuariosModel.usuarios.updateOne(
          { _id: id },
          {
            $set: { ...newData },
          }
        );
        return mensaje;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addToArrayById(id, objectToAddId) {
    try {
      this.connect();

      const carrito = await modelCar.carritos.findOne({ _id: id });

      const product = await modelProd.productos.findOne({ _id: objectToAddId });

      carrito.products.push(JSON.parse(JSON.stringify(product)));

      const updated = await modelCar.carritos.updateOne(
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

  async removeFromArrayById(id, objectToRemoveId, keyName) {
    const carrito = await modelCar.carritos.findOne({ _id: id });

    console.log(carrito.products);

    carrito.products = carrito.products.filter(
      (e) => e._id !== objectToRemoveId
    );

    console.log(carrito.products);

    const updated = await modelCar.carritos.updateOne(
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

      if (this.type == "producto") {
        const saveProduct = new modelProd.productos(object);

        const saved = await saveProduct.save();

        console.log(saved._id);
        return saved._id;
      } else if (this.type == "carrito") {
        const saveCart = new modelCar.carritos(object);

        const saved = await saveCart.save();

        console.log(saved._id);
        return saved._id;
      } else if (this.type == "mensajes") {
        const mensaje = new mensajesModel.mensajes(object);
        const saved = await mensaje.save();

        console.log(saved._id);
        return saved._id;
      } else if (this.type == "usuarios") {
        const usuario = new usuariosModel.usuarios(object);
        const saved = await usuario.save();

        console.log(saved._id);
        return saved._id;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      this.connect();

      if (this.type == "producto") {
        const product = await modelProd.productos.find({}, { __v: 0 }).lean();
        return product;
      } else if (this.type == "carrito") {
        const cart = await modelCar.carritos.find({}, { __v: 0 }).lean();
        return cart;
      } else if (this.type == "mensajes") {
        const mensaje = await mensajesModel.mensajes
          .find({}, { __v: 0 })
          .lean();
        return mensaje;
      } else if (this.type == "usuarios") {
        const usuario = await await usuariosModel.usuarios
          .find({}, { __v: 0 })
          .lean();
        return usuario;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const MongoDB = Mongo;
