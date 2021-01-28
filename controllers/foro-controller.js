/**
 * foro-controller.js
 * controlador del foro, aquí se define un objeto donde
 * los métodos son las propiedades de dicho objeto
 */

// Imports
var foroModel = require('../models/foro-model');
var validator = require('validator');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Usuario = require('../models/user-model');

// Objeto foro-controlador con todos los métodos
var controller = {

    test: (req, res) => {
        return res.status(200).send({
            message: "Soy el método test"
        });
    },

    test2: (req, res) => {
        return res.status(200).send({
            nombre: 'Diego',
            apellido: 'Gongora',
        });
    },

    // Save, guardar comentario
    save: (req, res) => {
        // Obtener parámetros
        var params = req.body;

        // Validar datos
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);

            if (validateTitle && validateContent) {

                // Crear objeto para guardar
                var commentForo = new foroModel();
                commentForo.title = params.title;
                commentForo.content = params.content;
                if (params.image) {
                    commentForo.image = params.image;
                } else {
                    commentForo.image = null;
                }

                // Guardar en base de datos
                commentForo.save((err, commentStored) => {
                    if (err || !commentStored) {
                        return res.status(404).send({
                            status: 'error',
                            message: "Los datos no se han guardado!!"
                        });
                    }

                    // Devolver respuesta exitosa, se guardo en DB
                    return res.status(200).send({
                        status: 'success',
                        comment: commentStored
                    });

                });

            } else {
                return res.status(202).send({
                    status: 'error',
                    message: "Los datos no son válidos!!"
                });
            }

        } catch (err) {
            return res.status(202).send({
                status: 'error',
                message: "Faltan datos!!"
            });
        }
    },

    // getComments, regresa todos los comentarios
    getComments: (req, res) => {

        var query = foroModel.find({});

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(3);
        }

        // Encontrar los comentarios
        query.sort('-_id').exec((err, comments) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en devolver los comentarios'
                });
            }

            if (!comments) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay comentarios en el foro'
                });
            }

            return res.status(200).send({
                status: 'success',
                comments
            });
        });
    },

    // getComment, regresa 1 comentario en particular
    getComment: (req, res) => {
        // Recoger id de la url
        var commentId = req.params.id;

        if (!commentId || commentId == undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el comentario en el foro'
            });
        }

        foroModel.findById(commentId, (err, comment) => {
            // Si hay error
            if (err || !comment) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el comentario'
                });
            }

            // Si todo esta bien, se devuelve el comentario encontrado
            return res.status(200).send({
                status: 'success',
                comment
            });

        });
    },

    // update, actualiza un comentario
    update: (req, res) => {
        // Recoger id de la url
        var commentId = req.params.id;

        // Validar datos que llegan del body
        var params = req.body;

        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(202).send({
                status: 'error',
                message: 'Faltan datos por enviar!!'
            });
        }

        if (validateTitle && validateContent) {
            // Find and update
            foroModel.findOneAndUpdate({ _id: commentId }, params, { new: true }, (err, commentUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar los datos!!'
                    });
                }

                if (!commentUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El comentario no existe!!'
                    });
                }

                // Devolver comentario actualizado
                return res.status(200).send({
                    status: 'success',
                    commentUpdated
                });
            });
        } else {
            return res.status(500).send({
                status: 'error',
                message: 'La validación no es correcta!!'
            });
        }
    },

    // delete, borra un comentario
    delete: (req, res) => {
        // Recoger id
        var commentId = req.params.id;

        if (!commentId || commentId == undefined) {
            return res.status(404).send({
                status: 'error',
                message: 'No se envió un id correcto!!'
            });
        }
        // Busca y elimina el comentario
        foroModel.findOneAndDelete({ _id: commentId }, (err, commentRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar el comentario!!'
                });
            }

            if (!commentRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el comentario a eliminar!!'
                });
            }

            // Se retorna el articulo que fue eliminado
            return res.status(200).send({
                status: 'error',
                commentRemoved
            });

        })
    },

    // upload, sube una imagen
    upload: (req, res) => {
        // Recoger fichero
        var fileName = 'Imagen no subida';

        // Si no se envian archivos
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay archivos subidos'
            });
        }

        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\');
        //  var fileSplit = filePath.split('/');
        var fileName = fileSplit[2];
        var extensionSplit = fileName.split('\.');
        var fileExt = extensionSplit[1];

        // Comprobar si extensión es válida
        if (fileExt != 'jpg' && fileExt != 'png' && fileExt != 'bmp' && fileExt != 'jpeg' && fileExt != 'gif') {
            fs.unlink(filePath, (err) => {
                return res.status(202).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida!!'
                });
            });
        } else {

            // Actualizar el articulo con la imagen
            var commentId = req.params.id;
            if (commentId) {
                foroModel.findOneAndUpdate({ _id: commentId }, { image: fileName }, { new: true }, (err, commentUpdated) => {
                    if (err || !commentUpdated) {
                        return res.status(202).send({
                            status: 'err',
                            message: 'Error al guardar la imagen del articulo'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        commentUpdated
                    });

                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    image: fileName
                });
            }
        }

    },

    // getImage, obtiene la imagen desde el backend
    getImage: (req, res) => {

        var file = req.params.img;
        var filePath = './upload/img-comment/' + file;

        /*fs.exists(filePath, (exists) => {
            console.log(exists);
            if (exists) {
                return res.sendFile(path.resolve(filePath));
            }
            else {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la imagen buscada!!'
                });
            }*/

        fs.stat(filePath, function (err, stats) {
            //console.log(stats);//here we got all information of file in stats variable
            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la imagen buscada!!'
                });
            } else {
                return res.sendFile(path.resolve(filePath));
            }
        });
    },

    search: (req, res) => {
        // Obtener la cadena a buscar
        var query = req.params.query;

        foroModel.find({
            "$or": [
                { "title": { "$regex": query, "$options": "i" } },
                { "content": { "$regex": query, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, comments) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la búsqueda!!'
                    });
                }

                if (!comments || comments.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se encontraron comentarios!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    comments
                });
            })

    },

    login: (req, res) => {

        let body = req.body;
        Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    err: err
                })
            }

            // Verifica que exista un usuario con el mail escrita por el usuario.
            if (!usuarioDB) {
                return res.status(400).json({
                    status: 'error',
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                })
            }

            // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    status: 'error',
                    err: {
                        message: "Usuario o contraseña incorrectos"
                    }
                });
            }

            // Genera el token de autenticación
            let token = jwt.sign({
                usuario: usuarioDB,
            }, process.env.SEED_AUTENTICACION, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            })

            res.json({
                status: 'success',
                usuario: usuarioDB,
                token,
            });

        });

    },

    register: (req, res) => {
        let body = req.body;

        let { nombre, surname, email, password, role } = body;
        let usuario = new Usuario({
            nombre,
            surname,
            email,
            password: bcrypt.hashSync(password, 10),
            role
        });

        usuario.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    status: 'error',
                    err,
                });
            }

            res.json({
                status: 'success',
                usuario: usuarioDB
            });

        });
    },

    getUser: (req, res) => {
        let params = req.params;
        //console.log('req.p.id: ' + req.params.id);
        Usuario.findOne({ _id: params.id }, (err, usuarioDB) => {
            if (err || !usuarioDB) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Hubo un error en la búsqueda o no existe un usuario con ese id y token'
                });
            }

            res.status(200).send({
                status: 'success',
                usuarioDB
            });
            //console.log(usuarioDB);
        });


    },





}

// Se exporta el controlador
module.exports = controller;