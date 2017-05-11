'use strict'

module.exports = (app) => {
    app.get('/technological-information', (req, res) => {
        res.render('technological-information', {
            user    : req.user,
            err     : req.flash('err'),
            warning : req.flash('warning'),
            info    : req.flash('info'),
            success : req.flash('success')
        })
    })

    return this
}

