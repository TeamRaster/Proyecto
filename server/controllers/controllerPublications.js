'use strict'

const fs = require('fs')
    , moment = require('moment')  // Modulo para el tiempo
    , redirect = '/publications'

module.exports = (app) => {
    const Publication = app.models.modelPublications  // Manda a llamar el modelo de Usuarios

    this.__set = (req, res) => {
        // console.log('req.body.types' + req.body.types + '\n\n')
        let publication = new Publication()
            publication.title    = req.body.title,
            publication.image    = req.file.filename,
            publication.path     = req.file.destination,
            publication.postedBy = req.user.id,
            publication.typePublication   = req.body.types,
            publication.creationDate.hour = moment().format('LT')  // Ingresa el formato de la hora
            publication.creationDate.date = moment().format('L')  // Ingresa el formato de la fecha
        console.dir('\n\nreq.body ::: ' + req.body.types)
        // console.log('\n\nreq' + req)
        // console.log("body: %j", req.body)
        publication.save( err => {
            if (!err) {
                console.log('\n[ControllerSource.setPublication]: Fuente de informacion guardada con exito')
                req.flash('info', '[Servidor]: Los datos se han guardado con exito')
                res.redirect(redirect)
            } else {
                console.log(`\n[ControllerSource.setPublication]: Ups! parece que hubo un error => ${err}`)
                req.flash('err', '[Servidor]: Ups! parece que hubo un error')  // Mensaje de error
                return
            }


        })
    }

    this.__get = (req, res) => {
        res.render('./viewsAdministrator/publications/view', {
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    }

    this.__gets = (req, res) => {
        // Publication.find({}, (err, storedPublications) => {  // Devuelve todos los datos de la tabla usuarios
        //     if (!err) {
        //         // Renderiza los posibles mensajes que le puede llegar a la vista
        //         res.render('./viewsAdministrator/publications/index', {
        //             publications : storedPublications,
        //             err          : req.flash('err'),
        //             warning      : req.flash('warning'),
        //             info         : req.flash('info'),
        //             success      : req.flash('success')
        //         })
        //     } else {
        //         console.log(`\n[ControllerPublications.getPublications]: Ups! parece que hubo un error => ${err}`)
        //         req.flash('err', '[Servidor]: Ups! parece que hubo un error en la base datos')
        //         res.redirect(redirect)  // Redirecciona y muestra el error
        //     }
        // })
        res.render('publications', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    }

    this.__update = (req, res) => {
        res.locals.storedPublication.title           = req.body.username
        res.locals.storedPublication.local.type      = req.body.email
        res.locals.storedPublication.updateDate.hour = moment().format('LT')
        res.locals.storedPublication.updateDate.date = moment().format('L')
        if (req.file != "" && req.file != undefined) {  // Actualizacion de foto solo si coloca una nueva
            console.log(`\n[ControllerPublication.updatePublication]: req.file: ${req.file}`)
            fs.unlink(req.file.path)  // Elimina el archivo anterior
            res.locals.storedPublication.photo = req.file.filename
        }
        res.locals.storedPublication.save( err => {
            if (err) {
                console.log(`\n[ControllerPublication.updatePublication]: Ups! parece que hubo un error => ${err}`)  // Guarda un mensaje de error solo si existe
                req.flash('err', '[Servidor]: Ups! parece que hubo un error')  // Guarda un mensaje de error solo si existe
                return
            }
            res.redirect(redirect)
        })
    }


    this.__delete = (req, res) => {
        Publication.findOneAndRemove({_id: req.params.id}, (err, storedPublication) => {
            if (!err) {
                // Si encuentra la imagen, la borra, y asi evita un error si no existe o esta dañada
                fs.stat('public/images/imagesPublications/' + storedPublication.image, (err, file) => {
                    if(!err && file.isFile()) {
                        console.log(`\n[ControllerPublication.deletePublication]: file => ${JSON.stringify(file)}`)
                        fs.unlink("public/images/imagesPublications/" + storedPublication.image)  // Elimina los datos creados con el usuario
                    } else {
                        console.log(`\n[ControllerPublication.deletePublication]: Ups. parece que hubo un error ${err}`)
                        return
                    }
                })
            } else {
                req.flash('err', '[Servidor]: Ups! parece que hubo un error')  // Guarda un mensaje de error
                return
            }
            res.redirect(redirect)
        })
    }

    this.__new = (req, res) => {
        return res.render('viewsAdministrator/publications/new', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    }

    this.__edit = (req, res) => {
        res.render('viewsAdministrator/publications/update', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    }

    return this
}
