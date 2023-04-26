import carritoDAO from "../DAOs/CarritosDAO.js";
import dotenv from "dotenv";

dotenv.config();
const opcion = process.argv[3] || "Mongo";
const MONGO_DB_URI = process.env.URL_MONGO;

let dao = null;

class CarritosFactory {
  static getDao() {
    if (!dao) {
      switch (opcion) {
        case "Mongo":
          dao = new carritoDAO.CartsDAOMongoDB(MONGO_DB_URI);
          break;
        default:
          dao = new carritoDAO.CartsDAOMongoDB(MONGO_DB_URI);
      }
    }
    return dao;
  }
}

export default CarritosFactory;