require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Inicializamos Express
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Importamos rutas del usuario
app.use(require('./routes/usuario'))

// Conectamos con MongoDB
mongoose.connect('mongodb://localhost:27017/cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, resp)=>{
    if (err) throw err;
    console.log('Base de datos ONLINE!!');
});

//Levantamos el Server
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});