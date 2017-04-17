'use strict'

module.exports = (app) => {
    app.get('/technological-information', (req, res) => {
        res.render('technological-information')
    })

    return this
}

