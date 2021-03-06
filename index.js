/**
 * index.js
 * Archivo de inicialización node, donde se realiza la conexión
 * a la base de datos y se crea el servidor.
 * Autores: Diego Gongora Gamboa, Nicolas Baak Poot
 */

'use strict'

// Imports
const mongoose = require('mongoose');
const app = require('./app');

const port = 3000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/api_foro', { useNewUrlParser: true })
    .then(() => {
        console.log('\nLa conexion a la base de datos se ha realizado correctamente');

        // Crear servidor y escuchar peticiones http
        app.listen(port, () => {
            console.log('Servidor corriendo en https://localhost:' + port);
        });

    });