import mongoose from "mongoose";

const usuariosCollection = "usuarios";

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  username: { type: String, require: true, max: 150 },
  password: { type: String, require: true, max: 150 },
  address: { type: String, require: true, max: 150 },
  fullName: { type: String, require: true, max: 150 },
  age: { type: Number, require: true },
  phoneNumber: { type: String, require: true },
  urlAvatar: { type: String, require: true, max: 150 },
});

export const User = mongoose.model(usuariosCollection, usuarioSchema);
