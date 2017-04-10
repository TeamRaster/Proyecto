'use strict'

const fs = require('fs')
    , moment = require('moment')

module.exports = (app) => {

    this.__set = (req, res) => {
    }

    this.__get = (req, res) => {
    }

    this.__gets = (req, res) => {
        res.render('iDi', {
            err          : req.flash('err'),
            warning      : req.flash('warning'),
            info         : req.flash('info'),
            success      : req.flash('success')
        })
    }

    this.__update = (req, res) => {

    }


    this.__delete = (req, res) => {

    }

    this.__new = (req, res) => {

    }

    this.__edit = (req, res) => {

    }

    return this
}

