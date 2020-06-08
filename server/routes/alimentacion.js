const express = require('express')
const { verificaToken, verificaRol } = require('../middlewares/autenticacion')
const Alimentacion = require('../models/alimentacion');
const app = express()

//Devolvemos todas las Alimentacions
app.get('/alimentacion', verificaToken, (req, res) => {
    Alimentacion.find()
        .exec((err, alimentacion) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            // Devolvemos la cantidad total de registro de la base
            Alimentacion.countDocuments((err, cantidad) => {
                res.json({
                    ok: true,
                    cantidad,
                    alimentacion
                })
            })
        })
})

//crea una Alimentacion
app.post('/alimentacion', [verificaToken, verificaRol], (req, res) => {
    let body = req.body;
    // Creamon una instancia de Alimentacion
    let Alimentacion = new Alimentacion({
        descripcion: body.descripcion
    });

    //Guarda Alimentacion en base de datos
    Alimentacion.save((err, alimentacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Por si no se creo la Alimentacion
        if (!alimentacionDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // devolvemos la Alimentacion creada
        res.status(201).json({
            ok: true,
            alimentacion: alimentacionDB
        })

    })
})

// Modificar datos de la alimentacion
app.put('/alimentacion/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    let body = {
        descripcion: req.body.descripcion
    };
    //Esto es para que devuelva el registro actualizado
    let options = {
        new: true,
        runValidators: true
    };
    //Actualizamos el registro en la base de datos
    Alimentacion.findByIdAndUpdate(id, body, options, (err, alimentacionDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //Por si no encontro la Alimentacion
        if (!alimentacionDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            alimentacion: alimentacionDB
        })
    })
})

// Modificar datos de la alimentacion
app.delete('/alimentacion/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    //Eliminamos el registro en la base de datos
    Alimentacion.findByIdAndRemove(id, (err, alimentacionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            alimentacion: alimentacionDB
        })
    })
})


module.exports = app;