const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const conteudosRoutes = require('./routes/conteudosRoutes');
const materiasRoutes = require('./routes/materiasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/conteudos', conteudosRoutes);
app.use('/materias', materiasRoutes);
app.use('/usuarios', usuariosRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando!');
});

module.exports = app;
