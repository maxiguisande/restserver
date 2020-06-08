const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    codigo: {
        type: String,
        unique: true,
        required: [true, 'El codigo es obligatoria']
    },
    toxicidad: {
        type: String,
        unique: true,
        required: [true, 'La toxicidad es obligatoria']
    }
})

module.exports = mongoose.model('Categoria', categoriaSchema);