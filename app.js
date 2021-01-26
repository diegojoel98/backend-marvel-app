/**
 * app.js
 * modulo de la app (express), donde se crean middlewares, activa CORS y
 * se enlaza al archivo de rutas
 */

'use strict'

// Imports
var express = require('express');
var bodyParser = require('body-parser');
const config = require('./config/config');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var foroRoutes = require('./routes/foro-routes');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('secret_key', config.CLAVE_SECRETA);

// CORS (permitir peticiones desde el frontend)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Añadir prefijo a rutas
app.use('/api', foroRoutes);

// Exportar modulo
module.exports = app;