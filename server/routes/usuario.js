const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();


app.get('/usuario', (req, res) => {
    // parametros de URL
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    //lo convertimos a numero pq viene como String    
    desde = Number(desde);
    limite = Number(limite);
    //filtro por estado
    let filtro = {
        estado: true
    }
    //Obtenemos los datos con los filtros aplicados
    //el segundo parametro son los campos que voy a obtener
    Usuario.find(filtro, 'nombre email img estado google')
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.json(400, {
                    ok: false,
                    err
                })
            }
            // Devolvemos la cantidad total de registro de la base
            Usuario.countDocuments(filtro, (err, cantidad) => {
                res.json({
                    ok: true,
                    cantidad,
                    usuarios
                })
            })
        })


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
    let options = {
        new: true,
        runValidators: true
    };
    //Usamos el metodo PICK de underscore que nos devuelve
    //el mismo objeto con las propiedades que enviamos como 2do parametro
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

    //Actualizamos en registro en la base de datos
    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {

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

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;
    //Cambio de estado
    let body = {
        estado: false
    }

    let options = {
        new: true
    }
    //Eliminar registro de forma logica
    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {

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

    /*
    //Eliminar registro de forma fisica
    Usuario.findByIdAndRemove(id, (err, usuarioEliminado)=>{
        if (err) {
            return res.json(400, {
                ok: false,
                err
            })
        }

        if (!usuarioEliminado) {
            return res.json(400, {
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json(200, {
            ok: true,
            usuario: usuarioEliminado
        })
    })
    */
})

module.exports = app;