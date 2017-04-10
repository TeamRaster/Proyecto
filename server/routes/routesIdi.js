'use strict'

const fs = require('fs')
    , multer = require('multer')

module.exports = (app) => {
    const Idi = app.controllers.controllerIdi  // Llama al controlador de los usuarios
        , auth = app.middlewares.auth  // Llamada del middleware para la validacion de las rutas
        , find = app.middlewares.find  // Llamada del middleware para la busqueda
        , validate = app.middlewares.validations  // Llama al middleware para las validaciones

    // let storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'public/images/imagesPublications/')  // URL donde se almacenan las imagenes
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, 'imageSource-' + Date.now() + '.' + file.originalname.split('.').pop())  // Renombra el archivo, despues lo mueve
    //     },
    //     onError: function (error, next) {
    //         console.log(`\n[routesSource.storage]: Ups hay un error => ${error}`)
    //         next(error)
    //     }
    // })
    //     , upload = multer({ storage: storage })  // Usa el storage especificado con anterioridad

    // app.all('/idi/:id*', find.)

    app.get('/idis/new', [auth.isLogged, Idi.__new])
    app.get('/idi/:id/edit', [auth.isLogged, Idi.__edit])

    app.route('/idi/:id')
        .get([auth.isLogged, Idi.__get])
        .put([auth.isLogged, Idi.__update])
        .delete([auth.isLogged, Idi.__delete])

    app.route('/idis')
        .get([Idi.__gets])
        .post([auth.isLogged, Idi.__set])

    return this
}

