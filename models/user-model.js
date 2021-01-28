/**
 * user-model.js
 * modelo de usuarios, aquí se define el esquema para la base de datos
 */

'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ["ADMIN", "USER"],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    surname: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"],
    },
    password: {
        type: String,
        required: [true, "Le contraseña es obligatoria"],
    },
    role: {
        type: String,
        default: 'USER',
        required: [true],
        enum: rolesValidos,
    },
});

// elimina la key password del objeto que retorna al momento de crear un usuario
usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('Usuario', usuarioSchema)