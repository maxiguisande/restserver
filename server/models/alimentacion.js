const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion es obligatoria']
    }
})

module.exports = mongoose.model('Alimentacion', categoriaSchema);