'use strict'

const fs = require('fs')  // Modulo para el manejo de archivos, crear, mover, eliminar, renombrar etc
    , multer = require('multer')

module.exports = (app) => {
    const Publication = app.controllers.controllerPublications  // Llama al controlador de los usuarios
        , auth = app.middlewares.auth  // Llamada del middleware para la validacion de las rutas
        , find = app.middlewares.find  // Llamada del middleware para la busqueda
        , validate = app.middlewares.validations  // Llama al middleware para las validaciones

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images/imagesPublications/')  // URL donde se almacenan las imagenes
        },
        filename: function (req, file, cb) {
            cb(null, 'imageSource-' + Date.now() + '.' + file.originalname.split('.').pop())  // Renombra el archivo, despues lo mueve
        },
        onError: function (error, next) {
            console.log(`\n[routesSource.storage]: Ups hay un error => ${error}`)
            next(error)
        }
    })
        , upload = multer({ storage: storage })  // Usa el storage especificado con anterioridad

    app.all('/publication/:id*', find.findPublications)  // Middleware que busca un usuario y lo almacena en locals

    app.get('/publications/new', [auth.isLogged, Publication.__new])  // Formulario para un nuevo usuario via admin
    app.get('/publication/:id/edit', [auth.isLogged, Publication.__edit])  // Formulario para editar un usuario
    // app.get('/publications/:type/list', [auth.isLogged, Publication.getList])  // Muestra todas las fuentes de informacion por tipo

    app.route('/publication/:id')
        .get([auth.isLogged, Publication.__get])  // Obtiene una fuente de informacion por id
        .put([auth.isLogged, upload.single('image'), Publication.__update])  // Actualiza una fuente de informacion
        .delete([auth.isLogged, Publication.__delete])  // Elimina una fuente de informacion

    app.route('/publications')
        .get([auth.isLogged, Publication.__gets])  // Obtiene todas las fuentes de informacion
        .post([auth.isLogged, upload.single('image'), Publication.__set])  // Agrega una fuentes de informacion

    app.get('/offers', (req, res) => {
        res.render('offers', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })

    app.get('/demands', (req, res) => {
        res.render('demands', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })

    app.get('/offers-demands', (req, res) => {
        res.render('offers-demands', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    return this
}
