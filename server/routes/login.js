const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    //Buscamos el usuario
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //Mostramos error
        if (err) {
            return res.json(400, {
                ok: false,
                err
            })
        }
        //Si no encuentra el usuario lo informamos
        if (!usuarioDB) {
            return res.json(400, {
                ok: false,
                err: {
                    message: "(Usuario) y/o Contraseña Incorrecta"
                }
            })
        }
        //Mensaje para contraseña incorrecta
        //Comparamos los hash de las contraseñas
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.json(400, {
                ok: false,
                err: {
                    message: "Usuario y/o (Contraseña) Incorrecta"
                }
            })
        }

        // declaramos el token con el seed
        // 60 seg 60 min 24 hs 30 dias --> el token vence en 30 dias
        let token = jwt.sign({
            usuario: usuarioDB
        }, 'este-es-el-seed-dev', { expiresIn: 60 * 60 * 24 * 30  })

        //Si pasa las validaciones devolvemos el usuario
        res.json({
            ok: true,
            Usuario: usuarioDB,
            token
        })

    })
})


module.exports = app;