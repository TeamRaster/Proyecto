'use strict'

module.exports = (app) => {

    const groupsCtrl = app.controllers.controllerGroups


    app.get('/', (req, res) => {  // Ruta para la pagina incial de la aplicacion
        console.log(`\n[Routes./]: Sesion actual del usuario (req.user) es :: ${JSON.stringify(req.user)}`)
        res.render('index', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    app.get('/home', (req, res) => {
        res.render('home', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })

    app.get('/profile', (req, res) => {
        res.render('profile', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    app.get('/public/profile', (req, res) => {
        res.render('public-profile', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })

    app.get('/settings', (req, res) => {
        res.render('settings', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    app.get('/messages', (req, res) => {
        res.render('messages', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    app.get('/test', (req, res) => {
        res.render('test', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    // Grupos
    app.get('/grupo/id', (req, res) => {
        res.render('groups-single', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    // Comunidad
    app.get('/community', groupsCtrl.getGroups)
    app.get('/communities', (req, res) => {
        res.render('community', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    app.get('/notifications', (req, res) => {
        res.render('notifications', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    app.get('/settings-otech', (req, res) => {
        res.render('settings-otech', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })
    app.get('/notices', (req, res) => {
        res.render('news', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })

    // todo Zona de pruebas (Quitar en produccion)
    app.get('/test-error404', (req, res) => {
        res.render('error404')
    })
    app.get('/test-plantilla1', (req, res) => {
        res.render('error404')
    })
    app.get('/test-plantilla2', (req, res) => {
        res.render('error404')
    })
    app.get('/test-plantilla3', (req, res) => {
        res.render('error404')
    })
    return this
}
