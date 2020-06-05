require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')

//Inicializamos Express
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Importamos rutas del usuario
app.use(require('./routes/index'))

//Usamos el path llamando a public/index.html
app.use(express.static(path.resolve(__dirname, '../public')))

// Conectamos con MongoDB
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos ONLINE!!');
});

//Levantamos el Server
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});