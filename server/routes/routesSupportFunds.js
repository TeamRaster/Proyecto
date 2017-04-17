'use strict'

const fs = require('fs')
    , multer = require('multer')

module.exports = (app) => {
    const SF = app.controllers.controllerSupportFunds
        , auth = app.middlewares.auth
        , find = app.middlewares.find
        , validate = app.middlewares.validations

    app.get('/supportfunds/new', [auth.isLogged, SF.__new])
    app.get('/supportfund/:id/edit', [auth.isLogged, SF.__edit])

    app.route('/supportfund/:id')
        .get([auth.isLogged, SF.__get])
        .put([auth.isLogged, SF.__update])
        .delete([auth.isLogged, SF.__delete])

    app.route('/supportfunds')
        .get([SF.__gets])
        .post([auth.isLogged, SF.__set])

    app.get('/support-funds', (req, res) => {
        res.render('supportfunds')
    })

    return this
}


