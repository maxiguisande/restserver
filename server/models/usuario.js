const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

//Creamos el enum de roles
let rolesValidos = {
    values: ['ADMIN_ROL', 'USER_ROL'],
    message: '{VALUE} no es un rol valido'
}

// Creamos el esquema de la base de datos
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false,
        default: 'no-image'
    },
    rol: {
        type: String,
        default: 'USER_ROL',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    firstTime: {
        type: Boolean,
        default: true
    },
    alimentacion: [{
        descripcion: {
            type: String
        },
        _id: {
            type: Schema.Types.ObjectId
        }
    }]
});

//Agregamos mejora en el mensaje de error de email unico
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} ya existe en la base de datos'
});

//Modificamos el objeto para sacar la propiedad password
// no usamos una arrow function pq necesitamos el this
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

//Exportamos el modelo del usuario
module.exports = mongoose.model('Usuario', usuarioSchema);