require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    res.json('Get Usuario')
})

app.post('/usuario', (req, res) => {
    let usuario = req.body;

    if (usuario.nombre) {
        res.json(201,{
            ok:true,
            usuario
        })
    }else{
        res.json(400,{
            ok: false,
            message: "El nombre es obligatorio"
        })
    }
    
})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({
        id,
        message: "Put Usuario"
    })
})

app.delete('/usuario', (req, res) => {
    res.json('Delete Usuario')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});