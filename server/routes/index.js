const express = require('express')
const app = express();
const cors = require('cors')

app.use(cors({ origin: true, credentials: true }))
app.use(require('./usuario'))
app.use(require('./categoria'))
app.use(require('./login'))

module.exports = app;