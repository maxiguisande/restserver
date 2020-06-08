const express = require('express')
const { verificaToken, verificaRol } = require('../middlewares/autenticacion')
const Categoria = require('../models/categoria');
const app = express()

//Devolvemos todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find()
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            // Devolvemos la cantidad total de registro de la base
            Categoria.countDocuments((err, cantidad) => {
                res.json({
                    ok: true,
                    cantidad,
                    categorias
                })
            })
        })
})

//devuelve una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    //Buscamos la categoria por el ID
    Categoria.findById(id)
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            // Devolvemos la categoria encontrada
            res.json({
                ok: true,
                categoria
            })
        })
})

//crea una categoria
app.post('/categoria', verificaToken, (req, res) => {
    let idUsuario = req.usuario._id;
    let body = req.body;

    // Creamon una instancia de categoria
    let categoria = new Categoria({
        usuario: idUsuario,
        descripcion: body.descripcion
    });

    //Guarda categoria en base de datos
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Por si no se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // devolvemos la categoria creada
        res.status(201).json({
            ok: true,
            usuario: categoriaDB
        })

    })
})

// Modificar datos del usuario
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let catDescripcion = {
        descripcion: req.body.descripcion
    };
    //Esto es para que devuelva el registro actualizado
    let options = {
        new: true,
        runValidators: true
    };
    //Actualizamos el registro en la base de datos
    Categoria.findByIdAndUpdate(id, catDescripcion, options, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //Por si no encontro la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            categoriaDB
        })
    })
})


// Modificar datos del usuario
app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id;
    //Eliminamos el registro en la base de datos
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
})


module.exports = app;