/**
 * foro-routes.js
 * routing de node, por limpieza de código, las rutas se almacenan aquí
 * y luego se exporta el módulo para que sea usado en app.js
 */

'use strict'

// Imports
const express = require('express');
const foroController = require('../controllers/foro-controller');
const multiparty = require('connect-multiparty');
var upload = multiparty({ uploadDir: './upload/img-comment' });

// Se instancia el router de express
const router = express.Router();

// Rutas
router.get('/test', foroController.test);
router.post('/test2', foroController.test2);

router.post('/save', foroController.save);
router.get('/comments/:last?', foroController.getComments);
router.get('/comment/:id', foroController.getComment);
router.put('/comment/:id', foroController.update);
router.delete('/comment/:id', foroController.delete);
router.post('/upload-image/:id?', upload, foroController.upload);
router.get('/get-image/:img', upload, foroController.getImage);
router.get('/search/:query', upload, foroController.search);
router.post('/login', foroController.login);
router.post('/register', foroController.register);
router.get('/token/:id', upload, foroController.getUser);

// Se exporta el router
module.exports = router;