//==================================================
// Puerto
//==================================================

process.env.PORT = process.env.PORT || 3000;

//==================================================
// Entorno
//==================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================================================
// Base de Datos
//==================================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else {
    urlDB = 'mongodb+srv://MAXIGUISI:2EdogYKq4So32HsX@cluster0-ih4z3.mongodb.net/cafe';
}

process.env.URLDB = urlDB;