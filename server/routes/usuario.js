const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();


app.get('/usuario', (req, res) => {
    res.json('Get Usuario')
})

//Insertamos datos en la coleccion Usuarios
app.post('/usuario', (req, res) => {
    let body = req.body;

    // creamos el modelo suando encriptacion de password
    // de una sola via de manera sync
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.json(400, {
                ok: false,
                err
            })
        }

        res.json(201, {
            ok: true,
            usuario: usuarioDB
        })

    })


})

// Modificar datos del usuario
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    //Usamos el metodo PICK de underscore que nos devuelve
    //el mismo objeto con las propiedades que enviamos como 2do parametro
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

    //Actualizamos en registro en la base de datos
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.json(400, {
                ok: false,
                err
            })
        }

        res.json(200, {
            ok: true,
            usuarioDB
        })
    })
})

app.delete('/usuario', (req, res) => {
    res.json('Delete Usuario')
})

module.exports = app;