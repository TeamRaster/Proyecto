'use strict'

module.exports = (app) => {
    this.errorHandler = (err, req, res, next) => {  // Middleware que detecta todos los errores
        console.error(`[Middleware.err]: Se ha detectado un error: ${err}`)
        if (!err.status === 404) {
            next()
        } else if (err) {
            res.status(500).render('error505', { err: err })
        } else {
            res.status(404).render('error404', { err: 'Pagina no encontrada'})
         }
    }

    return this
}
