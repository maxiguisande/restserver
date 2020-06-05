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
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==================================================
// Caducidad Token
//==================================================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==================================================
// SEED
//==================================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-dev';

//==================================================
// Google Client ID
//==================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '191689690183-t10j74g0kfee4o9udovmmhaa4rpnedvb.apps.googleusercontent.com';