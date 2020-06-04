const jwt = require('jsonwebtoken')

//Verificamos el token
let verificaToken = (req, res, next) => {
    //Parametro enviado en el header
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })

};

let verificaRol = (req, res, next) => {
    //datos del usuario
    let usuario = req.usuario;
    //Valido rol ADMIN_ROL
    if (usuario.rol !== 'ADMIN_ROL') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos suficientes'
            }
        })
    }

    next();

}

// Exporto el modulo
module.exports = {
    verificaToken,
    verificaRol
};