/**
 * foro-model.js
 * modelo foro, aquí se define el esquema para la base de datos
 */

'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

var foroSchema = schema({
    title: String,
    content: String,
    date: {
        type: Date, default: Date.now
    },
    image: String
});

module.exports = mongoose.model('Comentario', foroSchema);