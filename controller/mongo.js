import mongoose from'mongoose'
import * as modelMensaje from "./../models/mensaje.js"

class Mongo {

    constructor(url) {
        this.url = url
    }

    async connect() {
        try {
            await mongoose.connect(this.url,
            {
            useNewUrlParser: true,
            })

        } catch (error) {
            console.log(error);
        }
        
    }

    async getById(id) {

        try {
            
            this.connect()
    
                const mensaje = await modelMensaje.mensajes.find({_id : id})

                return mensaje
            

        } catch (error) {
            console.log(error);
        }
        
    }

    async deleteById(id) {

        try {
            
            this.connect()
    
    
                const mensaje = await modelMensaje.mensajes.deleteOne({_id : id})
    
                console.log(mensaje);

                return mensaje

        } catch (error) {
            console.log(error);
        }
        
        
    }

    async updateById(id, newData) {

        try {
            
            this.connect()
    
               const mensaje = await modelMensaje.mensajes.updateOne({_id : id}, {
               $set: {...newData}
               })
    
               console.log(mensaje);
               return mensaje

        } catch (error) {
            console.log(error);
        }
        
    }

    async save(object) {

        try {
            
            this.connect()
    
                const mensaje = new modelMensaje.mensajes(object)
    
                const saved = await mensaje.save()
    
                console.log(saved._id);
                return saved._id


        } catch (error) {
            console.log(error);
        }

    }

    async getAll() {

        try {
            
            this.connect()
    
                const mensajes = await modelMensaje.mensajes.find({}, { __v:0}).lean()

                return mensajes
            

        } catch (error) {
            console.log(error);
        }
        
    } 

}

export const MongoDB = Mongo