const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    //Buscamos el usuario
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //Mostramos error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Si no encuentra el usuario lo informamos
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) y/o Contraseña Incorrecta"
                }
            })
        }
        //Mensaje para contraseña incorrecta
        //Comparamos los hash de las contraseñas
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
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
        }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

        //Si pasa las validaciones devolvemos el usuario
        res.json({
            ok: true,
            Usuario: usuarioDB,
            token
        })

    })
})

//Config de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

//

app.post('/google', async(req, res) => {
    //Recibimos el Token
    let token = req.body.idtoken;
    // Con el token llamamos a la funcion de Google
    // Si se verifica el token voy a obtener cierta informacion del usuario
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        });

    // Valido si en mi base de datos ya tengo un usuario con ese mail    
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        //En caso de haber un error buscando al Usuario
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //Si existe un usuario de base de datos
        if (usuarioDB) {
            // Valido que tenga la autenticacion con google
            if (!usuarioDB.google) {
                // en caso de haberse creado una cuenta sin google lo informo y
                // tiene q hacer la autenticacion normal con user y pass
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe loguearse con Usuario y Constraseña'
                    }
                })
            } else {
                // Si se logueo con Google renovamos su token
                // con nuestro token personalizado
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

                //devuelvo los datos del usuario con el token
                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            // Si es un nuevo usuario creo un nuevo usuario con el esquema
            let usuario = new Usuario();
            //Completamos los datos del usuario para cargarlo en Mongo
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            //Guardo el usuario en la base de datos
            usuario.save((err, usuarioDB) => {
                // Si ocurre un error lo informo
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Error al crear el usuario con Google'
                        }
                    })
                }

                // Si no hay error genero el token y mando la respuesta
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })

        }

    })

})
module.exports = app;