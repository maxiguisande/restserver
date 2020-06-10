const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');
const fs = require('fs');
const path = require('path');
const app = express();
//middleware del fileupload
app.use(fileUpload({ useTempFiles: true }))
    //Carga avatar al servidor
app.post('/avatar', verificaToken, (req, res) => {
    //obtenemos los datos enviados por url
    let id = req.usuario._id;
    //validacion por si no envió una imagen
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    };
    //obtengo el archivo
    let archivo = req.files.archivo;
    //declaro un array con las extensiones permitidas
    let extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif'];
    //Obtengo la extension del archivo enviado
    let splitArchivo = archivo.name.split('.');
    let extension = splitArchivo[splitArchivo.length - 1];
    //si la extension coincide con las declaradas muestro el error
    if (!extensionesPermitidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son: ${extensionesPermitidas.join()}`,
                extension
            }
        });
    };
    //Armo el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    //Subo el archivo
    archivo.mv(`uploads/usuarios/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        //Actualizamos el registro del usuario con la imagen
        imagenUsuario(id, res, nombreArchivo);
    })
});
//Obtenemos el avatar del usuario
app.get('/avatar/:img', (req, res) => {
    //obtengo el tipo y nombre de imagen de la url
    let img = req.params.img || 'no-image';
    console.log(req.usuario);
    //Armo el path de la imagen actual para luego eliminarla
    let pathImg = path.resolve(__dirname, `../../uploads/usuarios/${img}`);
    //Si existe la imagen la elimino
    if (!fs.existsSync(pathImg)) {
        pathImg = path.resolve(__dirname, `../assets/no-image.png`);
    }
    //devuelvo la imagen
    res.sendFile(pathImg);
})

function imagenUsuario(id, res, nombreArchivo) {
    //buscamos por id al usuario
    Usuario.findByIdAndUpdate(id, { img: nombreArchivo }, (err, usuarioDB) => {
        //Muestro el error
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //muestro error si no encontro el usuario
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        res.json({
            ok: true,
            usuario: usuarioDB,
            img: nombreArchivo
        });
    })
}

function borraArchivo(nombreImagen, tipo) {
    //Armo el path de la imagen actual para luego eliminarla
    let pathImg = path.resolve(__dirname, `../../uploads/usuarios/${nombreImagen}`);
    //Si existe la imagen la elimino
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}
module.exports = app;