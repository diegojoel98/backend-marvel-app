/**
 * foro-routes.js
 * routing de node, por limpieza de código, las rutas se almacenan aquí
 * y luego se exporta el módulo para que sea usado en app.js
 */

'use strict'

// Imports
var express = require('express');
var foroController = require('../controllers/foro-controller');
var multiparty = require('connect-multiparty');
var upload = multiparty({ uploadDir: './upload/img-comment' });

// Se instancia el router de express
var router = express.Router();

// Rutas
router.get('/test', foroController.test);
router.post('/test2', foroController.test2);

router.post('/save', foroController.save);
router.get('/comments/:last?', foroController.getComments);
router.get('/comment/:id', foroController.getComment);
router.put('/comment/:id', foroController.update);
router.delete('/comment/:id', foroController.delete);
router.post('/upload-image/:id', upload, foroController.upload);
router.get('/get-image/:img', upload, foroController.getImage);
router.get('/search/:query', upload, foroController.search);

// Se exporta el router
module.exports = router;